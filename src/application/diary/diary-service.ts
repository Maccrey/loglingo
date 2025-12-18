"use client";

import {
  Diary,
  DiaryDraft,
  DiaryRepository,
  validateDiaryInput,
} from "@/domain/diary";
import { convertImageToWebP } from "@/lib/image";
import { firebaseDiaryRepository } from "@/infrastructure/firebase/diary-repository";

export interface DiaryPayload {
  date: string;
  content: string;
  imageFile?: File | null;
  removeImage?: boolean;
}

export class DiaryValidationError extends Error {
  reasons: string[];
  constructor(reasons: string[]) {
    super("Invalid diary input");
    this.reasons = reasons;
  }
}

const repository: DiaryRepository & {
  uploadDiaryImage: typeof firebaseDiaryRepository.uploadDiaryImage;
} = firebaseDiaryRepository;

export async function listDiaries(userId: string, year?: number) {
  return repository.listByUser(userId, year);
}

export async function getDiary(userId: string, id: string) {
  return repository.getById(userId, id);
}

export async function createDiary(
  userId: string,
  payload: DiaryPayload,
  opts?: { onUploadProgress?: (progress: number) => void }
): Promise<Diary> {
  const validation = validateDiaryInput({
    date: payload.date,
    content: payload.content,
  });

  if (!validation.valid) {
    throw new DiaryValidationError(validation.errors);
  }

  const draft: DiaryDraft = {
    userId,
    date: payload.date,
    content: payload.content.trim(),
    aiReviewed: false,
  };

  if (payload.imageFile) {
    const { file } = await convertImageToWebP(payload.imageFile);
    const uploaded = await repository.uploadDiaryImage(
      file,
      userId,
      opts?.onUploadProgress
    );
    draft.imageUrl = uploaded.url;
  }

  return repository.create(draft);
}

export async function updateDiary(
  id: string,
  userId: string,
  payload: DiaryPayload,
  opts?: { onUploadProgress?: (progress: number) => void }
): Promise<Diary> {
  const validation = validateDiaryInput({
    date: payload.date,
    content: payload.content,
  });

  if (!validation.valid) {
    throw new DiaryValidationError(validation.errors);
  }

  const draft: Partial<DiaryDraft> = {
    date: payload.date,
    content: payload.content.trim(),
  };

  if (payload.removeImage) {
    draft.imageUrl = "";
  }

  if (payload.imageFile) {
    const { file } = await convertImageToWebP(payload.imageFile);
    const uploaded = await repository.uploadDiaryImage(
      file,
      userId,
      opts?.onUploadProgress
    );
    draft.imageUrl = uploaded.url;
  }

  return repository.update(id, draft);
}

export async function deleteDiary(id: string) {
  return repository.delete(id);
}
