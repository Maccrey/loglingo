import { useState, useEffect } from 'react';
import { useAuth } from '@/application/auth/AuthProvider';
import { radioRepository } from '@/infrastructure/repositories/radio-repository';
import { RadioStats } from '@/domain/radio';

export function useRadioStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<RadioStats | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshStats = async () => {
    if (!user || !user.uid) {
        setStats(null);
        setLoading(false);
        return;
    }
    try {
        const data = await radioRepository.getStats(user.uid);
        setStats(data);
    } catch (error) {
        console.error("Failed to load radio stats:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    refreshStats();
  }, [user]);

  return { stats, loading, refreshStats };
}
