export interface Quiz {
  id: string;
  userId: string;
  archiveId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  quizType?: 'grammar' | 'word' | 'pattern'; // Type of quiz for differentiated UI/logic
  createdAt: Date;
}

export interface QuizDraft {
  userId: string;
  archiveId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  quizType?: 'grammar' | 'word' | 'pattern'; // Type of quiz for differentiated UI/logic
}

/**
 * Randomize quiz options and return with new correct index
 */
export function randomizeQuizOptions(quiz: Quiz): Quiz {
  const shuffled = quiz.options
    .map((option, index) => ({ option, index }))
    .sort(() => Math.random() - 0.5);
  
  const newCorrectIndex = shuffled.findIndex(
    item => item.index === quiz.correctIndex
  );
  
  return {
    ...quiz,
    options: shuffled.map(item => item.option),
    correctIndex: newCorrectIndex,
  };
}
