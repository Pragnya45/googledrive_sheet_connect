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
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { Link } from "react-router-dom";
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
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";

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
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          "&:not(:last-child)": {
            borderBottom: "1px solid #4D5C6B", // Light border for all rows except last row
          },
        }}
      >
        <TableCell sx={{ display: "flex", alignItems: "center", gap: 0 }}>
          <Checkbox
            {...label}
            checked={selectedItems.includes(row[0])}
            onChange={handleCheckboxChange}
            sx={{ color: "white" }}
          />
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <KeyboardArrowUpIcon sx={{ color: "white" }} />
            ) : (
              <KeyboardArrowDownIcon sx={{ color: "white" }} />
            )}
          </IconButton>
          <Link to={`/edit-patient/${row[0]}`} state={row}>
            <IconButton aria-label="expand row" size="small" title="Edit">
              <EditIcon fontSize="small" sx={{ color: "white" }} />
            </IconButton>
          </Link>
        </TableCell>
        <TableCell sx={{ color: "white" }}>{row[0] || "N/A"}</TableCell>
        <TableCell component="th" scope="row" sx={{ color: "white" }}>
          {row[1] + " " + row[2]}
        </TableCell>
        <TableCell sx={{ color: "white" }}>{row[4] || "N/A"}</TableCell>
        <TableCell sx={{ color: "white" }}>{row[8] || "N/A"}</TableCell>
        <TableCell sx={{ color: "white" }}>{row[6] || "N/A"}</TableCell>
        <TableCell sx={{ color: "white" }}>{row.Gender || "N/A"}</TableCell>
        <TableCell sx={{ color: "white" }}>{row[3] || "N/A"}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, m: 5 }}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                sx={{ color: "white" }}
              >
                Prescription and Physician Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "white" }}>Prescription</TableCell>
                    <TableCell sx={{ color: "white" }}>Dose</TableCell>
                    <TableCell sx={{ color: "white" }}>
                      Physician name
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>
                      Physician number
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>Bill</TableCell>
                    <TableCell sx={{ color: "white" }}>Physician Id</TableCell>
                    <TableCell sx={{ color: "white" }}>Visit date</TableCell>
                    <TableCell sx={{ color: "white" }}>Next visit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableCell sx={{ color: "white" }}>
                    {row.Prescription}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}> {row.Dose}</TableCell>
                  <TableCell
                    sx={{ color: "white" }}
                  >{`${row.PhysicianFirstName} ${row.PhysicianLastName}`}</TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {row.PhysicianNumber}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>{row.Bill}</TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {row.PhysicianID}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>{row.VisitDate}</TableCell>
                  <TableCell sx={{ color: "white" }}>{row.NextVisit}</TableCell>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
export default function DataTable({
  searchQuery,
  patientData,
  isFetching,
  refetch,
}) {
  console.log(rows);
  const { fileId, token } = useSelector(adminState);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const { showMessage } = useNotification();
  const { apiFn, loading } = useApi();
  const handleDelete = async () => {
    const { error } = await apiFn({
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
  const navigate = useNavigate();

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
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: "#273142",
        border: "1px solid #313D4F",
        borderRadius: "10px",
        padding: "20px",
        width: "100%",
      }}
    >
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography
          sx={{ color: "white", fontSize: "18px", fontWeight: "700" }}
        >
          Patient List
        </Typography>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Checkbox
            {...label}
            sx={{
              color: "white",
            }}
            checked={isAllSelected}
            onChange={handleSelectAllChange}
          />
          <Typography
            sx={{
              color: "white",
              fontWeight: "400",
            }}
          >
            Select All
          </Typography>

          <Button
            variant="contained"
            sx={{ backgroundColor: "#4880FF", borderRadius: "6px" }}
            onClick={() => navigate("/create-patient")}
          >
            Add Patient
          </Button>
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
      </Stack>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow
            sx={{
              "& > *": { borderBottom: "unset" },
            }}
          >
            <TableCell
              sx={{
                backgroundColor: "#323D4E",
                borderTopLeftRadius: "15px",
                borderBottomLeftRadius: "15px",
                color: "white",
                fontSize: "14px",
                fontWeight: "800",
              }}
            >
              Actions
            </TableCell>
            <TableCell
              sx={{
                backgroundColor: "#323D4E",
                color: "white",
                fontSize: "14px",
                fontWeight: "800",
              }}
            >
              Patient Id
            </TableCell>

            <TableCell
              sx={{
                backgroundColor: "#323D4E",
                color: "white",
                fontSize: "14px",
                fontWeight: "800",
              }}
            >
              Patient name
            </TableCell>
            <TableCell
              sx={{
                backgroundColor: "#323D4E",
                color: "white",
                fontSize: "14px",
                fontWeight: "800",
              }}
            >
              Location
            </TableCell>
            <TableCell
              sx={{
                backgroundColor: "#323D4E",
                color: "white",
                fontSize: "14px",
                fontWeight: "800",
              }}
            >
              Age
            </TableCell>
            <TableCell
              sx={{
                backgroundColor: "#323D4E",
                color: "white",
                fontSize: "14px",
                fontWeight: "800",
              }}
            >
              Phone
            </TableCell>
            <TableCell
              sx={{
                backgroundColor: "#323D4E",
                color: "white",
                fontSize: "14px",
                fontWeight: "800",
              }}
            >
              Gender
            </TableCell>
            <TableCell
              sx={{
                backgroundColor: "#323D4E",
                borderTopRightRadius: "15px",
                borderBottomRightRadius: "15px",
                color: "white",
                fontSize: "14px",
                fontWeight: "800",
              }}
            >
              Address
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isFetching ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ height: "60vh" }}>
                <CircularProgress
                  color="white"
                  sx={{ color: "white", fontSize: "18px" }}
                />
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
              <TableCell
                colSpan={8}
                align="center"
                sx={{ color: "white", fontSize: "18px", height: "60vh" }}
              >
                {token
                  ? ` No data Available{" "}`
                  : "Go to Select FIle page for login"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

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
