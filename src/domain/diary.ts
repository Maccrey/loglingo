export interface Diary {
  id: string;
  userId: string;
  date: string; // yyyy-mm-dd
  content: string;
  imageUrl?: string;
  aiReviewed: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface DiaryDraft {
  userId: string;
  date: string;
  content: string;
  imageUrl?: string;
  aiReviewed?: boolean;
}

export interface DiaryImageUploadResult {
  url: string;
  path: string;
}

export interface DiaryRepository {
  listByUser(userId: string, year?: number): Promise<Diary[]>;
  getById(userId: string, id: string): Promise<Diary | null>;
  create(input: DiaryDraft): Promise<Diary>;
  update(id: string, input: Partial<DiaryDraft>): Promise<Diary>;
  delete(id: string): Promise<void>;
}

export function validateDiaryInput(input: Pick<DiaryDraft, "date" | "content">) {
  const errors: string[] = [];

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
    errors.push("invalid-date");
  }

  const trimmed = input.content.trim();
  if (!trimmed) {
    errors.push("empty-content");
  }

  if (trimmed.length > 5000) {
    errors.push("too-long");
  }

  return { valid: errors.length === 0, errors };
}
