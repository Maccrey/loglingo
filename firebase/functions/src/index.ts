import * as admin from "firebase-admin";
import { onSchedule } from "firebase-functions/v2/scheduler";

admin.initializeApp();

/**
 * 학습 데이터 집계 함수
 * 매 4시간마다 실행되어 전체 사용자의 학습 통계를 계산하고
 * stats_global/learning 문서에 저장합니다.
 */
export const refreshLearningStats = onSchedule(
  {
    schedule: "every 4 hours",
    timeZone: "Asia/Seoul",
    memory: "256MiB",
  },
  async (event) => {
    const db = admin.firestore();

    try {
      console.log("🔄 Starting learning stats refresh...");

      // 1. learning_archive 전체 개수
      const archivesSnap = await db.collection("learning_archive").get();
      const totalArchives = archivesSnap.size;

      // 2. 전체 사용자 수
      const usersSnap = await db.collection("users").get();
      const userCount = usersSnap.size || 1;

      // 3. 최근 7일 일기 개수
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const diariesSnap = await db
        .collection("diaries")
        .where("createdAt", ">=", admin.firestore.Timestamp.fromDate(sevenDaysAgo))
        .get();
      const diaries7d = Math.round(diariesSnap.size / userCount);

      // 4. 미완료 advice 개수
      const adviceSnap = await db
        .collectionGroup("advice")
        .where("completed", "==", false)
        .get();
      const adviceOpen = Math.round(adviceSnap.size / userCount);

      // 5. 레벨 평균 계산
      const levelSnap = await db.collectionGroup("level").get();
      let totalScore = 0;
      let scoreCount = 0;
      const levelFreq: Record<string, number> = {};

      levelSnap.forEach((doc) => {
        const data = doc.data();
        if (typeof data.score === "number") {
          totalScore += data.score;
          scoreCount++;
        }
        if (data.level) {
          levelFreq[data.level] = (levelFreq[data.level] || 0) + 1;
        }
      });

      const avgScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 65;
      const mostCommonLevel =
        Object.keys(levelFreq).length > 0
          ? Object.keys(levelFreq).reduce((a, b) =>
              levelFreq[a] > levelFreq[b] ? a : b
            )
          : "B1";

      // 6. 평균 및 목표 계산
      const average = {
        diaries7d: Math.max(diaries7d, 3),
        archivesTotal: Math.round(totalArchives / userCount) || 12,
        adviceOpen: adviceOpen || 2,
        level: mostCommonLevel,
        score: avgScore,
      };

      const target = {
        diaries7d: average.diaries7d + 2,
        archivesTotal: average.archivesTotal + 5,
        adviceOpen: 0,
        level: getNextLevel(average.level),
        score: Math.min(100, average.score + 10),
      };

      // 7. Firestore에 저장
      await db.doc("stats_global/learning").set(
        {
          average,
          target,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      console.log("✅ Learning stats refreshed successfully", {
        userCount,
        totalArchives,
        average,
        target,
      });
    } catch (error) {
      console.error("❌ Failed to refresh learning stats:", error);
      throw error;
    }
  }
);

/**
 * 다음 레벨을 반환하는 헬퍼 함수
 */
function getNextLevel(currentLevel: string): string {
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const idx = levels.indexOf(currentLevel);
  return idx >= 0 && idx < levels.length - 1 ? levels[idx + 1] : "C2";
}
