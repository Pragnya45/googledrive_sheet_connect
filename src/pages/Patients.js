import React, { useState } from "react";
import { Stack, Typography, TextField } from "@mui/material";
import { Helmet } from "react-helmet-async";
import DataTable from "../Views/DataTable";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

function Patients() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
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
          Patients
        </Typography>
      </Stack>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextField
          label="Search Patients"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ marginBottom: "16px" }}
        />
        <Button variant="contained" onClick={() => navigate("/create-patient")}>
          Add Patient
        </Button>
      </div>
      <DataTable searchQuery={searchQuery} />
    </>
  );
}

export default Patients;
