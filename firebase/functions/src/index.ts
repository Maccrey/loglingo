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
      let totalArchives = 0;
      try {
        const archivesSnap = await db.collection("learning_archive").get();
        totalArchives = archivesSnap.size;
      } catch (error) {
        console.warn("⚠️ Failed to fetch learning_archive:", error);
      }

      // 2. 전체 사용자 수
      let userCount = 1;
      try {
        const usersSnap = await db.collection("users").get();
        userCount = usersSnap.size || 1;
      } catch (error) {
        console.warn("⚠️ Failed to fetch users:", error);
      }

      // 3. 최근 7일 일기 개수
      let diaries7d = 3;
      try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const diariesSnap = await db
          .collection("diaries")
          .where("createdAt", ">=", admin.firestore.Timestamp.fromDate(sevenDaysAgo))
          .get();
        diaries7d = Math.round(diariesSnap.size / userCount);
      } catch (error) {
        console.warn("⚠️ Failed to fetch diaries:", error);
      }

      // 4. 미완료 advice 개수 (단순 카운트로 변경)
      let adviceOpen = 2;
      try {
        const adviceSnap = await db.collectionGroup("advice").get();
        const incomplete = adviceSnap.docs.filter(doc => doc.data().completed === false).length;
        adviceOpen = Math.round(incomplete / userCount);
      } catch (error) {
        console.warn("⚠️ Failed to fetch advice:", error);
      }

      // 5. 레벨 평균 계산
      let avgScore = 65;
      let mostCommonLevel = "B1";
      try {
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

        if (scoreCount > 0) {
          avgScore = Math.round(totalScore / scoreCount);
        }
        if (Object.keys(levelFreq).length > 0) {
          mostCommonLevel = Object.keys(levelFreq).reduce((a, b) =>
            levelFreq[a] > levelFreq[b] ? a : b
          );
        }
      } catch (error) {
        console.warn("⚠️ Failed to fetch level data:", error);
      }

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
