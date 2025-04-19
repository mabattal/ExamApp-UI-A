import { QuestionResponseModel } from "../question/questionResponse.model";
import { UserResponseModel } from "../user/UserResponseModel";


export interface Exam {
  examId: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  instructor: UserResponseModel;
  questions: QuestionResponseModel[];
}
