import React, { useState } from "react";
import { Stack, Typography, TextField } from "@mui/material";
import { Helmet } from "react-helmet-async";
import DataTable from "../Views/DataTable";
import Button from "@mui/material/Button";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import FilterListIcon from "@mui/icons-material/FilterList";
import { usePaginationApi } from "../hooks/usePaginationApi";
import { useSelector } from "react-redux";
import { adminState } from "../Redux/adminSlice";
import TablePagination from "../Components/TablePagination";
import Breadcrumb from "../Components/Breadcrumb";
import useResponsive from "../hooks/useResponsive";

function Patients() {
  const { fileId } = useSelector(adminState);
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
  const isDesktop = useResponsive("up", "lg");

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
    query: `&limit=8&spreadsheetId=${fileId}${
      filters?.name ? `&name=${filters?.name}` : ""
    }${filters?.id ? `&patientId=${filters?.id}` : ""}${
      filters?.email ? `&email=${filters?.email}` : ""
    }`,
    queryKey: "patients",
    body: {
      method: "GET",
    },
    enabled: true,
  });
  const patientData = data?.response?.results;
  return (
    <div style={{ width: "100%" }}>
      <Helmet>
        <title> Add Patients</title>
      </Helmet>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="start"
        gap={2}
        mb={2}
      >
        <Typography variant="h4" gutterBottom sx={{ color: "white" }}>
          Patients
        </Typography>
        <Breadcrumb page="Patients" />
      </Stack>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: isDesktop ? "row" : "column",
          gap: "30px",
          alignItems: "start",
          justifyContent: isDesktop ? "space-between" : "flex-start",
        }}
      >
        <div
          style={{
            width: isDesktop ? "calc(76% - 15px)" : "95%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <DataTable
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
            width: "calc(20% - 15px)",
            marginRight: "20px",
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
