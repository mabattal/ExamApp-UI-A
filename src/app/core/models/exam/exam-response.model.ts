import { Question } from '../question/question-response.model';

export interface Exam {
  examId: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  questions: Question[];
}
