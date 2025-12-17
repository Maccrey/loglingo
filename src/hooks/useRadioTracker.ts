import { useEffect, useRef } from 'react';
import { useAuth } from '@/application/auth/AuthProvider';
import { radioRepository } from '@/infrastructure/repositories/radio-repository';

export function useRadioTracker(
  isPlaying: boolean,
  language: string | undefined, // station language (e.g. "en")
  intervalSeconds: number = 60,
  onStatsUpdate?: () => void // Callback when stats are saved
) {
  const { user } = useAuth();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingSecondsRef = useRef(0);

  // Function to commit pending time to Firestore
  const commitTime = async () => {
    if (!user || !user.uid || !language || pendingSecondsRef.current === 0) {
      return;
    }

    try {
      await radioRepository.updateListeningTime(user.uid, language, pendingSecondsRef.current);
      pendingSecondsRef.current = 0;
      
      // Refresh stats UI after successful save
      console.log('✅ Stats saved - Language:', language, 'Seconds:', pendingSecondsRef.current);
      if (onStatsUpdate) {
        console.log('🔄 Calling onStatsUpdate to refresh UI');
        onStatsUpdate();
      }
    } catch (error) {
      console.error("Failed to update radio stats:", error);
    }
  };

  useEffect(() => {
    
    if (isPlaying && language && user && user.uid) {
      timerRef.current = setInterval(() => {
        // Increment pending seconds
        pendingSecondsRef.current += 1;

        // If we reach interval, commit
        if (pendingSecondsRef.current >= intervalSeconds) {
            commitTime();
        }

      }, 1000);
    } else {
      // If paused or stopped, clear timer and commit remaining
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      commitTime();
    }

    return () => {
      // On unmount/change
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      commitTime();
    };
  }, [isPlaying, language, user]); // intervalSeconds is static usually

  // Handle page visibility change or unload?
  // useEffect approach handles component unmount, but maybe not browser tab close perfectly (unreliable).
  // But sufficient for MVP.
}
