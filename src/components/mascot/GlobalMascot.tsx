'use client';

import { usePathname } from 'next/navigation';
import { DuckMascot } from './DuckMascot';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useAuth } from '@/application/auth/AuthProvider';

type PageContext = 'home' | 'diary' | 'speaking' | 'radio' | 'challenge' | 'default';

export default function GlobalMascot() {
  const pathname = usePathname();
  const t = useTranslations('mascot');
  const { user, loading } = useAuth(); // Get auth state
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

  if (!mounted || loading) return null; // Wait for auth loading

  // Determine speech text
  const messageKeyBase = context === 'default' ? 'home' : context;
  
  // Logic: Guest on Main Page -> Specific Message + Auto Hatch
  // Logic: Others -> Random Mesasge + No Egg/Auto Hatch (Just Duck)
  
  const isMainPage = context === 'home' || context === 'default';
  const isGuest = !user;
  const isGuestOnMain = isGuest && isMainPage;

  let speech = '';
  if (isGuestOnMain) {
    const guestMsgIndex = ((msgIndex - 1) % 25) + 1; // Map 1-26 to 1-25
    speech = t(`guest.message_${guestMsgIndex}`);
  } else {
    // Regular random message
    speech = t(`${messageKeyBase}.message_${msgIndex}`);
  }
  
  let mode: 'teacher' | 'thinking' | 'party' | 'lonely' = 'teacher';
  
  switch (context) {
    case 'home': mode = 'teacher'; break;
    case 'diary': mode = 'thinking'; break;
    case 'speaking': mode = 'party'; break;
    case 'radio': mode = 'lonely'; break; // Listening attentively
    case 'challenge': mode = 'party'; break;
    default: mode = 'teacher';
  }

  const handleCrack = () => {
    // Pick a new random message index between 1 and 26 when egg is clicked
    const randomIdx = Math.floor(Math.random() * 26) + 1;
    setMsgIndex(randomIdx);
  };

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
       {/* DuckMascot handles pointer events internally for interactions */}
       <div className="pointer-events-auto">
         <DuckMascot 
           key={pathname} // Reset on path change to trigger auto-hatch
           mode={mode} 
           speech={speech} 
           bubbleSide="left" 
           enableEgg={true} // Enable lifecycle everywhere
           width={160}
           height={160}
           onCrack={handleCrack}
         />
       </div>
    </div>
  );
}

