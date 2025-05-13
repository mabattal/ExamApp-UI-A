// src/environments/environment.ts
const baseApiUrl = 'https://localhost:7203';

export const environment = {
    production: false,
    baseApiUrl,
    auth: {
        loginUrl: `${baseApiUrl}/api/Auth/Login`,
        logoutUrl: `${baseApiUrl}/api/Auth/Logout`
    },
    user: {
        getUsersUrl: `${baseApiUrl}/api/Users/{pageNumber}/{pageSize}`,
        getUserUrl: `${baseApiUrl}/api/Users/{value}`,
        createUserUrl: `${baseApiUrl}/api/Users`,
        updateUserUrl: `${baseApiUrl}/api/Users/{id}`,
        deleteUserUrl: `${baseApiUrl}/api/Users/{id}`
    },
    exam: {
        getExamsByInstructorIdUrl: `${baseApiUrl}/api/Exams/instructor/{id}`,
        getByIdUrl: `${baseApiUrl}/api/Exams/{id}`,
        getActiveExams: `${baseApiUrl}/api/Exams/active`,
        getPastExams: `${baseApiUrl}/api/Exams/past`,
        getUpcomingExams: `${baseApiUrl}/api/Exams/upcoming`,
        createExamUrl: `${baseApiUrl}/api/Exams`,
        updateExamUrl: `${baseApiUrl}/api/Exams/{id}`,
        deleteExamUrl: `${baseApiUrl}/api/Exams/{id}`
    },
    question: {
        getByExamUrl: `${baseApiUrl}/api/Questions/examId/{id}`,
        getQuestionUrl: `${baseApiUrl}/api/Questions/{id}`,
        getQuestionWithCorrectAnswerUrl: `${baseApiUrl}/api/Questions/withCorrectAnswer/examId/{examId}`,
        createQuestionUrl: `${baseApiUrl}/api/Questions`,
        updateQuestionUrl: `${baseApiUrl}/api/Questions/{id}`,
        deleteQuestionUrl: `${baseApiUrl}/api/Questions/{id}`,
    },
    examResult: {
        GetByIdUrl: `${baseApiUrl}/api/ExamResults/{id}`,
        GetByUserIdUrl: `${baseApiUrl}/api/ExamResults/user/{userId}`,
        GetByExamIdUrl: `${baseApiUrl}/api/ExamResults/exam/{examId}`,
        GetByUserIdAndExamIdUrl: `${baseApiUrl}/api/ExamResults/{userId}/{examId}`,
        startExamUrl: `${baseApiUrl}/api/ExamResults/start/{examId}`,
        submitExamUrl: `${baseApiUrl}/api/ExamResults/submit/{examId}`,
        statisticsExamUrl: `${baseApiUrl}/api/ExamResults/statistics/{examId}`,
    },
    answer: {
        createAnswerUrl: `${baseApiUrl}/api/Answers`,
        updateAnswerUrl: `${baseApiUrl}/api/Answers/{answerId}`,
        getAnswerByexamIdAndUserIdUrl: `${baseApiUrl}/api/Answers/exam/{userId}/{examId}`
    }

};
