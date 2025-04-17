import { UserResponseModel } from "../user/UserResponseModel";

export interface ExamWithInstructorResponseModel {
  examId: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  instructor: UserResponseModel;
  questionCount?: number;
  hasParticipated?: boolean;
}