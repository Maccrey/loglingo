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
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;
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
    if (!user) {
      toast.error(t('login_required') || 'Login required');
      return;
    }

    try {
      if (isFavorite(station.id)) {
        await radioRepository.removeFavorite(user.uid, station.id);
        setFavorites(prev => prev.filter(f => f.id !== station.id));
        toast.success(t('removed_favorite') || 'Removed from favorites');
      } else {
        await radioRepository.addFavorite(user.uid, station);
        // Optimistically add to list (re-fetch is safer but slower, lets manually construct)
        // Actually re-fetching is fine or constructing object.
        await loadFavorites(); // reload to get proper timestamp
        toast.success(t('added_favorite') || 'Added to favorites');
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error(t('error') || 'An error occurred');
    }
  };

  return {
    favorites,
    loading,
    isFavorite,
    toggleFavorite
  };
}
