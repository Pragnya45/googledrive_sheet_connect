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

const steps = [
  {
    label: "Patients Details",
    description: "Enter Patient's Details here:",
    fields: [
      "Patient Name (First, Last Name)",
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
    description: "Enter Physician Details here:",
    fields: [
      "Physician ID",
      "Physician Name (First, Last Name)",
      "Physician Number",
      "Bill",
    ],
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
  console.log();
  const patientData = field?.response;
  const getAutoDetails = async () => {
    // Get the last patient and physician IDs from patientData
    const lastPatient = patientData?.length
      ? patientData[patientData.length - 1]["Patient ID"]
      : null;
    const lastPhysician = patientData?.length
      ? patientData[patientData.length - 1]["Physician ID"]
      : null;

    // Generate next IDs based on the last available IDs
    const PatientID = await IDGenerater(getNextNumber(lastPatient), "a12kj");
    const DrId = await IDGenerater(getNextNumber(lastPhysician), "dr");

    // Set the new IDs to formData
    setFormData((prevFormData) => ({
      ...prevFormData,
      "Physician ID": DrId || "",
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
    // Validate the fields before proceeding to the next step
    if (validateFields()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (event, fieldName) => {
    const { value } = event.target;

    // Check if the field name is 'field1' and the value contains only numbers
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
    // Handle invalid input for 'field1' (e.g., show an error message)
    setFormData({
      ...formData,
      [fieldName]: value,
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
  console.log(formData);
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
      "Physician Name (First, Last Name)": [
        "physician_first_name",
        "physician_last_name",
      ],
      "Physician Number": "pcp",
      Bill: "bill",
    },
  };
  const handleFinish = async () => {
    let formattedData = {};

    // Iterate through each step
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

    console.log(formattedData);
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
  console.log(formData);
  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical" sx={{ ml: 5 }}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <form>
                {/* <Container sx={{ display: "flex", flexDirection: ["column", "column", 'row'], justifyContent: "center", alignItems: "center" }}> */}

                <Grid container spacing={2}>
                  {" "}
                  {/* Use Grid container */}
                  {/* {step.fields.map((fieldName) => (
                    <Grid item xs={4} key={fieldName}>
                      
                      <TextField
                        id={fieldName}
                        label={fieldName}
                        variant="outlined"
                        value={formData[fieldName] || ""}
                        onChange={(event) =>
                          handleInputChange(event, fieldName)
                        }
                        sx={{ mt: 2 }}
                        InputProps={{
                          readOnly:
                            fieldName === "Patient ID" ||
                            fieldName === "Physician ID"
                              ? true
                              : false,
                        }}
                      />
                      <Typography style={{ color: "red" }}>
                        {errors[fieldName]}
                      </Typography>
                    </Grid>
                  ))} */}
                  {step.fields.map((fieldName) => (
                    <Grid item xs={4} key={fieldName}>
                      {" "}
                      {fieldName.toLowerCase() === "gender" ? (
                        <FormControl
                          variant="outlined"
                          sx={{ mt: 2, minWidth: 120 }}
                        >
                          <InputLabel id={`${fieldName}-label`}>
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
                          >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
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
                          sx={{ mt: 2, color: "white" }}
                          InputLabelProps={{
                            shrink:
                              fieldName.toLowerCase().includes("next visit") ||
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

                {/* </Container> */}
              </form>
              <Box sx={{ mb: 2 }}>
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
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </Container>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>{`Want to save these details?`}</Typography>
          <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
            Back
          </Button>
          <Button
            onClick={handleFinish}
            sx={{ mt: 1, mr: 1 }}
            variant="contained"
          >
            Save
          </Button>
        </Paper>
      )}
    </Box>
  );
}
