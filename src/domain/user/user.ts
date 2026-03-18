export interface Streak {
  current: number;
  longest: number;
  /**
   * The date string representing the last time the user made an entry.
   * Format: "YYYY-MM-DD"
   */
  lastEntryDate: string;
}

export interface AppUser {
  id: string; // Firebase Auth UID
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  streak?: Streak;
  createdAt?: string;
  updatedAt?: string;
}
