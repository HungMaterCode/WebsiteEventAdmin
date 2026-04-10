export type QuestionType = 'choice' | 'text';

export interface Question {
  id: string;
  text: string;
  type: QuestionType | string;
  options: string[];
  placeholder?: string;
  order: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Answer {
  questionId: string;
  answer: string;
  timeSpentMs: number;
  startTime: number;
  endTime: number;
}

export interface SurveySubmission {
  answers: Answer[];
  totalTimeSpend: number; // in seconds
}
