export const env = {
  backendUrl: process.env.REACT_APP_BACKEND_URL,
  googleClientId: process.env.REACT_APP_GOOGLE_CLIENTID,
  scopes: [
    "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets",
  ],
};
