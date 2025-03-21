import { Stack, Typography } from "@mui/material";
import React from "react";
import { Helmet } from "react-helmet-async";
import PatientForm from "../Views/PatientForm";

export default function CreatePatientsPage() {
  return (
    <div style={{ width: "100%" }}>
      <Helmet>
        <title> Add Patients | Bhumio </title>
      </Helmet>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "white", fontWeight: "600" }}
        >
          Add Patients Form
        </Typography>
      </Stack>
      <PatientForm />
    </div>
  );
}
