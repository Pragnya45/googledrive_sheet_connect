import { Helmet } from "react-helmet-async";
import Button from "@mui/material/Button";
import { env } from "../utils/env";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { adminFn } from "../Redux/adminSlice";
import { adminState } from "../Redux/adminSlice";
import { adminLogoutFn } from "../Redux/logoutSlice";
import { Stack, Container, Typography } from "@mui/material";
import { useNotification } from "../hooks/useNotification";
import CircularProgress from "@mui/material/CircularProgress";

export default function GoogleDrivePage() {
  const [loading, setLoading] = useState(true);
  const [fileId, setFileId] = useState(null);
  const { token, fileId: file } = useSelector(adminState);
  const dispatch = useDispatch();
  const { showMessage } = useNotification();
  useEffect(() => {
    const loadGoogleAPI = () => {
      console.log("Loading Google Identity Services...");

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("Google Identity Services script loaded");
        setLoading(false);
      };
      script.onerror = () => {
        console.error("Failed to load Google Identity Services script");
      };
      document.body.appendChild(script);
    };

    loadGoogleAPI();
  }, []);
  const apiFieldMapping = {
    "Patients Details": {
      first_name: "first_name",
      last_name: "last_name",
      email: "email",
      location: "location",
      age: "age",
      gender: "gender",
      phone: "phone",
      address: "address",
      patientId: "patientId",
      description: "description",
      dose: "dose",
      start_dt_time: "start_dt_time",
      next_dt_time: "next_dt_time",
      physician_name: "physician_name",
      pcp: "pcp",
      bill: "bill",
      physicianId: "physicianId",
    },
    "Physician Details": {
      physicianId: "physicianId",
      physician_name: "physician_name",
      pcp: "pcp",
      bill: "bill",
    },
  };
  function signInWithGoogle() {
    if (!window.google) {
      return;
    }

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: env?.googleClientId,
      scope:
        "https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file",
      callback: (response) => {
        if (response.error) {
          return;
        }

        dispatch(adminFn({ token: response.access_token }));
      },
    });

    client.requestAccessToken({ prompt: "" });
  }

  function openFilePicker() {
    if (!window.google) {
      return;
    }

    window.gapi.load("picker", () => {
      const oauthToken = token;

      const picker = new window.google.picker.PickerBuilder()
        .addView(window.google.picker.ViewId.SPREADSHEETS)
        .setOAuthToken(oauthToken)
        .setSize(600, 400)
        .setCallback(async (data) => {
          if (data.action === window.google.picker.Action.PICKED) {
            // setFileId(data.docs[0].id);
            await validateGoogleSheetWithGIS(data.docs[0].id, oauthToken);
          }
        })
        .build();

      picker.setVisible(true);
    });
  }
  console.log(env);

  function downloadSampleSheet() {
    const sampleSheetId = env?.sampleFIleId;
    const downloadUrl = `https://docs.google.com/spreadsheets/d/${sampleSheetId}/export?format=xlsx`;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.target = "_blank";
    link.download = "Sample_Google_Sheet.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  async function validateGoogleSheetWithGIS(fileId, accessToken) {
    try {
      console.log("✅ Validating Google Sheet using REST API...");
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${fileId}?includeGridData=true`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching sheet: ${response.statusText}`);
      }

      const sheetData = await response.json();
      console.log("📄 Sheet Data:", sheetData);

      // Perform header validation using your logic
      const sheets = sheetData.sheets;
      const patientSheet = sheets.find(
        (sheet) => sheet.properties.title.toLowerCase() === "patient"
      );

      if (!patientSheet) {
        throw new Error("❌ 'patient' sheet not found. Refer sample sheet");
      }

      const headers = patientSheet.data[0]?.rowData[0]?.values
        .map((cell) => cell.formattedValue?.trim())
        .filter((val) => val);

      console.log("📝 Headers found:", headers);

      // Validate headers with apiFieldMapping
      const expectedHeaders = Object.keys(apiFieldMapping["Patients Details"]);
      const missingHeaders = expectedHeaders.filter(
        (header) => !headers.includes(header)
      );

      if (missingHeaders.length > 0) {
        throw new Error(
          `❌ Missing headers: ${missingHeaders.join(", ")}.Refer sample sheet`
        );
      }

      console.log("✅ Sheet validated successfully!");
      showMessage({
        type: "success",
        value: "File validated successfully using REST API!",
      });

      dispatch(adminFn({ fileId: fileId }));
    } catch (error) {
      console.error("❌ Error occurred during validation:", error);
      showMessage({
        type: "error",
        value: `Error validating file: ${error.message}`,
      });
    }
  }

  return (
    <>
      <Helmet>
        <title> Connect to Google Drive | Bhumio </title>
      </Helmet>
      {loading ? ( // Show loader while checking auth state
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress color="primary" />
        </div>
      ) : (
        <Container>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={5}
            mt={7}
          >
            <Typography
              variant="h4"
              gutterBottom
              color="white"
              sx={{ fontWeight: "600" }}
            >
              Connect to Google Drive and Select Worksheet
            </Typography>
          </Stack>

          {!token && (
            <Button variant="contained" onClick={signInWithGoogle}>
              Sign in to Google Drive
            </Button>
          )}

          {token && (
            <Stack direction="row" alignItems="center" gap={5}>
              <Button
                variant="contained"
                color="secondary"
                onClick={openFilePicker}
                sx={{ m: 1, margin: 0 }}
              >
                Select File from Google Drive
              </Button>

              <Button
                variant="contained"
                color="success"
                onClick={downloadSampleSheet}
                sx={{ m: 1, marginLeft: 0 }}
              >
                Download Sample Google Sheet
              </Button>
            </Stack>
          )}
          {/* Show Selected File */}
          {(file ? file : fileId) && (
            <Typography
              variant="subtitle1"
              sx={{ mt: 2, color: "white", fontWeight: "600" }}
            >
              Selected File ID: {file ? file : fileId}
            </Typography>
          )}
        </Container>
      )}
    </>
  );
}
