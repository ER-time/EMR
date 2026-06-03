import MuiTypography from "@/components/core/Typography";
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
import React from "react";
import styled from "styled-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useGetLookupByValueQuery } from "@/redux/slices/lookups";
import { Button } from "@/components/core";
import { useAddOrUpdateSlotMutation } from "@/redux/slices/sloting";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import moment from "moment/moment";
import { BeatLoader } from "react-spinners";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";
import { useGetAllDropdownsQuery } from "@/redux/slices/user";
import {
  convertDateToISOFormat,
  convertTimeIntoUTC,
  extractTimeIn24HourFormat,
  utcConversion,
} from "@/lib/utils";

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

function RecurringSlot({ onHide }) {
  const session = useSession();
  const dispatch = useDispatch();
  const doctorId = session?.data?.user?.user?.userId;

  const [recurringSlotCreate, { isLoading }] = useAddOrUpdateSlotMutation();
  const getAllLookup = useGetAllDropdownsQuery();
  // const lookupValuesForDuration = useGetLookupByValueQuery("SlotDuration");
  // const lookupValuesForGap = useGetLookupByValueQuery("SlotGap");

  function getDateInUtcFormat(dateStr, timeStr) {
    // debugger;
    const date = new Date(dateStr);
    const time = new Date(timeStr);
    date.setHours(time.getHours(), time.getMinutes(), time.getSeconds());
    return date?.toISOString();
  }

  const initialValues = {
    doctorId: doctorId,
    startDate: dayjs() || "",
    endDate: "",
    startTime: "",
    endTime: "",
    durationId: 21,
    gapId: 14,
    selectedDays: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    isMonday: true,
    isTuesday: true,
    isWednesday: true,
    isThursday: true,
    isFriday: true,
    isSaturday: true,
    isSunday: true,
  };

  const validationSchema = Yup.object().shape({
    startDate: Yup.string().required("Start Date is Required!"),
    endDate: Yup.string().required("End Date is Required!"),
    startTime: Yup.string().required("Start time is required"),
    endDate: Yup.string().required("End Date is Required!"),
    // .test(
    //   "is-greater",
    //   "End Date must be greater than Start Date",
    //   function (endDate) {
    //     const { startDate } = this.parent;
    //     if (!startDate || !endDate) return true; // If either date is not set, validation passes
    //     return dayjs(endDate).isAfter(startDate);
    //   }
    // )
    // endTime: Yup.string().required("End Time is required"),
    durationId: Yup.string().required("Duration is required"),
    gapId: Yup.string().required("Gap is required"),
    selectedDays: Yup.array()
      .required("Select days")
      .test("atLeastOneDay", "Select days", (value) => {
        return value && value.length > 0;
      }),
  });

  const onSubmit = async (values) => {
    // );
    try {
      // debugger;
      let finalPayload = {
        doctorId: doctorId,

        startDateTime: convertTimeIntoUTC(
          extractTimeIn24HourFormat(values?.startTime?.$d),
          convertDateToISOFormat(values?.startDate?.$d)
        ),
        endDateTime: convertTimeIntoUTC(
          extractTimeIn24HourFormat(values?.endTime?.$d),
          convertDateToISOFormat(values?.endDate?.$d)
        ),

        durationId: values.durationId,
        gapId: values.gapId,
        startDate: utcConversion(values?.startDate),
        endDate: utcConversion(values?.endDate),

        isMonday: values.isMonday || false,
        isTuesday: values.isTuesday || false,
        isWednesday: values.isWednesday || false,
        isThursday: values.isThursday || false,
        isFriday: values.isFriday || false,
        isSaturday: values.isSaturday || false,
        isSunday: values.isSunday || false,
      };
      console.log("payload:::", finalPayload);
      // return;
      const resp = await recurringSlotCreate(finalPayload).unwrap();

      if (resp?.succeeded === true) {
        dispatch(
          onSuccess({
            message: "Slots created Successfully" || "Success",
          })
        );
        onHide();
      } else {
        dispatch(
          onFailure({
            message: "Slots Already Created" || "Failure",
          })
        );
      }
    } catch (err) {
      dispatch(
        onFailure({
          message: "Failure",
        })
      );
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  return (
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
          <FormGroup>
            <Grid container spacing={1}>
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={index}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name={`is${day}`}
                        checked={formik.values[`is${day}`]}
                        onChange={(e) => {
                          formik.setFieldValue(`is${day}`, e.target.checked);
                          const selectedDays = [
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                            "Sunday",
                          ].filter((d) => formik.values[`is${d}`]);

                          formik.setFieldValue("selectedDays", selectedDays);

                          if (selectedDays.length === 0) {
                            formik.setFieldError(
                              "selectedDays",
                              "Select at least one day"
                            );
                          } else {
                            formik.setFieldError("selectedDays", undefined);
                          }
                        }}
                        style={{ color: "#979797" }}
                      />
                    }
                    sx={{
                      color: "#979797",
                      fontSize: "14px",
                      fontWeight: "400",
                    }}
                    label={day}
                  />
                </Grid>
              ))}
            </Grid>
            {formik.touched.selectedDays && formik.errors.selectedDays && (
              <MuiTypography variant="span" component="span" color="#E02828">
                {formik.errors.selectedDays}
              </MuiTypography>
            )}
          </FormGroup>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <FormLabel
              sx={{ color: "#000", fontWeight: "bold", my: "20px" }}
              component="legend"
            >
              Start Date
            </FormLabel>
            <DatePicker
              name="startDate"
              minDate={dayjs(moment())}
              value={formik.values.startDate}
              onChange={(newValue) =>
                formik.setFieldValue("startDate", newValue)
              }
            />
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
            <DatePicker
              name="endDate"
              value={formik.values.endDate}
              onChange={(newValue) => formik.setFieldValue("endDate", newValue)}
              disabled={!formik.values.startDate}
              minDate={formik.values.startDate}
            />
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
            <StyledTimePicker
              name="startTime"
              value={formik.values.startDate}
              disabled={!formik.values.startDate || !formik.values.endDate}
              onChange={(newValue) =>
                formik.setFieldValue("startTime", newValue)
              }
            />
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
            <StyledTimePicker
              name="endTime"
              value={formik.values.endDate}
              onChange={(newValue) => formik.setFieldValue("endTime", newValue)}
              disabled={!formik.values.startTime}
            />
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
              fullWidth={true}
              sx={INPUT_FIELD_STYLES.sx}
              value={formik.values.durationId}
              onChange={(e) =>
                formik.setFieldValue("durationId", e.target.value)
              }
            >
              {getAllLookup?.data?.data
                ?.filter((item) => item?.type === "SlotDuration")
                ?.map((lookupItem, index) => {
                  return (
                    <MenuItem key={index} value={lookupItem?.lookupId}>
                      {lookupItem?.value}
                    </MenuItem>
                  );
                })}
            </Select>
            {formik.touched.durationId && formik.errors.durationId ? (
              <MuiTypography variant="span" component="span" color="#E02828">
                {formik.errors.durationId}
              </MuiTypography>
            ) : null}
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
              fullWidth={true}
              value={formik.values.gapId}
              onChange={(e) => formik.setFieldValue("gapId", e.target.value)}
              sx={INPUT_FIELD_STYLES.sx}
            >
              {getAllLookup?.data?.data
                ?.filter((item) => item?.type === "SlotGap")
                ?.map((lookupItem, index) => {
                  return (
                    <MenuItem key={index} value={lookupItem?.lookupId}>
                      {lookupItem?.value}
                    </MenuItem>
                  );
                })}
            </Select>

            {formik.touched.gapId && formik.errors.gapId ? (
              <MuiTypography variant="span" component="span" color="#E02828">
                {formik.errors.gapId}
              </MuiTypography>
            ) : null}
          </Grid>
        </Grid>

        <Button
          disabled={isLoading ? true : false}
          type="submit"
          sx={{
            my: 2,
            fontSize: "18px",
            display: "block",
            mx: "auto",
          }}
          {...BUTTON_PROPS}
        >
          {isLoading === true ? (
            <BeatLoader color="#fff" size="10px" />
          ) : (
            "Create Slot"
          )}
        </Button>
      </FormGroup>
    </form>
  );
}

export default RecurringSlot;
