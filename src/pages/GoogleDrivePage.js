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
        .setCallback((data) => {
          if (data.action === window.google.picker.Action.PICKED) {
            setFileId(data.docs[0].id);
            dispatch(adminFn({ fileId: data.docs[0].id }));
          }
        })
        .build();

      picker.setVisible(true);
    });
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
            <Button
              variant="contained"
              color="secondary"
              onClick={openFilePicker}
              sx={{ m: 1, margin: 0 }}
            >
              Select File from Google Drive
            </Button>
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
