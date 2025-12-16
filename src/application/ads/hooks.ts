"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserSubscription, updateUserSubscription } from "@/infrastructure/firebase/subscription";
import { useAuth } from "@/application/auth/AuthProvider";

export interface UserSubscription {
  userId: string;
  isPremium: boolean;
  subscriptionType?: "monthly" | "yearly" | "lifetime";
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 사용자 구독 정보 조회 Hook
 */
export function useUserSubscription() {
  const { user } = useAuth();
  const userId = user?.uid || "";
  
  return useQuery({
    queryKey: ["subscription", userId],
    queryFn: () => getUserSubscription(userId),
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  });
}

/**
 * 사용자 구독 정보 업데이트 Hook
 */
export function useSubscriptionMutation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.uid || "";
  
  return useMutation({
    mutationFn: (isPremium: boolean) => 
      updateUserSubscription(userId, isPremium),
    onSuccess: () => {
      // 캐시 무효화하여 최신 정보 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ["subscription", userId] });
    },
  });
}
