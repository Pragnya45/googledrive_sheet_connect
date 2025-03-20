import { useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Container, Grid, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryApi } from "../hooks/useQueryApi";
import { useSelector } from "react-redux";
import { adminState } from "../Redux/adminSlice";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../hooks/useNotification";
import useApi from "../hooks/useApi";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const steps = [
  {
    label: "Patients Details",
    description: "Enter Patient's Details here:",
    fields: [
      "Patient ID",
      "Patient Name (First, Last Name)",
      "Email",
      "Location",
      "Age",
      "Gender",
      "Phone",
      "Address",
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

export default function EditPatientPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showMessage } = useNotification();
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const { fileId } = useSelector(adminState);
  const { apiFn, loading } = useApi();
  const [formData, setFormData] = useState({});

  const { data: field, isFetching } = useQueryApi({
    url: `/googledrive/get-patient?spreadsheetId=${fileId}&patientId=${id}`,
    queryKey: "configField" + id,
    enabled: true,
  });
  const data = field?.response;
  console.log(data);
  const { data: physicianfield, isFetching: physicianFetching } = useQueryApi({
    url: `/googledrive/get-physician?spreadsheetId=${fileId}`,
    queryKey: "physician",
    enabled: true,
  });
  const physicianData = physicianfield?.response?.results;
  console.log(physicianData);

  useEffect(() => {
    const formDataFromApi = {
      "Patient Name (First, Last Name)": `${data?.first_name} ${data?.last_name}`,
      Email: data?.email,
      Location: data?.location,
      Age: data?.age,
      Gender: data?.gender,
      Phone: data?.phone,
      Address: data?.address,
      Prescription: data?.description,
      Dose: data?.dose,
      "Visit Date": data?.start_dt_time,
      "Next Visit": data?.next_dt_time,
      "Physician ID": data?.physicianId || "345",
      "Physician Name": data?.physician_name || "",
      "Physician Number": data?.pcp,
      Bill: data?.bill,
      "Patient ID": data?.patientId,
    };

    setFormData(formDataFromApi);
  }, [data]);

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
  const handlePhysicianChange = (selectedName) => {
    console.log(selectedName);
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
      "Physician Name": "physician_name",
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
      url: `/googledrive/edit-patient?spreadsheetId=${fileId}&patientId=${id}`,
      options: {
        method: "PUT",
        body: formattedData,
      },
    });
    if (response) {
      showMessage({
        type: "success",
        value: "Patient Updated",
      });
      navigate("/");
      return;
    }
  };

  return (
    <Container>
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
          Edit Patients
        </Typography>
      </Stack>
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
                                value={
                                  physicianData?.some(
                                    (physician) =>
                                      physician[1]?.toString() ===
                                      formData["Physician Name"]
                                  )
                                    ? formData["Physician Name"]?.toString()
                                    : ""
                                }
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
                                    key={physician[1]}
                                    value={physician[1]}
                                  >
                                    {physician[1]?.toString()}
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
                                fieldName
                                  .toLowerCase()
                                  .includes("next visit") ||
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

                    {/* </Container> */}
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
                backgroundColor: loading ? "#1976d2" : undefined, // Default blue background when loading
                "&.Mui-disabled": {
                  backgroundColor: "#1976d2", // Keep default background when disabled
                },
                height: 40, // ✅ Consistent height
                minWidth: 100, // Optional to maintain button width consistency
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
    </Container>
  );
}
