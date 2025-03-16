import { Helmet } from "react-helmet-async";
import Button from "@mui/material/Button";

// @mui
import { Stack, Container, Typography } from "@mui/material";

export default function GoogleDrivePage() {
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
        <Button variant="contained">Select File from Google Drive</Button>
      </Container>
    </>
  );
}
