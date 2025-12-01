"use client";

import { Diary } from "@/domain/diary";
import {
  createDiary,
  deleteDiary,
  DiaryPayload,
  getDiary,
  listDiaries,
  updateDiary,
} from "./diary-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const listKey = (userId: string, year?: number) => [
  "diaries",
  userId,
  year ?? "all",
];
const detailKey = (id: string) => ["diary", id];

export function useDiaryList(userId: string, year?: number) {
  return useQuery({
    queryKey: listKey(userId, year),
    queryFn: () => listDiaries(userId, year),
    enabled: Boolean(userId),
  });
}

export function useDiaryDetail(userId: string, id?: string) {
  return useQuery({
    queryKey: detailKey(id || "new"),
    queryFn: () => getDiary(userId, id as string),
    enabled: Boolean(userId && id),
  });
}

export function useDiaryMutations(userId: string) {
  const queryClient = useQueryClient();
  type MutationOptions = DiaryPayload & {
    onUploadProgress?: (progress: number) => void;
  };

  const invalidateLists = () =>
    queryClient.invalidateQueries({ queryKey: ["diaries", userId] });

  const updateCachedLists = (
    updater: (diary: Diary) => Diary | null | undefined
  ) => {
    const queries = queryClient.getQueriesData<Diary[]>({
      queryKey: ["diaries", userId],
    });

    queries.forEach(([key, value]) => {
      if (!value) return;
      const next = value
        .map((item) => updater(item))
        .filter(Boolean) as Diary[];
      queryClient.setQueryData(key, next);
    });
  };

  const create = useMutation({
    mutationFn: (payload: MutationOptions) =>
      createDiary(userId, payload, {
        onUploadProgress: payload.onUploadProgress,
      }),
    onMutate: async (variables: MutationOptions) => {
      await queryClient.cancelQueries({ queryKey: ["diaries", userId] });
      const previous = queryClient.getQueriesData<Diary[]>({
        queryKey: ["diaries", userId],
      });
      const optimistic: Diary = {
        id: `temp-${Date.now()}`,
        userId,
        date: variables.date,
        content: variables.content,
        imageUrl: undefined,
        aiReviewed: false,
        createdAt: new Date(),
      };
      const queries = queryClient.getQueriesData<Diary[]>({
        queryKey: ["diaries", userId],
      });
      queries.forEach(([key, value]) => {
        const next = value ? [optimistic, ...value] : [optimistic];
        queryClient.setQueryData(key, next);
      });
      return { previous };
    },
    onError: (_err, _variables, context) => {
      context?.previous?.forEach(([key, value]) =>
        queryClient.setQueryData(key, value)
      );
    },
    onSuccess: (data) => {
      invalidateLists();
      queryClient.setQueryData(detailKey(data.id), data);
    },
  });

  const update = useMutation({
    mutationFn: (args: { id: string; payload: MutationOptions }) =>
      updateDiary(args.id, userId, args.payload, {
        onUploadProgress: args.payload.onUploadProgress,
      }),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ["diaries", userId] });
      const previous = queryClient.getQueriesData<Diary[]>({
        queryKey: ["diaries", userId],
      });

      updateCachedLists((item) =>
        item.id === id
          ? { ...item, content: payload.content, date: payload.date }
          : item
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      context?.previous?.forEach(([key, value]) =>
        queryClient.setQueryData(key, value)
      );
    },
    onSuccess: (data) => {
      invalidateLists();
      queryClient.setQueryData(detailKey(data.id), data);
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteDiary(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["diaries", userId] });
      const previous = queryClient.getQueriesData<Diary[]>({
        queryKey: ["diaries", userId],
      });

      updateCachedLists((item) => (item.id === id ? null : item));

      return { previous };
    },
    onError: (_err, _vars, context) => {
      context?.previous?.forEach(([key, value]) =>
        queryClient.setQueryData(key, value)
      );
    },
    onSuccess: () => {
      invalidateLists();
    },
  });

  return { create, update, remove };
}
