import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/infrastructure/firebase/user-repository";

export function useUserProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      return getUserProfile(userId);
    },
    enabled: !!userId,
    // refresh often enough to catch streak updates?
    staleTime: 1000 * 60 * 5, 
  });
}
