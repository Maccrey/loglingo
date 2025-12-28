import { NextResponse } from 'next/server';
import { GrokClient } from '@/infrastructure/api/grok';
import { 
  createSpeakingSession, 
  createSpeakingFeedback, 
  checkDuplicateArchive as checkDuplicate, 
  createArchive 
} from "@/infrastructure/firebase/admin-repository";
import { SpeakingFeedbackDiff } from '@/domain/speaking';

const TIMEOUT_MS = 30000;

function getModel() {
  return process.env.GROK_MODEL?.trim() || "grok-4-fast-non-reasoning";
}

// Helper to parse JSON safely
function safeParse(text: string) {
    try {
        // Remove code fences if present
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
    } catch {
        return null;
    }
}

async function getClient() {
  const key = process.env.GROK_API_KEY;
  // In development, we might not have a key, so we can return null to trigger mock
  if (!key) return null;
  return new GrokClient(key, process.env.GROK_BASE_URL);
}

interface AnalyzeRequest {
    text: string;
    targetSentence?: string; // Optional target sentence for comparison
    language: string;
    uiLanguage?: string;
}

function buildPrompt({ text, targetSentence, language, uiLanguage = 'en' }: AnalyzeRequest) {
    let prompt = `You are a helpful language tutor. 
    Analyze the spoken sentence: "${text}"
    Target Language: ${language}
    UI Language (Native Language for Explanations): ${uiLanguage}
    
    IMPORTANT: All evaluations, grammar notes, root meanings, and advice MUST be provided in the UI Language (${uiLanguage}). 
    Do NOT output explanations in English unless the UI Language is English.
    `;

    if (targetSentence) {
        prompt += `Target Sentence (Goal): "${targetSentence}"\n`;
        prompt += `Compare the spoken sentence with the Target Sentence.\n`;
    }

    prompt += `
    Return JSON format only:
    {
      "improved": "Better/Natural version in target language (or same if good)",
      "grammarNotes": ["Grammar point 1 in ${uiLanguage}", "Grammar point 2 in ${uiLanguage}"],
      "rootMeaningGuide": {
        "word_in_target": "Root meaning/Image explanation in ${uiLanguage} ONLY"
      },
      "diff": [
        { "type": "correct" | "incorrect" | "missing" | "extra", "word": "word" }
      ],
      "accuracyScore": number (0-100),
      "estimatedLevel": "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
      "advice": "Specific advice in ${uiLanguage} about what to practice next"
    }
    
    Rules:
    - "estimatedLevel": Estimate the CEFR level of the *spoken sentence* based on vocabulary, grammar complexity, and fluency/accuracy relative to the target sentence.
    - "improved" must be in target language.
    - "grammarNotes" must be in ${uiLanguage}.
    - "rootMeaningGuide" keys are key words from the sentence, values are explanations in ${uiLanguage} focusing on core 'root' image/meaning.
    - If "Target Sentence" is provided, calculate "accuracyScore" based on similarity.
    - "diff" should show word-by-word comparison if Target Sentence exists. If not, just analyze the spoken sentence structure.
    - "advice" should be actionable and in ${uiLanguage}.
    - STRICTLY IGNORE punctuation (periods, commas) and capitalization in the spoken sentence. Do not mention them in "grammarNotes" or "diff" unless they critically alter meaning.
    - Focus analysis on vocabulary, sentence structure, and natural spoken phrasing.
    - Do not use terms like "run-on sentence" or "period missing" for spoken text.
    `;
    return prompt;
}

export async function POST(req: Request) {
  try {
    const { text, targetSentence, language, userId, uiLocale } = await req.json();

    if (!text || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Save Session (Initial)
    const session = await createSpeakingSession({
        userId,
        language,
        transcript: text,
        durationSec: 0, 
        aiAnalyzed: false,
    });

    // 2. Call Grok
    const client = await getClient();
    if (!client) {
         // Mock response
         const mockData = mockFeedback(text, session.id, userId);
         const feedback = await createSpeakingFeedback({ ...mockData });
         return NextResponse.json({ feedback, session }, { status: 200 });
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const completion = await client.chatCompletion({
            messages: [
                { role: "system", content: "You are a helpful language tutor. Respond in JSON." },
                { role: "user", content: buildPrompt({ text, targetSentence, language, uiLanguage: uiLocale }) } 
            ],
            model: getModel(),
            temperature: 0.3,
            signal: controller.signal,
            response_format: { type: "json_object" } 
        });
        
        const parsed = safeParse(completion); 
        
        let feedbackData = parsed;
        if (!parsed) {
            console.error("Failed to parse Grok response", completion);
            feedbackData = mockFeedback(text, session.id, userId);
        }

        // 3. Save Feedback
        const feedback = await createSpeakingFeedback({
            sessionId: session.id,
            userId,
            original: text,
            improved: feedbackData.improved || text,
            grammarNotes: feedbackData.grammarNotes || [],
            rootMeaningGuide: feedbackData.rootMeaningGuide || {},
            diff: feedbackData.diff,
            accuracyScore: feedbackData.accuracyScore,
            estimatedLevel: feedbackData.estimatedLevel,
            advice: feedbackData.advice
        });

        // 4. Save to Learning Archive (Auto) - DISABLED as per user request
        // if (feedbackData.rootMeaningGuide) {
        //     const archivePromises = Object.entries(feedbackData.rootMeaningGuide).map(async ([word, meaning]) => {
        //         const title = word;
        //         const rootMeaning = meaning as string;
        //         
        //         // Check duplicate by title (word)
        //         const isDup = await checkDuplicate(userId, title);
        //         
        //         if (!isDup) {
        //             await createArchive({
        //                 userId,
        //                 type: 'word', 
        //                 title,
        //                 rootMeaning,
        //                 sourceId: session.id,
        //                 sourceType: 'speaking',
        //                 sourceText: text
        //             });
        //         }
        //     });
        //     
        //     await Promise.all(archivePromises);
        // }

        return NextResponse.json({ feedback, session });

    } catch (e) {
        console.error("Grok call failed", e);
        // Fallback to mock/error feedback but strictly we should probably fail or return partial
        // For MVP, lets return mock if API fails so user sees something
        const mockData = mockFeedback(text, session.id, userId);
        const feedback = await createSpeakingFeedback({ ...mockData });
        
        return NextResponse.json({ 
             feedback,
             session 
         }, { status: 200 });
    } finally {
        clearTimeout(timer);
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function mockFeedback(original: string, sessionId: string, userId: string) {
    return {
        sessionId,
        userId,
        original,
        improved: original + " (improved)",
        grammarNotes: ["This is a mock grammar note.", "Please configure Grok API Key."],
        rootMeaningGuide: { "mock": "This is a mock root meaning." },
        diff: [{ type: 'correct', word: original }] as SpeakingFeedbackDiff[],
        accuracyScore: 85,
        estimatedLevel: "B1",
        advice: "This is a mock advice. Please check API Key."
    };
}
