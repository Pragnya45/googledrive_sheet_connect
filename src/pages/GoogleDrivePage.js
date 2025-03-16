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
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fileId, setFileId] = useState(null);
  const [isSignedin, setIsSignedin] = useState(false);
  const { token } = useSelector(adminState);
  const { showMessage } = useNotification();
  const dispatch = useDispatch();
  // useEffect(() => {
  //   if (window.gapi) {
  //     window.gapi.load("client:auth2", initClient);
  //   } else {
  //     console.error("Google API not loaded");
  //   }
  // }, []);
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
    console.log("Initializing Google Identity Services OAuth...");

    if (!window.google) {
      console.error("Google Identity Services API not loaded!");
      return;
    }

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: env?.googleClientId,
      scope:
        "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets",
      callback: (response) => {
        if (response.error) {
          console.error("Error during authentication:", response);
          return;
        }

        console.log("Access Token:", response.access_token);
        dispatch(adminFn({ token: response.access_token }));

        setIsSignedin(true);
      },
    });

    client.requestAccessToken(); // Triggers OAuth popup
  }

  function signOut() {
    console.log("Signing out...");
    dispatch(adminLogoutFn()); // Clear token from Redux
    setIsSignedin(false);
  }

  function openFilePicker() {
    console.log("Opening Google Drive Picker...");

    if (!window.google) {
      console.error("Google Picker API not loaded!");
      return;
    }

    const oauthToken = token; // Use the stored token from Redux

    window.gapi.load("picker", () => {
      console.log("Google Picker API loaded");

      const oauthToken = token; // Use the stored token from Redux

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
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Connect to Google Drive and Select Worksheet
          </Typography>
        </Stack>
        {loading ? ( // Show loader while checking auth state
          <CircularProgress color="primary" />
        ) : !token ? (
          <Button variant="contained" onClick={signInWithGoogle}>
            Sign in to Google Drive
          </Button>
        ) : (
          <Button variant="outlined" onClick={signOut}>
            Sign Out
          </Button>
        )}

        {/* Select File Button */}
        {token && (
          <Button
            variant="contained"
            color="secondary"
            onClick={openFilePicker}
            sx={{ m: 1 }}
          >
            Select File from Google Drive
          </Button>
        )}

        {/* Show Selected File */}
        {fileId && (
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Selected File ID: {fileId}
          </Typography>
        )}
      </Container>
    </>
  );
}
