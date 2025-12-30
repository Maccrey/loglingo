import { Quiz, QuizDraft, randomizeQuizOptions } from "@/domain/quiz";
import { getQuizByArchiveId, createQuiz } from "@/infrastructure/firebase/quiz-repository";

function entryOriginRequiresMeaning(origin?: string) {
  return origin === "dictionary";
}

interface GenerateQuizRequest {
  title: string;
  type: 'grammar' | 'word' | 'pattern';
  rootMeaning: string;
  examples: string[];
  exampleSentences?: string[];
  uiLocale: string;
  learningLanguage: string;
  forceMeaning?: boolean;
  levelTag?: string;
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
  userId: string,
  archiveId: string,
  type: 'grammar' | 'word' | 'pattern',
  title: string,
  rootMeaning: string,
  examples: string[],
  exampleSentences: string[] | undefined,
  question: string,
  uiLocale: string,
  learningLanguage: string,
  levelTag?: string,
  entryOrigin?: string
): Promise<Quiz | null> {
  console.log("🎯 Quiz Service: getOrGenerateQuiz", { archiveId, title, type, userId });

  // 1. Check if quiz exists in Firebase
  const existingQuiz = await getQuizByArchiveId(archiveId, userId);
  if (existingQuiz) {
    console.log("✅ Quiz Service: Found existing quiz", { quizId: existingQuiz.id });
    return randomizeQuizOptions(existingQuiz);
  }

  console.log("🤖 Quiz Service: No quiz found, generating with Grok AI...");

  // 2. Generate quiz with Grok AI
  const generated = await generateQuizWithGrok({
    title,
    type,
    rootMeaning,
    examples,
    exampleSentences,
    uiLocale,
    learningLanguage,
    levelTag,
    forceMeaning: entryOriginRequiresMeaning(entryOrigin),
  });

  if (!generated) {
    console.error("❌ Quiz Service: Quiz generation failed");
    return null;
  }

  // 3. Save to Firebase
  const draft: QuizDraft = {
    userId,
    archiveId,
    question,
    options: generated.options,
    correctIndex: generated.correctIndex,
    explanation: generated.explanation,
    quizType: type, // Save quiz type
  };

  const savedQuiz = await createQuiz(draft);
  console.log("💾 Quiz Service: Quiz saved to Firebase", { quizId: savedQuiz.id });

  return randomizeQuizOptions(savedQuiz);
}
