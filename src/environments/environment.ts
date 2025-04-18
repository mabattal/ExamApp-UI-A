// src/environments/environment.ts
const baseApiUrl = 'https://localhost:7091/api';

export const environment = {
    production: false,
    baseApiUrl,
    auth: {
        loginUrl: `${baseApiUrl}/Auth/Login`,
        logoutUrl: `${baseApiUrl}/Auth/Logout`
    },
    user: {
        getUsersUrl: `${baseApiUrl}/Users/{pageNumber}/{pageSize}`,
        getUserUrl: `${baseApiUrl}/Users/{value}`,
        createUserUrl: `${baseApiUrl}/Users`,
        updateUserUrl: `${baseApiUrl}/Users/{id}`,
        deleteUserUrl: `${baseApiUrl}/Users/{id}`
    },
    exam: {
        getExamsByInstructorIdUrl: `${baseApiUrl}/Exams/instructor/{id}`,
        getByIdUrl: `${baseApiUrl}/Exams/{id}`,
        getActiveExams: `${baseApiUrl}/Exams/active`,
        getPastExams: `${baseApiUrl}/Exams/past`,
        getUpcomingExams: `${baseApiUrl}/Exams/upcoming`,
        createExamUrl: `${baseApiUrl}/Exams`,
        updateExamUrl: `${baseApiUrl}/Exams/{id}`,
        deleteExamUrl: `${baseApiUrl}/Exams/{id}`
    },
    question: {
        getByExamUrl: `${baseApiUrl}/Questions/examId/{id}`,
        getQuestionUrl: `${baseApiUrl}/Questions/{id}`,
        createQuestionUrl: `${baseApiUrl}/Questions`,
        updateQuestionUrl: `${baseApiUrl}/Questions/{id}`,
        deleteQuestionUrl: `${baseApiUrl}/Questions/{id}`,
    },
    examResult: {
        GetByUserIdAndExamIdUrl: `${baseApiUrl}/ExamResults/{userId}/{examId}`,
        startExamUrl: `${baseApiUrl}/ExamResults/start/{examId}`,
        submitExamUrl: `${baseApiUrl}/ExamResults/submit/{examId}`,
    },
    answer: {
        createAnswerUrl: `${baseApiUrl}/Answers`,
        updateAnswerUrl: `${baseApiUrl}/Answers/{answerId}`,
    }

};
