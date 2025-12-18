import { useState, useEffect } from 'react';
import { useAuth } from '@/application/auth/AuthProvider';
import { radioRepository } from '@/infrastructure/repositories/radio-repository';
import { RadioStation, RadioFavorite } from '@/domain/radio';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { GeoPoint } from 'firebase/firestore';

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
    if (!user || !user.uid) {
      console.log('[useRadioFavorites] loadFavorites skipped - no user');
      return;
    }
    try {
      console.log('[useRadioFavorites] loadFavorites started for user:', user.uid);
      const data = await radioRepository.getFavorites(user.uid);
      console.log('[useRadioFavorites] loadFavorites received', data.length, 'favorites');
      setFavorites(data);
    } catch (error) {
      console.error("[useRadioFavorites] Failed to load favorites:", error);
      // Only show error toast if it's a real error, not just empty state
      if (error instanceof Error) {
        toast.error(t('error') || 'Failed to load favorites');
      }
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
        console.log('[useRadioFavorites] Removing favorite:', station.id);
        await radioRepository.removeFavorite(user.uid, station.id);
        // Immediately update local state for instant UI feedback
        setFavorites(prev => prev.filter(f => f.id !== station.id));
        toast.success(t('removed_favorite') || 'Removed from favorites');
        await loadFavorites(); // Reload to ensure consistency and proper timestamp updates
      } else {
        console.log('[useRadioFavorites] Adding favorite:', station.id, station.name);
        
        // Optimistic update: 즉시 로컬 state에 추가하여 UI 반응 개선
        const newFavorite: RadioFavorite = {
          id: station.id,
          userId: user.uid,
          stationName: station.name,
          stationUrl: station.urlResolved || station.url,
          stationFavicon: station.favicon,
          country: station.country,
          language: station.language[0] || 'Unknown',
          coordinates: new GeoPoint(station.geoLat || 0, station.geoLong || 0),
          createdAt: new Date(),
        };
        
        // 즉시 로컬 state 업데이트 (삭제 로직과 일관성 유지)
        setFavorites(prev => [newFavorite, ...prev]);
        toast.success(t('added_favorite') || 'Added to favorites');
        
        // 백그라운드에서 서버에 저장 및 동기화
        await radioRepository.addFavorite(user.uid, station);
        await loadFavorites(); // 서버와 동기화하여 정확한 데이터 보장
      }
    } catch (error) {
      console.error("[useRadioFavorites] Failed to toggle favorite:", error);
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
