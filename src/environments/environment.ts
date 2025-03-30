// src/environments/environment.ts
const baseApiUrl = 'https://localhost:7091/api';

export const environment = {
    production: false,
    baseApiUrl,
    auth: {
        loginUrl: `${baseApiUrl}/Auth/Login`,
        logoutUrl: `${baseApiUrl}/Auth/Logout`
    }
};
  