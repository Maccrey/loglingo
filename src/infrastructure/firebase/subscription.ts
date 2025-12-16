import { 
  doc, 
  getDoc, 
  setDoc, 
  Timestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface UserSubscription {
  userId: string;
  isPremium: boolean;
  subscriptionType?: "monthly" | "yearly" | "lifetime";
  startDate?: Timestamp;
  endDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * 사용자 구독 정보 조회
 */
export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  if (!userId) return null;
  
  try {
    const subscriptionRef = doc(db, "subscriptions", userId);
    const subscriptionSnap = await getDoc(subscriptionRef);
    
    if (subscriptionSnap.exists()) {
      return subscriptionSnap.data() as UserSubscription;
    }
    
    // 구독 정보가 없으면 기본값 생성
    const defaultSubscription: UserSubscription = {
      userId,
      isPremium: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    await setDoc(subscriptionRef, defaultSubscription);
    return defaultSubscription;
    
  } catch (error) {
    console.error("Failed to get user subscription:", error);
    return null;
  }
}

/**
 * 사용자 구독 정보 업데이트
 */
export async function updateUserSubscription(
  userId: string,
  isPremium: boolean,
  subscriptionType?: "monthly" | "yearly" | "lifetime"
): Promise<void> {
  if (!userId) throw new Error("User ID is required");
  
  try {
    const subscriptionRef = doc(db, "subscriptions", userId);
    const existingDoc = await getDoc(subscriptionRef);
    
    const updateData: Partial<UserSubscription> = {
      userId,
      isPremium,
      updatedAt: Timestamp.now(),
    };
    
    if (subscriptionType) {
      updateData.subscriptionType = subscriptionType;
    }
    
    if (!existingDoc.exists()) {
      // 새로 생성
      await setDoc(subscriptionRef, {
        ...updateData,
        createdAt: Timestamp.now(),
      });
    } else {
      // 기존 문서 업데이트
      await setDoc(subscriptionRef, updateData, { merge: true });
    }
    
  } catch (error) {
    console.error("Failed to update user subscription:", error);
    throw error;
  }
}

/**
 * 구독 만료 확인
 * 만료된 경우 자동으로 isPremium을 false로 변경
 */
export async function checkSubscriptionExpiry(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  
  if (!subscription || !subscription.isPremium) {
    return false;
  }
  
  // 만료일이 있고, 현재 시간보다 이전이면 만료
  if (subscription.endDate) {
    const now = Timestamp.now();
    const isExpired = subscription.endDate.toMillis() < now.toMillis();
    
    if (isExpired) {
      // 자동으로 프리미엄 해제
      await updateUserSubscription(userId, false);
      return false;
    }
  }
  
  return true;
}
