import { GeoPoint } from 'firebase/firestore';

export interface RadioStation {
  id: string; // station UUID
  name: string;
  url: string; // Stream URL
  urlResolved: string;
  homepage: string;
  favicon: string;
  tags: string[];
  country: string;
  countryCode: string;
  language: string[];
  votes: number;
  geoLat: number | null;
  geoLong: number | null;
}

export interface RadioFavorite {
  id: string; // station UUID
  userId: string;
  stationName: string;
  stationUrl: string;
  stationFavicon: string;
  country: string;
  language: string; // Primary language
  coordinates: GeoPoint;
  createdAt: Date;
}

export interface RadioStats {
  userId: string;
  totalSeconds: number;
  byLanguage: Record<string, number>; // e.g. { "en": 3600, "es": 120 }
  lastListenedAt: Date;
}

export interface RadioRepository {
  // Favorites
  addFavorite(userId: string, station: RadioStation): Promise<void>;
  removeFavorite(userId: string, stationId: string): Promise<void>;
  getFavorites(userId: string): Promise<RadioFavorite[]>;
  isFavorite(userId: string, stationId: string): Promise<boolean>;

  // Stats
  updateListeningTime(userId: string, language: string, seconds: number): Promise<void>;
  getStats(userId: string): Promise<RadioStats | null>;
}
