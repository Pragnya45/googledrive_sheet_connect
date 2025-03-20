# 🩺 Patient Management System using Google Sheets

This project is a **React.js** website built with **MUI (Material-UI)** components that seamlessly connects to **Google Drive** to manage patient data stored in Google Sheets. With this platform, you can effortlessly perform CRUD operations on the sheet directly from the website.

🌐 **Deployed Link:** [Deployed on Netlify](https://googledrive-connect.netlify.app/)  
🌐 **Demo Video:** [Demo Video Link](https://screenrec.com/share/4mGNrB63Vv)  
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


## 🚀 Deployment

- Deployed on **Netlify** for the frontend.

---

## 📝 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Pragnya45/googledrive_sheet_connect.git
cd googledrive_sheet_connect

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

### 3. Run Frontend (React.js)

```bash
cd frontend
npm install
npm run start

```
