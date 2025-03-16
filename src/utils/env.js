export const env = {
  backendUrl: process.env.REACT_APP_BACKEND_URL,
  googleClientId: process.env.REACT_APP_GOOGLE_CLIENTID,
  googleApikey: process.env.REACT_APP_GOOGLE_API_KEY,
  discoverydocs: process.env.REACT_APP_DISCOVERY_DOCS,
  scopes: [
    "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets",
  ],
};
