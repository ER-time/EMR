import React from "react";
import { Box, Button, GenericModal } from "../core";
import { Grid, MenuItem, Select } from "@mui/material";
import MuiTypography from "../core/Typography";

import { useFormik } from "formik";
import * as Yup from "yup";
import PhoneInputCompo from "@/components/core/PhoneInput";

import InputField from "../core/Input";
import DatePicker from "@/components/core/DatePicker";

const INPUT_LABEL_PROPS = {
  variant: "subtitle1",
  component: "label",
  fontWeight: "500",
  spacing: "0.1px",
};

const INPUT_FIELD_PROPS = {
  label: "",
  fullWidth: true,
  variant: "standard",
};

const INPUT_FIELD_STYLES = {
  sx: {
    margin: "0px 0px",
    height: "50px",
    "& fieldset": { border: "1px solid #E2E5ED" },
  },
};

export default function AddEditPatientModal({
  open,
  handleClose,
  tittle,
  onConfirm,
}) {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    currentAddress: "",
  };

  const onSubmit = (values) => {
    console.log("Form Values", values);
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Field is Required!"),
    lastName: Yup.string().required("Field is Required!"),
    email: Yup.string().required("Invalid Email Format!"),
    currentAddress: Yup.string().required("Field is Required!"),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  return (
    <GenericModal show={open} onHide={handleClose} tittle={tittle}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="firstName"
                gutterBottom={true}
              >
                First Name
              </MuiTypography>
              <InputField
                id="firstName"
                placeholder="First name"
                type="text"
                name="firstName"
                {...INPUT_FIELD_PROPS}
                sx={INPUT_FIELD_STYLES.sx}
                {...formik.getFieldProps("firstName")}
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.firstName}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="lastName"
                gutterBottom={true}
              >
                Last Name
              </MuiTypography>
              <InputField
                id="lastName"
                placeholder="Last Name"
                type="text"
                name="lastName"
                {...INPUT_FIELD_PROPS}
                sx={INPUT_FIELD_STYLES.sx}
                {...formik.getFieldProps("lastName")}
              />
              {formik.touched.lastName && formik.errors.lastName ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.lastName}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="gender"
                gutterBottom={true}
              >
                Gender
              </MuiTypography>
              <Select
                value={10}
                // onChange={handleChange}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                labe=""
                fullWidth={true}
                sx={INPUT_FIELD_STYLES.sx}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </Box>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="email"
                gutterBottom={true}
              >
                D.O.B
              </MuiTypography>

              <DatePicker />
            </Box>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="email"
                gutterBottom={true}
              >
                Email
              </MuiTypography>
              <InputField
                id="email"
                placeholder="Email"
                type="email"
                name="email"
                {...INPUT_FIELD_PROPS}
                sx={INPUT_FIELD_STYLES.sx}
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.email}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="phoneNumber"
                gutterBottom={true}
              >
                Phone Number
              </MuiTypography>

              <PhoneInputCompo />
            </Box>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="email"
                gutterBottom={true}
              >
                Status
              </MuiTypography>

              <Select
                value={10}
                // onChange={handleChange}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                labe=""
                fullWidth={true}
                sx={INPUT_FIELD_STYLES.sx}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </Box>
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="currentAddress"
                gutterBottom={true}
              >
                Current Address
              </MuiTypography>
              <InputField
                id="currentAddress"
                placeholder=" Current Address"
                type="text"
                name="currentAddress"
                {...INPUT_FIELD_PROPS}
                sx={INPUT_FIELD_STYLES.sx}
                {...formik.getFieldProps("currentAddress")}
              />
              {formik.touched.currentAddress && formik.errors.currentAddress ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.currentAddress}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>

          <Box display="flex" justifyContent="flex-end" my="15px">
            <Button
              variant="contain"
              bg="#CCC"
              color="#4D4D4D"
              height="45px"
              radius="12px"
              sx={{ margin: "0px 10px" }}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="contain"
              bg="#E02828"
              color="#fff"
              height="45px"
              radius="12px"
              onClick={handleClose}
            >
              Add Patient
            </Button>
          </Box>
        </Grid>
      </form>
    </GenericModal>
  );
}
