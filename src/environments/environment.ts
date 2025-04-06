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
    
};
  