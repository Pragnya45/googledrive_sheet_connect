/* eslint-disable react/prop-types */
import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Button, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePaginationApi } from "../hooks/usePaginationApi";
import { adminState } from "../Redux/adminSlice";
import { useSelector } from "react-redux";
import TablePagination from "../Components/TablePagination";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import Checkbox from "@mui/material/Checkbox";
import useApi from "../hooks/useApi";
import { useNotification } from "../hooks/useNotification";
import DeletePopup from "../Components/DeletePopup";

function createData(
  firstName,
  lastName,
  Location,
  Age,
  Phone,
  Gender,
  Address,
  Prescription,
  Dose,
  PhysicianFirstName,
  PhysicianLastName,
  PhysicianNumber,
  Bill,
  NextVisit,
  PhysicianID,
  PatientID,
  VisitDate
) {
  return {
    firstName,
    lastName,
    Location,
    Age,
    Phone,
    Gender,
    Address,
    Prescription,
    Dose,
    PhysicianFirstName,
    PhysicianLastName,
    PhysicianNumber,
    Bill,
    NextVisit,
    PhysicianID,
    PatientID,
    VisitDate,
  };
}
const label = { inputProps: { "aria-label": "Checkbox demo" } };

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};

const rows = [
  createData(
    "first_name",
    "last_name",
    "Location",
    "Age",
    "Phone",
    "Gender",
    "Address",
    "Prescription",
    "Dose",
    "Physician_first_name",
    "Physician_last_name",
    "Physician Number",
    "Bill",
    "Next Visit",
    "Physician -ID",
    "Patient- ID",
    "Visit Date"
  ),
  createData(
    "first_name",
    "last_name",
    "Location",
    "Age",
    "Phone",
    "Gender",
    "Address",
    "Prescription",
    "Dose",
    "Physician_first_name",
    "Physician_last_name",
    "Physician Number",
    "Bill",
    "Next Visit",
    "Physician -ID",
    "Patient- ID",
    "Visit Date"
  ),
  createData(
    "first_name",
    "last_name",
    "Location",
    "Age",
    "Phone",
    "Gender",
    "Address",
    "Prescription",
    "Dose",
    "Physician_first_name",
    "Physician_last_name",
    "7894561230",
    "Bill",
    "Next Visit",
    "Physician -ID",
    "Patient- ID",
    "Visit Date"
  ),
];
function Row({ row, selectedItems, setSelectedItems }) {
  const [open, setOpen] = React.useState(false);
  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    const orderId = row[0];

    if (isChecked) {
      setSelectedItems((prevSelectedItems) => [...prevSelectedItems, orderId]);
    } else {
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((id) => id !== orderId)
      );
    }
  };
  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <Checkbox
            {...label}
            checked={selectedItems.includes(row[0])}
            onChange={handleCheckboxChange}
          />
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          <Link to={`/edit-patient/${row[0]}`} state={row}>
            <IconButton aria-label="expand row" size="small" title="Edit">
              <EditIcon fontSize="small" />
            </IconButton>
          </Link>
        </TableCell>
        <TableCell>{row[0] || "N/A"}</TableCell>
        <TableCell component="th" scope="row">
          {row[1] + " " + row[2]}
        </TableCell>
        <TableCell>{row[4] || "N/A"}</TableCell>
        <TableCell>{row[8] || "N/A"}</TableCell>
        <TableCell>{row[6] || "N/A"}</TableCell>
        <TableCell>{row.Gender || "N/A"}</TableCell>
        <TableCell>{row[3] || "N/A"}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, m: 5 }}>
              <Typography variant="h6" gutterBottom component="div">
                Prescription and Physician Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Prescription</TableCell>
                    <TableCell>Dose</TableCell>
                    <TableCell>Physician name</TableCell>
                    <TableCell>Physician number</TableCell>
                    <TableCell>Bill</TableCell>
                    <TableCell>Physician Id</TableCell>
                    <TableCell>Visit date</TableCell>
                    <TableCell>Next visit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableCell>{row.Prescription}</TableCell>
                  <TableCell>{row.Dose}</TableCell>
                  <TableCell>{`${row.PhysicianFirstName} ${row.PhysicianLastName}`}</TableCell>
                  <TableCell>{row.PhysicianNumber}</TableCell>
                  <TableCell>{row.Bill}</TableCell>
                  <TableCell>{row.PhysicianID}</TableCell>
                  <TableCell>{row.VisitDate}</TableCell>
                  <TableCell>{row.NextVisit}</TableCell>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
export default function DataTable({ searchQuery }) {
  console.log(rows);
  const { fileId } = useSelector(adminState);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const { showMessage } = useNotification();
  const { apiFn, loading } = useApi();
  const handleDelete = async () => {
    const { response, error } = await apiFn({
      url: `/googledrive/delete-patient?spreadsheetId=${fileId}`,
      options: {
        method: "DELETE",
        body: { ids: selectedItems },
      },
    });
    if (error) {
      showMessage({
        type: "error",
        value: error,
      });
      return;
    }
    showMessage({
      type: "success",
      value: "Patients Deleted",
    });
    refetch();
    setOpenDelete(false);
    return;
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
  console.log("patientData:", patientData);
  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      const allOrderIds = patientData.map((row) => row[0]);
      setSelectedItems(allOrderIds);
    } else {
      setSelectedItems([]);
    }
  };
  const isAllSelected = selectedItems.length === patientData?.length;
  return (
    <TableContainer component={Paper}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Checkbox
          {...label}
          checked={isAllSelected}
          onChange={handleSelectAllChange}
        />
        <p>Select All</p>
        <div
          onClick={() => {
            if (selectedItems.length > 0) {
              setOpenDelete(true);
            }
          }}
        >
          <DeleteIcon fontSize="small" color="error" />
        </div>
      </div>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell>Actions</TableCell>
            <TableCell>Patient Id</TableCell>

            <TableCell>Patient name</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isFetching ? (
            <TableRow>
              <TableCell colSpan={8}>
                <CircularProgress color="black" />
              </TableCell>
            </TableRow>
          ) : Array.isArray(patientData) && patientData.length > 0 ? (
            patientData?.map((row, index) => (
              <Row
                key={index}
                row={row}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8}>No data Available </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {Array.isArray(patientData) && patientData.length > 0 ? (
        <TablePagination
          fetchNextPage={fetchNextPage}
          fetchPreviousPage={fetchPreviousPage}
          fetchPage={fetchPage}
          pagination={pagination}
        />
      ) : null}
      {openDelete && (
        <DeletePopup
          message="Are you sure you want to delete selected patients?"
          loading={loading}
          handleClose={() => setOpenDelete(false)}
          handleConfirm={handleDelete}
        />
      )}
    </TableContainer>
  );
}
