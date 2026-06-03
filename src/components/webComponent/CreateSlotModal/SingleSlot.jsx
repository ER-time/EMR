import { FormLabel, Grid, MenuItem, Select } from "@mui/material";
import DatePicker from "@/components/core/DatePicker";
import { TimePicker } from "@mui/x-date-pickers";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useGetLookupByValueQuery } from "@/redux/slices/lookups";
import { Button } from "@/components/core";
import { useAddOrUpdateSlotMutation } from "@/redux/slices/sloting";
import { useSession } from "next-auth/react";
import MuiTypography from "@/components/core/Typography";
import { useDispatch } from "react-redux";
import { BeatLoader } from "react-spinners";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";
import { useGetAllDropdownsQuery } from "@/redux/slices/user";
import dayjs from "dayjs";
import moment from "moment";
import {
  convertDateToISOFormat,
  convertTimeIntoUTC,
  extractTimeIn24HourFormat,
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

function SingleSlot({ onHide }) {
  const session = useSession();
  const dispatch = useDispatch();
  const doctorId = session?.data?.user?.user?.userId;
  const [singleSlotCreate, { isLoading }] = useAddOrUpdateSlotMutation();

  const getAllLookup = useGetAllDropdownsQuery();

  function getDateInUtcFormat(dateStr, timeStr) {
    const date = new Date(dateStr);
    const time = new Date(timeStr);
    date.setHours(time.getHours(), time.getMinutes(), time.getSeconds());
    return date.toISOString();
  }

  const initialValues = {
    doctorId: doctorId,
    startDate: dayjs() || "",
    startDateTime: dayjs() || "",
    endDateTime: "",
    durationId: 21,
    gapId: 14,
    isMonday: false,
    isTuesday: false,
    isWednesday: false,
    isThursday: false,
    isFriday: false,
    isSaturday: false,
    isSunday: false,
  };

  const validationSchema = Yup.object().shape({
    startDate: Yup.date().required("Date is Required!"),
    startDateTime: Yup.date()
      .required("Start time is required")
      .test(
        "is-after-current-time",
        "Start time must be greater than current time",
        function(value) {
          const { startDate } = this.parent;
          if (!startDate || !value) return true;
          const startDateTime = dayjs(startDate).hour(dayjs(value).hour()).minute(dayjs(value).minute());
          return startDateTime.isAfter(dayjs());
        }
      ),
    endDateTime: Yup.date()
      .required("End Time is required")
      .test(
        "is-after-start-time",
        "End time must be greater than start time",
        function(value) {
          const { startDate, startDateTime } = this.parent;
          if (!startDate || !startDateTime || !value) return true;
          const startDateTimeMoment = dayjs(startDate).hour(dayjs(startDateTime).hour()).minute(dayjs(startDateTime).minute());
          const endDateTime = dayjs(startDate).hour(dayjs(value).hour()).minute(dayjs(value).minute());
          return endDateTime.isAfter(startDateTimeMoment);
        }
      ),
    durationId: Yup.string().required("Duration is required"),
    gapId: Yup.string().required("Gap is required"),
  });
  
  

  const array = [
    "isSunday",
    "isMonday",
    "isTuesday",
    "isWednesday",
    "isThursday",
    "isFriday",
    "isSaturday",
  ];

  const onSubmit = async (values) => {
    let finalPayload = {
      doctorId: doctorId,

      startDateTime: convertTimeIntoUTC(
        extractTimeIn24HourFormat(values?.startDateTime?.$d),
        convertDateToISOFormat(values?.startDate?.$d)
      ),
      endDateTime: convertTimeIntoUTC(
        extractTimeIn24HourFormat(values?.endDateTime?.$d),
        convertDateToISOFormat(values.startDate?.$d) 
      ),

      startDate: values?.startDate?.$d.toISOString().split("T")[0],
      endDate: values?.startDate?.$d.toISOString().split("T")[0],
      durationId: values.durationId,
      gapId: values.gapId,
      [array[values?.startDate?.$W]]: true,
    };
    try {
      // return;
      const resp = await singleSlotCreate(finalPayload).unwrap();
      console.log("resp:::",resp);
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
            message: "Slots Already Exist",
          })
        );
      }
    } catch (err) {
      console.log("error:::", err);
      dispatch(
        onFailure({
          message: "Slots Already Exist" || "Failure",
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
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <FormLabel
            sx={{ color: "#000", fontWeight: "bold", my: "20px" }}
            component="legend"
          >
            Date
          </FormLabel>
          <DatePicker
            name="startDate"
            disablePast
            value={formik.values.startDate}
            onChange={(newValue) => formik.setFieldValue("startDate", newValue)}
          />
          {formik.touched.startDate && formik.errors.startDate ? (
            <MuiTypography variant="span" component="span" color="#E02828">
              {formik.errors.startDate}
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
            disabled={!formik.values.startDate}
            name="startDateTime"
            value={formik.values.startDateTime}
            onChange={(newValue) =>
              {
                  console.log(" Onchange startDate:::",newValue);
                formik.setFieldValue("startDateTime", newValue)
              }
            }
          />
          {formik.touched.startDateTime && formik.errors.startDateTime ? (
            <MuiTypography variant="span" component="span" color="#E02828">
              {formik.errors.startDateTime}
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
            name="endDateTime"
            value={formik.values.endDateTime}
            disabled={!formik.values.startDate || !formik.values.startDateTime}
            onChange={(newValue) =>
            {console.log("EmdDate Onchange:::",newValue);
                formik.setFieldValue("endDateTime", newValue)}
            }
          />
          {formik.touched.endDateTime && formik.errors.endDateTime ? (
            <MuiTypography variant="span" component="span" color="#E02828">
              {formik.errors.endDateTime}
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
            onChange={(e) => formik.setFieldValue("durationId", e.target.value)}
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
        type="submit"
        disabled={isLoading ? true : false}
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
    </form>
  );
}

export default SingleSlot;
