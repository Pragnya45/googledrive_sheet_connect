import React, { useState } from "react";
import { Stack, Typography, TextField } from "@mui/material";
import { Helmet } from "react-helmet-async";
import DataTable from "../Views/DataTable";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import EventIcon from "@mui/icons-material/Event";
import FilterListIcon from "@mui/icons-material/FilterList";
import { usePaginationApi } from "../hooks/usePaginationApi";
import { useSelector } from "react-redux";
import { adminState } from "../Redux/adminSlice";
import TablePagination from "../Components/TablePagination";

function Patients() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { fileId } = useSelector(adminState);
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    id: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };
  const {
    data,
    refetch,
    fetchNextPage,
    fetchPreviousPage,
    fetchPage,
    isFetching,
    pagination,
  } = usePaginationApi({
    url: `/googledrive/get-spreadsheet`,
    query: `&limit=10&spreadsheetId=${fileId}${
      searchQuery ? `&name=${searchQuery}` : ""
    }`,
    queryKey: "patients" + searchQuery,
    body: {
      method: "GET",
    },
    enabled: true,
  });
  const patientData = data?.response?.results;
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
        <Typography variant="h4" gutterBottom sx={{ color: "white" }}>
          Patients
        </Typography>
      </Stack>
      {/* <div
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
      </div> */}
      <div
        style={{
          width: "100%",
          display: "flex",
          gap: "18px",
          alignItems: "start",
        }}
      >
        <div style={{ width: "75%", display: "flex", flexDirection: "col" }}>
          <DataTable
            searchQuery={searchQuery}
            patientData={patientData}
            isFetching={isFetching}
            refetch={refetch}
          />
          {Array.isArray(patientData) && patientData.length > 0 ? (
            <TablePagination
              fetchNextPage={fetchNextPage}
              fetchPreviousPage={fetchPreviousPage}
              fetchPage={fetchPage}
              pagination={pagination}
            />
          ) : null}
        </div>
        <div
          style={{
            width: "20%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <FilterListIcon style={{ color: "white", width: 20, height: 20 }} />
            <p
              style={{
                color: "white",
                fontSize: "14px",
                fontFamily: "sans-serif",
                margin: 0,
              }}
            >
              Filter By
            </p>
          </div>

          <div
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid white",
              borderRadius: "12px",
            }}
          >
            {/* Customer Name */}
            <p
              style={{ color: "white", fontSize: "14px", marginBottom: "4px" }}
            >
              <PersonIcon
                style={{ verticalAlign: "middle", marginRight: "5px" }}
              />
              Patient Name
            </p>
            <TextField
              name="name"
              value={filters?.name || ""}
              placeholder="Customer Name"
              size="small"
              onChange={handleChange}
              fullWidth
              InputProps={{
                style: {
                  height: "30px",
                  fontSize: "14px",
                  backgroundColor: "white",
                  color: "black",
                },
              }}
            />
            <p
              style={{ color: "white", fontSize: "14px", marginBottom: "4px" }}
            >
              <PersonIcon
                style={{ verticalAlign: "middle", marginRight: "5px" }}
              />
              Patient Id
            </p>
            <TextField
              name="id"
              value={filters?.id || ""}
              placeholder="Patient Id"
              size="small"
              onChange={handleChange}
              fullWidth
              InputProps={{
                style: {
                  height: "30px",
                  fontSize: "14px",
                  backgroundColor: "white",
                  color: "black",
                },
              }}
            />

            {/* Email */}
            <p
              style={{
                color: "white",
                fontSize: "14px",
                marginBottom: "4px",
                marginTop: "12px",
              }}
            >
              <EmailIcon
                style={{ verticalAlign: "middle", marginRight: "5px" }}
              />
              E-Mail
            </p>
            <TextField
              name="email"
              value={filters?.email || ""}
              placeholder="E-Mail"
              size="small"
              onChange={handleChange}
              fullWidth
              InputProps={{
                style: {
                  height: "30px",
                  fontSize: "14px",
                  backgroundColor: "white",
                  color: "black",
                },
              }}
            />

            {/* Apply Button */}
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                marginTop: "8px",
              }}
            >
              <Button
                variant="contained"
                size="small"
                onClick={() => refetch()}
                style={{
                  backgroundColor: "#4880FF",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "500",
                  borderRadius: "8px",
                  padding: "4px 12px",
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Patients;
