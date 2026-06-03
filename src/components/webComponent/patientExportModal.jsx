import { Button, GenericModal } from "../core";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";
import { useState } from "react";
import { Grid } from "@mui/material";

export default function PatientExportModal({ open, handleClose, ...props }) {
  const [state, setState] = useState({
    appointments: false,
    medications: false,
    medicalHistory: false,
    patientAssessment: false,
    familyHistory: false,
    socialHistory: false,
    surgicalHistory: false,
    userName: false,
    sex: false,
    age: false,
    location: false,
    chiefComplaint: false,
    symptoms: false,
    prescription: false,
    invoice: false,
  });

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const {
    appointments,
    medications,
    medicalHistory,
    patientAssessment,
    familyHistory,
    socialHistory,
    surgicalHistory,
    userName,
    sex,
    age,
    location,
    chiefComplaint,
    symptoms,
    prescription,
    invoice,
  } = state;
  const error =
    [
      medications,
      medicalHistory,
      patientAssessment,
      familyHistory,
      socialHistory,
      surgicalHistory,
      userName,
      sex,
      age,
      location,
      chiefComplaint,
      symptoms,
      prescription,
      appointments,
      invoice,
    ].filter((v) => v).length !== 2;

  return (
    <GenericModal
      size="md"
      show={open}
      onHide={handleClose}
      tittle="Export Patient"
    >
      <FormControl component="fieldset" variant="standard">
        {/* <FormLabel component="legend">
          Select patient details to export
        </FormLabel>
        <FormHelperText>Select at least 1</FormHelperText> */}
        <FormGroup>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <FormLabel component="legend">Personal Details</FormLabel>
            </Grid>
            <Grid item xs={12} lg={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={userName}
                    onChange={handleChange}
                    name="userName"
                  />
                }
                label="Name"
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <FormControlLabel
                control={
                  <Checkbox checked={sex} onChange={handleChange} name="sex" />
                }
                label="Sex"
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <FormControlLabel
                control={
                  <Checkbox checked={age} onChange={handleChange} name="age" />
                }
                label="Age"
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={location}
                    onChange={handleChange}
                    name="location"
                  />
                }
                label="Location"
              />
            </Grid>

            <Grid item xs={12} lg={12}>
              <FormLabel component="legend">Medical</FormLabel>
            </Grid>
            <Grid item xs={12} lg={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={medicalHistory}
                    onChange={handleChange}
                    name="medicalHistory"
                  />
                }
                label="Medical History"
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={medications}
                    onChange={handleChange}
                    name="medications"
                  />
                }
                label="Medications"
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={familyHistory}
                    onChange={handleChange}
                    name="familyHistory"
                  />
                }
                label="Family History"
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={surgicalHistory}
                    onChange={handleChange}
                    name="surgicalHistory"
                  />
                }
                label="Surgical History"
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={socialHistory}
                    onChange={handleChange}
                    name="socialHistory"
                  />
                }
                label="Social History"
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={patientAssessment}
                    onChange={handleChange}
                    name="patientAssessment"
                  />
                }
                label="Patient Assessment"
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={chiefComplaint}
                    onChange={handleChange}
                    name="chiefComplaint"
                  />
                }
                label="Chief Complaint"
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={symptoms}
                    onChange={handleChange}
                    name="symptoms"
                  />
                }
                label="Symptoms"
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={prescription}
                    onChange={handleChange}
                    name="prescription"
                  />
                }
                label="Prescription"
              />
            </Grid>

            <Grid item xs={12} lg={12}>
              <FormLabel component="legend">Financial</FormLabel>
            </Grid>

            <Grid item xs={12} lg={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={appointments}
                    onChange={handleChange}
                    name="appointments"
                  />
                }
                label="Appointments"
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={invoice}
                    onChange={handleChange}
                    name="invoice"
                  />
                }
                label="Invoices"
              />
            </Grid>
          </Grid>
        </FormGroup>
        <Button
          variant="contain"
          bg="#E02828"
          color="#fff"
          height="45px"
          radius="12px"
          sx={{ margin: "15px 0px" }}
        >
          Export
        </Button>
      </FormControl>
    </GenericModal>
  );
}
