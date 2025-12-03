export interface Quiz {
  id: string;
  archiveId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  createdAt: Date;
}

export interface QuizDraft {
  archiveId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
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
