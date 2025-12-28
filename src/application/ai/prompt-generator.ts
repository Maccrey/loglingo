import { listArchive } from "@/infrastructure/firebase/archive-repository";
import { firebaseDiaryRepository } from "@/infrastructure/firebase/diary-repository";
import { getRecentFeedbacks } from "@/infrastructure/firebase/speaking-repository";
import { LearningArchive } from "@/domain/archive";
import { SpeakingFeedback } from "@/domain/speaking";

interface UserContext {
  userId: string;
  learningLanguage: string;
  uiLanguageName: string;
  userLevel?: string; // e.g. "B1", "Intermediate"
}

export async function generateSpeakingPracticePrompt(context: UserContext): Promise<string> {
  const { userId, learningLanguage, uiLanguageName, userLevel } = context;

  // 1. Fetch Data in Parallel
  const [archives, diaries, feedbacks] = await Promise.all([
    listArchive(userId),
    firebaseDiaryRepository.listByUser(userId),
    getRecentFeedbacks(userId, 3),
  ]);

  // 2. Process Data
  // Get recent 5 archives
  const recentArchives = archives.slice(0, 5).map(a => `${a.title} (${a.rootMeaning})`);
  
  // Get latest diary entry
  const latestDiary = diaries.length > 0 ? diaries[0] : null;

  // Get recent feedback weak points
  const weakPoints = feedbacks.flatMap(f => f.grammarNotes).slice(0, 5);
  
  // Deduce level if not provided
  const currentLevel = userLevel || (feedbacks.length > 0 ? feedbacks[0].estimatedLevel : "Beginner");

  // 3. Construct Prompt
  let prompt = `Act as a professional language tutor for ${learningLanguage}.\n`;
  prompt += `I want to practice speaking to improve my level${currentLevel ? ` (current: ${currentLevel})` : ""}.\n\n`;

  prompt += `Please create a roleplay scenario or discussion topic based on my recent learning context:\n`;
  
  if (latestDiary) {
    prompt += `\n[My Recent Diary (${latestDiary.date})]\n${latestDiary.content.substring(0, 300)}${latestDiary.content.length > 300 ? "..." : ""}\n`;
  }

  if (recentArchives.length > 0) {
    prompt += `\n[Vocab/Expressions I learned recently]\n- ${recentArchives.join("\n- ")}\n`;
  }

  if (weakPoints.length > 0) {
    prompt += `\n[My Weakness/Feedback]\n- ${weakPoints.join("\n- ")}\n`;
  }

  prompt += `\nInstructions:\n`;
  prompt += `1. Suggest a specific topic or scenario related to my diary or vocab.\n`;
  prompt += `2. Start the conversation by asking me a question in ${learningLanguage}.\n`;
  prompt += `3. Correct my mistakes gently and guide me to use the vocab I learned.\n`;
  prompt += `4. Keep your responses concise (1-2 sentences) to let me speak more.\n`;
  
  if (uiLanguageName && uiLanguageName !== learningLanguage) {
     prompt += `5. If I don't understand, you can explain in ${uiLanguageName}.\n`;
  }

  return prompt;
}
