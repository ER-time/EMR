import React from "react";
import { Button, GenericModal } from "../core";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  MenuItem,
  Select,
} from "@mui/material";
import DatePicker from "@/components/core/DatePicker";
import { TimePicker } from "@mui/x-date-pickers";
import styled from "styled-components";
import { useGetLookupByValueQuery } from "@/redux/slices/lookups";
import { ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import MuiTypography from "../core/Typography";

const StyledTimePicker = styled(TimePicker)`
  height: 54px;
  && {
    width: 100%;
  }
  .MuiInputBase-root {
    width: 100%;
    height: 100%;
  }
  .MuiOutlinedInput-notchedOutline {
    border: 1px solid #e5e6e6 !important;
    border-radius: 6px;
  }
  input {
    font-size: 14px;
  }
`;

const INPUT_FIELD_STYLES = {
  sx: {
    margin: "0px 0px",
    height: "50px",
    "& fieldset": { border: "1px solid #E5E6E6" },
    // width: "150px",
  },
};

const BUTTON_PROPS = {
  variant: "contain",
  bg: "#E02828",
  color: "#FFFFFF",
  height: "52px",
  radius: "12px",
  width: "200px",
};

export default function CreateSlotsModal({ open, handleClose, tittle }) {
  const [lookupDuration, setLookupDuration] = React.useState(21);
  const [lookupGap, setLookupGap] = React.useState(14);

  const getAllLookupByValue = useGetLookupByValueQuery();
  const lookupValuesForDuration = useGetLookupByValueQuery("SlotDuration");
  const lookupValuesForGap = useGetLookupByValueQuery("SlotGap");

  const handleChangeDuration = (event) => {
    setLookupDuration(event.target.value);
  };

  const handleChangeGap = (event) => {
    setLookupGap(event.target.value);
  };

  console.log("lookupss", lookupValuesForGap);

  // useEffect(() => {
  //   formik.setFieldValue("roleId", type);
  // }, [type]);

  const initialValues = {
    doctorId: "",
    startDateTime: "",
    endDateTime: "",
    durationId: "",
    gapId: "",
    isMonday: false,
    isTuesday: false,
    isWednesday: false,
    isThursday: false,
    isFriday: false,
    isSaturday: false,
    isSunday: false,
  };

  const validationSchema = Yup.object().shape({
    startDateTime: Yup.string().required("Start Date Time is required"),
    endDateTime: Yup.string().required("End Date Time is required"),
    durationId: Yup.string().required("Duration is required"),
    gapId: Yup.string().required("Gap is required"),
  });

  const onSubmit = async (values) => {
    try {
      let finalPayload = {
        doctorId: values.doctorId,
        startDateTime: values.startDateTime,
        endDateTime: values.endDateTime,
        durationId: values.durationId,
        gapId: values.gapId,
        isMonday: values.isMonday,
        isTuesday: values.isTuesday,
        isWednesday: values.isWednesday,
        isThursday: values.isThursday,
        isFriday: values.isFriday,
        isSaturday: values.isSaturday,
        isSunday: values.isSunday,
      };

      const resp = await getAllLookupByValue(finalPayload).unwrap();

      if (resp?.succeeded === true) {
        dispatch(
          onSuccess({
            message: resp?.message || "Success",
          })
        );
        onCancel();
      } else {
        dispatch(
          onFailure({
            message: resp?.message || "Failure",
          })
        );
      }
    } catch (err) {
      dispatch(
        onFailure({
          message: resp?.message || "Failure",
        })
      );
    }

    console.log("Form Values", finalPayload);
  };

  // const handleChange = (event) => {
  //   formik.setFieldValue("doctorSpecializationList", value);
  //   console.log("::::value", typeof value);
  // };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  return (
    <GenericModal show={open} onHide={handleClose} tittle={tittle}>
      <form onSubmit={formik.handleSubmit}>
        <FormGroup>
          <Grid container spacing={1}>
            <Grid item xs={12} lg={12}>
              <FormLabel
                sx={{ color: "#000", fontWeight: "bold" }}
                component="legend"
              >
                Select Days
              </FormLabel>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
              <FormControlLabel
                control={
                  <Checkbox name="isMonday" style={{ color: "#979797" }} />
                }
                sx={{
                  color: "#979797",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
                label="Monday"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
              <FormControlLabel
                control={
                  <Checkbox name="isMonday" style={{ color: "#979797" }} />
                }
                sx={{
                  color: "#979797",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
                label="Tuesday"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
              <FormControlLabel
                control={
                  <Checkbox name="isMonday" style={{ color: "#979797" }} />
                }
                sx={{
                  color: "#979797",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
                label="Wednesday"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
              <FormControlLabel
                control={
                  <Checkbox name="isMonday" style={{ color: "#979797" }} />
                }
                sx={{
                  color: "#979797",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
                label="Thursday"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
              <FormControlLabel
                control={
                  <Checkbox name="isMonday" style={{ color: "#979797" }} />
                }
                sx={{
                  color: "#979797",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
                label="Friday"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
              <FormControlLabel
                control={
                  <Checkbox name="isMonday" style={{ color: "#979797" }} />
                }
                sx={{
                  color: "#979797",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
                label="Saturday"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
              <FormControlLabel
                control={
                  <Checkbox name="isMonday" style={{ color: "#979797" }} />
                }
                sx={{
                  color: "#979797",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
                label="Sunday"
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <FormLabel
                sx={{ color: "#000", fontWeight: "bold", my: "20px" }}
                component="legend"
              >
                Start Date
              </FormLabel>
              <DatePicker name="startDate" />
              {formik.touched.startDate && formik.errors.startDate ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.startDate}
                </MuiTypography>
              ) : null}
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <FormLabel
                sx={{ color: "#000", fontWeight: "bold", my: "20px" }}
                component="legend"
              >
                End Date
              </FormLabel>
              <DatePicker name="endDate" />
              {formik.touched.endDate && formik.errors.endDate ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.endDate}
                </MuiTypography>
              ) : null}
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <FormLabel
                sx={{ color: "#000", fontWeight: "bold", my: "20px" }}
                component="legend"
              >
                Start Time
              </FormLabel>
              <StyledTimePicker name="startTime" />
              {formik.touched.startTime && formik.errors.startTime ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.startTime}
                </MuiTypography>
              ) : null}
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <FormLabel
                sx={{ color: "#000", fontWeight: "bold", my: "20px" }}
                component="legend"
              >
                End Time
              </FormLabel>
              <StyledTimePicker name="endTime" />
              {formik.touched.endTime && formik.errors.endTime ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.endTime}
                </MuiTypography>
              ) : null}
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <FormLabel
                sx={{ color: "#000", fontWeight: "bold", my: "20px" }}
                component="legend"
              >
                Duration
              </FormLabel>

              <Select
                inputProps={{ "aria-label": "Without label" }}
                label=""
                // defaultValue={`lookupValuesForDuration?.data?.data?.lookupId=${21}`}
                fullWidth={true}
                value={lookupDuration}
                onChange={handleChangeDuration}
                sx={INPUT_FIELD_STYLES.sx}
              >
                {lookupValuesForDuration?.data?.data.map((lookupItem) => (
                  <MenuItem
                    key={lookupItem?.lookupId}
                    value={lookupItem.lookupId}
                  >
                    {lookupItem?.value}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <FormLabel
                sx={{ color: "#000", fontWeight: "bold", my: "20px" }}
                component="legend"
              >
                Gap
              </FormLabel>
              <Select
                inputProps={{ "aria-label": "Without label" }}
                label=""
                // defaultValue={`lookupValuesForGap?.data?.data?.lookupId=${21}`}
                fullWidth={true}
                value={lookupGap}
                onChange={handleChangeGap}
                sx={INPUT_FIELD_STYLES.sx}
              >
                {lookupValuesForGap?.data?.data.map((lookupItem) => (
                  <MenuItem
                    key={lookupItem?.lookupId}
                    value={lookupItem.lookupId}
                  >
                    {lookupItem?.value}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>

          <Button
            sx={{
              my: 2,
              fontSize: "18px",
              display: "block",
              mx: "auto",
            }}
            {...BUTTON_PROPS}
          >
            Create Slots
          </Button>
        </FormGroup>
      </form>
    </GenericModal>
  );
}
