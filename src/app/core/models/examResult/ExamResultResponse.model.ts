export interface ExamResultResponse {
    resultId: number;
    userId: number;
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