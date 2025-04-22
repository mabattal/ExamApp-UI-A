export interface AnswerResponseModel{
    answerId: number;
    userId: number;
    questionId: number;
    selectedAnswer: string;
    isCorrect: boolean;
    createdDate: Date;
}