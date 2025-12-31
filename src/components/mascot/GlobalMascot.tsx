'use client';

import { usePathname } from 'next/navigation';
import { DuckMascot } from './DuckMascot';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type PageContext = 'home' | 'diary' | 'speaking' | 'radio' | 'challenge' | 'default';

export default function GlobalMascot() {
  const pathname = usePathname();
  const t = useTranslations('mascot');
  const [context, setContext] = useState<PageContext>('home');
  const [msgIndex, setMsgIndex] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!pathname) return;

    // improved path parsing to handle locale prefix
    // path examples: /en, /ko/diary, /ja/speaking/123
    const segments = pathname.split('/').filter(Boolean); // remove empty strings
    // segments[0] is usually locale (e.g. 'en')
    const mainSegment = segments[1]; // 'diary', 'speaking' etc.

    let newContext: PageContext = 'home';

    if (!mainSegment) {
        newContext = 'home';
    } else if (mainSegment.startsWith('diary')) {
        newContext = 'diary';
    } else if (mainSegment.startsWith('speaking')) {
        newContext = 'speaking';
    } else if (mainSegment.startsWith('radio')) {
        newContext = 'radio';
    } else if (mainSegment.startsWith('challenge')) {
        newContext = 'challenge';
    } else {
        newContext = 'default';
    }

    setContext(newContext);
    
    // Pick a random message index between 1 and 26
    const randomIdx = Math.floor(Math.random() * 26) + 1;
    setMsgIndex(randomIdx);

  }, [pathname]);

  if (!mounted) return null;

  // Determine speech text
  // format: mascot.{context}.message_{n}
  // fallback to generic if default
  const messageKeyBase = context === 'default' ? 'home' : context;
  const speech = t(`${messageKeyBase}.message_${msgIndex}`);
  
  // Custom Speech Bubble logic per page
  // Home: Right side, bubble Left.
  // Others: Maybe bottom right? Or same position for consistency?
  // User said "Mascot always visible... 18 languages... consistent UI"
  // I will keep it consistent at bottom-right or right-center.
  // Previous home button was Right Center.
  
  // We can vary the Duck Mode too!
  // Home -> Teacher (Greeting)
  // Diary -> Thinking (Reflective) or Teacher
  // Speaking -> Party (Encouraging)
  // Radio -> Lonely (Listening music?) or Thinking
  
  let mode: 'teacher' | 'thinking' | 'party' | 'lonely' = 'teacher';
  
  switch (context) {
    case 'home': mode = 'teacher'; break;
    case 'diary': mode = 'thinking'; break;
    case 'speaking': mode = 'party'; break;
    case 'radio': mode = 'lonely'; break; // Listening attentively
    case 'challenge': mode = 'party'; break;
    default: mode = 'teacher';
  }

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
       {/* DuckMascot handles pointer events internally for interactions */}
       <div className="pointer-events-auto">
         <DuckMascot 
           mode={mode} 
           speech={speech} 
           bubbleSide="left" 
           enableEgg={true} // Enable lifecycle everywhere
           width={120}
           height={120}
         />
       </div>
    </div>
  );
}
