import { useState, useEffect } from 'react';
import { useAuth } from '@/application/auth/AuthProvider';
import { radioRepository } from '@/infrastructure/repositories/radio-repository';
import { RadioStation, RadioFavorite } from '@/domain/radio';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export function useRadioFavorites() {
  const { user } = useAuth();
  const t = useTranslations('radio');
  const [favorites, setFavorites] = useState<RadioFavorite[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites
  useEffect(() => {
    if (!user || !user.uid) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    if (!user || !user.uid) return;
    try {
      const data = await radioRepository.getFavorites(user.uid);
      setFavorites(data);
    } catch (error) {
      console.error("Failed to load favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (stationId: string) => {
    return favorites.some(f => f.id === stationId);
  };

  const toggleFavorite = async (station: RadioStation) => {
    if (!user || !user.uid) {
      toast.error(t('login_required') || 'Login required');
      return;
    }

    try {
      if (isFavorite(station.id)) {
        await radioRepository.removeFavorite(user.uid, station.id);
        // Immediately update local state for instant UI feedback
        setFavorites(prev => prev.filter(f => f.id !== station.id));
        toast.success(t('removed_favorite') || 'Removed from favorites');
        await loadFavorites(); // Reload to ensure consistency and proper timestamp updates
      } else {
        await radioRepository.addFavorite(user.uid, station);
        // Reload to get the newly added favorite with proper data
        await loadFavorites();
        toast.success(t('added_favorite') || 'Added to favorites');
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error(t('error') || 'An error occurred');
      // Reload to ensure consistency after error
      await loadFavorites();
    }
  };

  return {
    favorites,
    loading,
    isFavorite,
    toggleFavorite
  };
}
