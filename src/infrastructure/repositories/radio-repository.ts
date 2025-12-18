import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  Timestamp, 
  increment,
  updateDoc,
  GeoPoint
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RadioRepository, RadioStation, RadioFavorite, RadioStats } from '@/domain/radio';

export class FirebaseRadioRepository implements RadioRepository {
  
  async addFavorite(userId: string, station: RadioStation): Promise<void> {
    try {
      console.log('[RadioRepository] addFavorite started for station:', station.id, station.name);
      const favoriteRef = doc(db, `users/${userId}/radio_favorites`, station.id);
      const favoriteData: RadioFavorite = {
        id: station.id,
        userId,
        stationName: station.name,
        stationUrl: station.urlResolved || station.url,
        stationFavicon: station.favicon,
        country: station.country,
        language: station.language[0] || 'Unknown',
        coordinates: new GeoPoint(station.geoLat || 0, station.geoLong || 0),
        createdAt: new Date(),
      };
      
      // Convert Date to Timestamp for Firestore
      const dataToSave = {
        ...favoriteData,
        createdAt: Timestamp.fromDate(favoriteData.createdAt)
      };

      await setDoc(favoriteRef, dataToSave);
      console.log('[RadioRepository] addFavorite completed successfully');
    } catch (error) {
      console.error('[RadioRepository] addFavorite error:', error);
      throw error;
    }
  }

  async removeFavorite(userId: string, stationId: string): Promise<void> {
    const favoriteRef = doc(db, `users/${userId}/radio_favorites`, stationId);
    await deleteDoc(favoriteRef);
  }

  async getFavorites(userId: string): Promise<RadioFavorite[]> {
    try {
      console.log('[RadioRepository] getFavorites started for userId:', userId);
      const favoritesRef = collection(db, `users/${userId}/radio_favorites`);
      // Remove orderBy to avoid Firestore index requirement on subcollection
      // We'll sort on client side instead
      const snapshot = await getDocs(favoritesRef);

      console.log('[RadioRepository] getFavorites snapshot size:', snapshot.size);

      const favorites = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          createdAt: (data.createdAt as Timestamp).toDate()
        } as RadioFavorite;
      });

      // Sort by createdAt descending on client side
      favorites.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      console.log('[RadioRepository] getFavorites returning', favorites.length, 'favorites');
      return favorites;
    } catch (error) {
      console.error('[RadioRepository] getFavorites error:', error);
      throw error;
    }
  }

  async isFavorite(userId: string, stationId: string): Promise<boolean> {
    const favoriteRef = doc(db, `users/${userId}/radio_favorites`, stationId);
    const snapshot = await getDoc(favoriteRef);
    return snapshot.exists();
  }

  async updateListeningTime(userId: string, language: string, seconds: number): Promise<void> {
    const statsRef = doc(db, `users/${userId}/stats/radio`);
    
    // Use atomic increments
    // Note: We need to use dot notation for nested map updates in 'byLanguage'
    // but Firestore 'updateDoc' with dot notation requires the document to exist.
    // So usually we use setDoc with merge for safety or transaction.
    // For simplicity with increment, we can try setDoc with merge but increment inside merge might be tricky for nested fields if map doesn't exist.
    // Let's use setDoc with merge and predefined structure if possible, 
    // or checks. But simplest is updateDoc if we know it exists, or setDoc for init.
    // Let's assume we initialize it if not exists.
    
    // However, `increment` works with `setDoc(..., { merge: true })`.
    
    const updateData: any = {
      totalSeconds: increment(seconds),
      lastListenedAt: Timestamp.now(),
      [`byLanguage.${language}`]: increment(seconds)
    };

    await setDoc(statsRef, updateData, { merge: true });
  }

  async getStats(userId: string): Promise<RadioStats | null> {
    const statsRef = doc(db, `users/${userId}/stats/radio`);
    const snapshot = await getDoc(statsRef);
    
    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();
    
    // Convert flat 'byLanguage.korean' fields to nested { korean: value }
    const byLanguage: Record<string, number> = {};
    Object.keys(data).forEach(key => {
      if (key.startsWith('byLanguage.')) {
        const language = key.replace('byLanguage.', '');
        byLanguage[language] = data[key];
      }
    });
    
    return {
      userId,
      totalSeconds: data.totalSeconds || 0,
      byLanguage,
      lastListenedAt: (data.lastListenedAt as Timestamp).toDate()
    };
  }
}

export const radioRepository = new FirebaseRadioRepository(); // Singleton instance
