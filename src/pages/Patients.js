import React from "react";
import { Stack, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";

function Patients() {
  return (
    <>
      <Helmet>
        <title> Add Patients | Bhumio </title>
      </Helmet>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4" gutterBottom>
          Add Patients Form
        </Typography>
      </Stack>
    </>
  );
}

export default Patients;
