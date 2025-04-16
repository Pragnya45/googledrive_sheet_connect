# 🩺 Patient Management System using Google Sheets

This project is a **React.js** website built with **MUI (Material-UI)** components that seamlessly connects to **Google Drive** to manage patient data stored in Google Sheets. With this platform, you can effortlessly perform CRUD operations on the sheet directly from the website.

🌐 **Live Demo:** [Deployed on Netlify](#)  
⚙️ **Backend:** Nest.js API integrated with Google Drive API  

---

## ✨ Features

✅ **Google Authentication with OAuth 2.0**  
✅ **Google Sheets CRUD Operations**  
✅ **Google Drive Picker API for Spreadsheet Selection**  
✅ **Private Route for Patient Access**  
✅ **Search & Filter Patients** – Search by name, patient ID, and email  
✅ **Add, Edit, and Delete Patient Records**  
✅ **Paginated Table for Easy Navigation**  
✅ **Physician & Prescription Details**  

---

## 🔒 Authentication Workflow

1. **Google Login with OAuth 2.0:**  
   - Configured Google Identity Services.  
   - Set up OAuth credentials on **Google Cloud Console**.  
   - Google account login generates a `client_id` to authenticate users.  
2. **Spreadsheet Selection:**  
   - Utilized Google Picker API to select a spreadsheet from the user's Google Drive.  
   - Private routes restrict patient data access until a valid sheet is uploaded.  

---

## 📊 CRUD Operations on Google Sheets

- **Create:** Add a new patient with physician and prescription details.  
- **Read:** View and search patient details with multiple filters.  
- **Update:** Modify existing patient information.  
- **Delete:** Remove patient records, and changes reflect directly in Google Sheets.  

---

## 🛠️ Tech Stack

### Frontend:
- ⚛️ **React.js** – UI built using MUI components  
- 🎨 **Material-UI (MUI)** – For a clean and responsive design  

### Backend:
- 🟢 **Nest.js** – REST API handling Google Drive operations  
- 📡 **Google Drive API** – Directly interfaced for CRUD functionality  

---

## 🚀 Deployment

- Deployed on **Netlify** for the frontend.  
- Nest.js backend running on a secure cloud server.  

---

## 📝 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```
### 2. Set Up Google Cloud Console
- Create a project in [Google Cloud Console](https://console.cloud.google.com/).
- Enable the following APIs:
  - ✅ **Google Drive API**
  - ✅ **Google Sheets API**
- Generate OAuth 2.0 credentials by following these steps:
  1. Go to the **Credentials** section in your Google Cloud project.
  2. Click on **Create Credentials** and select **OAuth Client ID**.
  3. Configure the consent screen and set the application type to **Web Application**.
  4. Add your **Authorized Redirect URI** (e.g., `https://your-app-url.com/auth`).
  5. Download the `credentials.json` file and place it in your backend directory.

- Add your `client_id` to the frontend configuration.
### 3. Configure Backend (Nest.js)

- Add the necessary environment variables such as:
  - `CLIENT_ID`
  - `CLIENT_SECRET`
  - `REDIRECT_URI`
  - `SERVICE_ACCOUNT_EMAIL`
  - `PRIVATE_KEY`
  - and any other required Google API credentials.

> Make sure these variables are stored securely in a `.env` file.

#### Run the backend:

```bash
npm install
npm run start
```
### 4. Run Frontend (React.js)
```bash
cd frontend
npm install
npm run start
```
### 🌐 5. Environment Variables Setup

Create a `.env` file in the `frontend` directory and add the following variables:

```bash
REACT_APP_BACKEND_URL=your-backend-url
REACT_APP_GOOGLE_CLIENTID=your-google-client-id
REACT_APP_SAMPLE_FILE_ID=your-samplesheet-id
- **`REACT_APP_BACKEND_URL`** – URL of your Nest.js backend.  
- **`REACT_APP_GOOGLE_CLIENTID`** – OAuth 2.0 Client ID generated from Google Cloud Console.
```

## 📄 Sample Google Sheet

To test the application, you can use this sample Google Sheet to upload patient data:  

👉 [Click here to access the sample sheet](https://docs.google.com/spreadsheets/d/1JAHoAvX2395OWndkfE58hKkUzvEgyblB/edit?gid=696475617#gid=696475617)

- Make a copy of the sheet and upload it using the website.  
- The sheet contains sample patient data to help you get started.
