import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Container, Grid, TextField } from "@mui/material";
import { useState } from "react";
import IDGenerater from "../utils/IdGenerater";
import useApi from "../hooks/useApi";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../hooks/useNotification";
import { useSelector } from "react-redux";
import { adminState } from "../Redux/adminSlice";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useQueryApi } from "../hooks/useQueryApi";
import CircularProgress from "@mui/material/CircularProgress";

const steps = [
  {
    label: "Patients Details",
    description: "Enter Patient's Details here:",
    fields: [
      "Patient Name (First, Last Name)",
      "Email",
      "Location",
      "Age",
      "Gender",
      "Phone",
      "Address",
      "Patient ID",
    ],
  },
  {
    label: "Prescription Related Details",
    description: "Enter Patient's Prescription Details here:",
    fields: ["Prescription", "Dose", "Visit Date", "Next Visit"],
  },
  {
    label: "Physician Details",
    description: "Select Physician",
    fields: ["Physician Name", "Physician ID", "Physician Number", "Bill"],
  },
];

export default function PatientForm() {
  const navigate = useNavigate();
  const { showMessage } = useNotification();
  const [activeStep, setActiveStep] = useState(0);
  const { fileId } = useSelector(adminState);
  const [formData, setFormData] = useState({});
  const { apiFn, loading } = useApi();
  const { data: field, isFetching } = useQueryApi({
    url: `/googledrive/get-spreadsheet?spreadsheetId=${fileId}`,
    queryKey: "configField",
    enabled: true,
  });
  const patientData = field?.response?.results;
  const { data: physicianfield } = useQueryApi({
    url: `/googledrive/get-physician?spreadsheetId=${fileId}`,
    queryKey: "physician",
    enabled: true,
  });
  const physicianData = physicianfield?.response?.results;
  const getAutoDetails = async () => {
    const lastPatient = patientData?.length
      ? patientData[patientData.length - 1][0]
      : null;

    const PatientID = await IDGenerater(getNextNumber(lastPatient), "a12kj");

    setFormData((prevFormData) => ({
      ...prevFormData,
      "Patient ID": PatientID || "",
    }));
  };

  function getNextNumber(lastId) {
    if (!lastId) return 1;
    const match = lastId.match(/\d+$/);
    const lastNumber = match ? parseInt(match[0], 10) : 0;
    return lastNumber + 1;
  }
  React.useEffect(() => {
    getAutoDetails();
  }, [patientData]);

  const [errors, setErrors] = useState({});

  const handleNext = () => {
    if (validateFields()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (event, fieldName) => {
    const { value } = event.target;
    if (
      fieldName === "Age" ||
      fieldName === "Phone" ||
      fieldName === "Physician Number"
    ) {
      if (fieldName === "Age" && Number.isNaN(Number(value))) {
        setErrors({
          ...errors,
          [fieldName]: `${fieldName} should contain only numbers.`,
        });
        return;
      }

      if (
        (fieldName === "Phone" || fieldName === "Physician Number") &&
        Number.isNaN(Number(value))
      ) {
        setErrors({
          ...errors,
          [fieldName]: `${fieldName} should contain only numbers.`,
        });

        return;
      }
    }
    setFormData({
      ...formData,
      [fieldName]: value,
    });
    setErrors({
      ...errors,
      [fieldName]: ``,
    });
  };

  const validateFields = () => {
    const newErrors = {};
    let isValid = true;

    steps[activeStep].fields.forEach((fieldName) => {
      if (!formData[fieldName]) {
        newErrors[fieldName] = `${fieldName} is required.`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };
  const apiFieldMapping = {
    "Patients Details": {
      "Patient Name (First, Last Name)": ["first_name", "last_name"],
      Email: "email",
      Location: "location",
      Age: "age",
      Gender: "gender",
      Phone: "phone",
      Address: "address",
      "Patient ID": "patientId",
    },
    "Prescription Related Details": {
      Prescription: "description",
      Dose: "dose",
      "Visit Date": "start_dt_time",
      "Next Visit": "next_dt_time",
    },
    "Physician Details": {
      "Physician ID": "physicianId",
      "Physician Name": ["physician_name"],
      "Physician Number": "pcp",
      Bill: "bill",
    },
  };
  const handleFinish = async () => {
    let formattedData = {};

    steps.forEach((step) => {
      step.fields.forEach((fieldName) => {
        const mappedField = apiFieldMapping[step.label][fieldName];

        if (mappedField) {
          if (Array.isArray(mappedField)) {
            // For fields like "First Name, Last Name"
            const [firstName, lastName] = (formData[fieldName] || "").split(
              " "
            );
            formattedData[mappedField[0]] = firstName || "";
            formattedData[mappedField[1]] = lastName || "";
          } else {
            formattedData[mappedField] = formData[fieldName] || "";
          }
        }
      });
    });

    const { response, error } = await apiFn({
      url: `/googledrive/add-patient?spreadsheetId=${fileId}`,
      options: {
        method: "POST",
        body: formattedData,
      },
    });
    if (response) {
      showMessage({
        type: "success",
        value: "Patient Created",
      });
      navigate("/");
      return;
    }
  };
  const handlePhysicianChange = (selectedName) => {
    const selectedPhysician = physicianData.find(
      (physician) => `${physician[1]}` === selectedName
    );

    if (selectedPhysician) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        "Physician Name": selectedName,
        "Physician ID": selectedPhysician[0] || "",
        "Physician Number": selectedPhysician[3] || "",
      }));
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#273142",
        border: "1px solid #313D4F",
        borderRadius: "10px",
        marginRight: "20px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {isFetching ? (
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
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          sx={{ ml: 5, color: "white" }}
        >
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <Typography sx={{ color: "white" }}>{step.label}</Typography>
              </StepLabel>
              <StepContent>
                <Typography sx={{ color: "white" }}>
                  {step.description}
                </Typography>
                <form>
                  <Grid container spacing={2}>
                    {step.fields.map((fieldName) => (
                      <Grid item xs={4} key={fieldName}>
                        {" "}
                        {fieldName.toLowerCase() === "gender" ? (
                          <FormControl
                            variant="outlined"
                            sx={{
                              mt: 2,
                              width: 195,
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "white",
                              },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#ccc",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "white",
                                },
                            }}
                          >
                            <InputLabel
                              id={`${fieldName}-label`}
                              sx={{
                                color: "white",
                                "&.Mui-focused": {
                                  color: "white",
                                },
                              }}
                            >
                              {fieldName}
                            </InputLabel>
                            <Select
                              labelId={`${fieldName}-label`}
                              id={fieldName}
                              value={formData[fieldName] || ""}
                              onChange={(event) =>
                                handleInputChange(event, fieldName)
                              }
                              label={fieldName}
                              sx={{
                                "& .MuiInputBase-input": {
                                  color: "white",
                                },
                                "& .MuiSvgIcon-root": {
                                  color: "white",
                                },
                              }}
                            >
                              <MenuItem value="Male">Male</MenuItem>
                              <MenuItem value="Female">Female</MenuItem>
                            </Select>
                          </FormControl>
                        ) : fieldName.toLowerCase() === "physician name" ? (
                          // Physician Name Select
                          <FormControl
                            variant="outlined"
                            sx={{
                              mt: 2,
                              width: 195,
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "white",
                              },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#ccc",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "white",
                                },
                            }}
                          >
                            <InputLabel
                              id="physician-name-label"
                              sx={{
                                color: "white",
                                "&.Mui-focused": {
                                  color: "white",
                                },
                              }}
                            >
                              Physician Name
                            </InputLabel>
                            <Select
                              labelId="physician-name-label"
                              id="Physician Name"
                              value={formData["Physician Name"] || ""}
                              onChange={(event) =>
                                handlePhysicianChange(event.target.value)
                              }
                              label="Physician Name"
                              sx={{
                                "& .MuiInputBase-input": {
                                  color: "white",
                                },
                                "& .MuiSvgIcon-root": {
                                  color: "white",
                                },
                              }}
                            >
                              {physicianData?.slice(1)?.map((physician) => (
                                <MenuItem
                                  key={physician[0]}
                                  value={physician[1]}
                                >
                                  {`${physician[1]}`}{" "}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ) : (
                          <TextField
                            id={fieldName}
                            label={fieldName}
                            variant="outlined"
                            type={
                              fieldName.toLowerCase().includes("next visit") ||
                              fieldName.toLowerCase().includes("visit date")
                                ? "date"
                                : "text"
                            }
                            value={formData[fieldName] || ""}
                            onChange={(event) =>
                              handleInputChange(event, fieldName)
                            }
                            sx={{
                              mt: 2,
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "white",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#ccc",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "white",
                                },
                              },
                              "& .MuiInputLabel-root": {
                                color: "white",
                              },
                              "& .MuiInputLabel-root.Mui-focused": {
                                color: "white",
                              },
                              "& input": {
                                color: "white",
                              },
                              "& .MuiSvgIcon-root": {
                                color: "white",
                              },
                              "& input[type='date']::-webkit-calendar-picker-indicator":
                                {
                                  filter: "invert(1)",
                                },
                            }}
                            InputLabelProps={{
                              shrink:
                                fieldName
                                  .toLowerCase()
                                  .includes("next visit") ||
                                fieldName.toLowerCase().includes("visit date")
                                  ? true
                                  : undefined,
                            }}
                            InputProps={{
                              readOnly:
                                fieldName === "Patient ID" ||
                                fieldName === "Physician ID"
                                  ? true
                                  : false,
                            }}
                          />
                        )}
                        <Typography style={{ color: "red" }}>
                          {errors[fieldName]}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </form>
                <Box sx={{ mb: 2, mt: 1 }}>
                  <Container>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === steps.length - 1 ? "Finish" : "Continue"}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1, color: "white" }}
                    >
                      <Typography sx={{ color: "white" }}>Back</Typography>
                    </Button>
                  </Container>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      )}
      {activeStep === steps.length && (
        <Paper
          square
          elevation={0}
          sx={{ p: 3, backgroundColor: "transparent" }}
        >
          <Typography
            sx={{ color: "white" }}
          >{`Want to save these details?`}</Typography>
          <Button onClick={handleBack} sx={{ mt: 1, mr: 1, color: "white" }}>
            Back
          </Button>
          <Button
            onClick={handleFinish}
            sx={{
              mt: 1,
              mr: 1,
              position: "relative",
              backgroundColor: loading ? "#1976d2" : undefined,
              "&.Mui-disabled": {
                backgroundColor: "#1976d2",
              },
              height: 40,
              minWidth: 100,
            }}
            variant="contained"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress
                size={24}
                sx={{
                  color: "white",
                  position: "absolute",
                }}
              />
            ) : (
              <span style={{ visibility: loading ? "hidden" : "visible" }}>
                Save
              </span>
            )}
          </Button>
        </Paper>
      )}
    </Box>
  );
}
