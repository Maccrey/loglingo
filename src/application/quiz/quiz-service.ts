import { Quiz, QuizDraft, randomizeQuizOptions } from "@/domain/quiz";
import { getQuizByArchiveId, createQuiz } from "@/infrastructure/firebase/quiz-repository";

interface GenerateQuizRequest {
  title: string;
  rootMeaning: string;
  examples: string[];
  uiLocale: string;
  learningLanguage: string;
}

async function generateQuizWithGrok(
  request: GenerateQuizRequest
): Promise<{ options: string[]; correctIndex: number; explanation: string } | null> {
  try {
    const response = await fetch("/api/quiz/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      console.error("Quiz generation API failed:", response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Quiz generation request failed:", error);
    return null;
  }
}

export async function getOrGenerateQuiz(
  userId: string, // Added userId
  archiveId: string,
  title: string,
  rootMeaning: string,
  examples: string[],
  question: string,
  uiLocale: string,
  learningLanguage: string
): Promise<Quiz | null> {
  console.log("🎯 Quiz Service: getOrGenerateQuiz", { archiveId, title, userId });

  // 1. Check if quiz exists in Firebase
  const existingQuiz = await getQuizByArchiveId(archiveId);
  if (existingQuiz) {
    console.log("✅ Quiz Service: Found existing quiz", { quizId: existingQuiz.id });
    return randomizeQuizOptions(existingQuiz);
  }

  console.log("🤖 Quiz Service: No quiz found, generating with Grok AI...");

  // 2. Generate quiz with Grok AI
  const generated = await generateQuizWithGrok({
    title,
    rootMeaning,
    examples,
    uiLocale,
    learningLanguage,
  });

  if (!generated) {
    console.error("❌ Quiz Service: Quiz generation failed");
    return null;
  }

  // 3. Save to Firebase
  const draft: QuizDraft = {
    userId, // Save userId
    archiveId,
    question,
    options: generated.options,
    correctIndex: generated.correctIndex,
    explanation: generated.explanation,
  };

  const savedQuiz = await createQuiz(draft);
  console.log("💾 Quiz Service: Quiz saved to Firebase", { quizId: savedQuiz.id });

  return randomizeQuizOptions(savedQuiz);
}
