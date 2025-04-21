import { UserResponseModel } from "../user/UserResponseModel";

export interface ExamResultResponse {
    resultId: number;
    userId: number;
    user: UserResponseModel;
    examId: number;
    score: number;
    startDate: Date;
    completionDate: Date;
    duration: number;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    emptyAnswers: number;
  }