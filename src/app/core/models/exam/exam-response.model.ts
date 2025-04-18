import { QuestionResponseModel } from "../question/questionResponse.model";


export interface Exam {
  examId: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  questions: QuestionResponseModel[];
}
