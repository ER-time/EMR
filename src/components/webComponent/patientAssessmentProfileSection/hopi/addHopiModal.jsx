import React from "react";
import * as Yup from "yup";
import Table from "@/components/core/Table";
import { Button } from "@/components";
import { Box, Grid, MenuItem, Select } from "@mui/material";
import { format } from "date-fns";
import InputField from "@/components/core/Input";
import MuiTypography from "@/components/core/Typography";
import { GenericModal } from "@/components";
import { useFormik } from "formik";
import {
  useHOPIAddOrUpdateMutation,
} from "@/redux/slices/userProfile";
import MaterialReactTable from "material-react-table";
import styled from "styled-components";
import { useGetLookupByValueQuery } from "@/redux/slices/lookups";
const StyledMaterialReactTable = styled(MaterialReactTable)``;
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
const AddHopiModal = ({
  open,
  handleClose,
  historyOfPresentIllness,
  columns,
  illnessId,
}) => {
  const initialValues = {
    illnessId: 0,
    timingOnset: "",
    location: "",
    duration: "",
    aggrevatingFactors: "",
    relievingFactors: "",
    treatmentsTried: "",
    symptomsAssociated: "",
    severity: "",
  };
  const [HOPIAddOrUpdate, { isLoading, isError, error, isSuccess }] =
    useHOPIAddOrUpdateMutation();
  const SeverityLookups = useGetLookupByValueQuery("SeverityType");
  const currentDate = new Date();
  const isoString = currentDate.toISOString();
  const onSubmit = async (values) => {
    try {
      let finalPayload = {
        createdDate: isoString,
        createdBy: 46,
        appointmentId: 43,
        illnessId: illnessId ? illnessId : 0,
        timingOnset: values.timingOnset,
        location: values.location,
        duration: values.duration,
        aggrevatingFactors: values.aggrevatingFactors,
        relievingFactors: values.relievingFactors,
        treatmentsTried: values.treatmentsTried,
        symptomsAssociated: values.symptomsAssociated,
        severity: values.severity,
      };
      const resp = await HOPIAddOrUpdate(finalPayload).unwrap();
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
  };

  const validationSchema = Yup.object({
    timingOnset: Yup.string().required("Field is Required!"),
    location: Yup.string().required("Field is Required!"),
    duration: Yup.string().required("Field is Required!"),
    aggrevatingFactors: Yup.string().required("Field is Required!"),
    relievingFactors: Yup.string().required("Field is Required!"),
    treatmentsTried: Yup.string().required("Field is Required!"),
    symptomsAssociated: Yup.string().required("Field is Required!"),
    severity: Yup.string().required("Field is Required!"),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });
  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    // Assuming the selectedDate is in the format YYYY-MM-DD
    const formattedDate = format(
      new Date(selectedDate),
      "yyyy-MM-dd'T'HH:mm:ss"
    );
    formik.setFieldValue("timingOnset", formattedDate);
  };
  return (
    <GenericModal show={open} onHide={handleClose} tittle="Add HOPI">
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="timingOnset"
                gutterBottom={true}
              >
                Timing On Set
              </MuiTypography>
              <InputField
                id="timingOnsetId"
                type="date"
                name="timingOnset"
                onChange={handleDateChange}
                placeholder="Timing On Set"
                {...INPUT_FIELD_PROPS}
                sx={INPUT_FIELD_STYLES.sx}
                // {...formik.getFieldProps("timingOnset")}
              />
              {formik.touched.timingOnset && formik.errors.timingOnset ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.timingOnset}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="location"
                gutterBottom={true}
              >
                Location
              </MuiTypography>
              <InputField
                id="locationId"
                placeholder="Location"
                type="text"
                name="location"
                {...INPUT_FIELD_PROPS}
                sx={INPUT_FIELD_STYLES.sx}
                {...formik.getFieldProps("location")}
              />
              {formik.touched.location && formik.errors.location ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.location}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="duration"
                gutterBottom={true}
              >
                Duration
              </MuiTypography>
              <InputField
                id="durationId"
                placeholder="Duration"
                type="text"
                name="duration"
                {...INPUT_FIELD_PROPS}
                sx={INPUT_FIELD_STYLES.sx}
                {...formik.getFieldProps("duration")}
              />
              {formik.touched.duration && formik.errors.duration ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.duration}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="aggrevatingFactors"
                gutterBottom={true}
              >
                Aggrevating Factors
              </MuiTypography>
              <InputField
                id="aggrevatingFactorsId"
                placeholder="Aggrevating Factors"
                type="text"
                name="aggrevatingFactors"
                {...INPUT_FIELD_PROPS}
                sx={INPUT_FIELD_STYLES.sx}
                {...formik.getFieldProps("aggrevatingFactors")}
              />
              {formik.touched.aggrevatingFactors &&
              formik.errors.aggrevatingFactors ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.aggrevatingFactors}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="relievingFactors"
                gutterBottom={true}
              >
                Relieving Factors
              </MuiTypography>
              <InputField
                id="relievingFactorsId"
                placeholder="Relieving Factors"
                type="text"
                name="relievingFactors"
                {...INPUT_FIELD_PROPS}
                sx={INPUT_FIELD_STYLES.sx}
                {...formik.getFieldProps("relievingFactors")}
              />
              {formik.touched.relievingFactors &&
              formik.errors.relievingFactors ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.relievingFactors}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="treatmentsTried"
                gutterBottom={true}
              >
                Treatments Tried
              </MuiTypography>
              <InputField
                id="treatmentsTriedId"
                placeholder="Treatments Tried"
                type="text"
                name="treatmentsTried"
                {...INPUT_FIELD_PROPS}
                sx={INPUT_FIELD_STYLES.sx}
                {...formik.getFieldProps("treatmentsTried")}
              />
              {formik.touched.treatmentsTried &&
              formik.errors.treatmentsTried ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.treatmentsTried}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="symptomsAssociated"
                gutterBottom={true}
              >
                Symptoms Associated
              </MuiTypography>
              <InputField
                id="symptomsAssociatedId"
                placeholder="Symptoms Associated"
                type="text"
                name="symptomsAssociated"
                {...INPUT_FIELD_PROPS}
                sx={INPUT_FIELD_STYLES.sx}
                {...formik.getFieldProps("symptomsAssociated")}
              />
              {formik.touched.symptomsAssociated &&
              formik.errors.symptomsAssociated ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.symptomsAssociated}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="severity"
                gutterBottom={true}
              >
                Severity
              </MuiTypography>
              <Select
                displayEmpty
                placeholder="Severity"
                inputProps={{ "aria-label": "Without label" }}
                label=""
                name="severity"
                value={formik.values.medicineName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.severity && Boolean(formik.errors.severity)
                }
                fullWidth={true}
                sx={INPUT_FIELD_STYLES.sx}
              >
                {SeverityLookups?.data?.data?.map((SeverityLookup, index) => (
                  <MenuItem key={index} value={SeverityLookup?.lookupId}>
                    {SeverityLookup?.value}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.severity && formik.errors.severity ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.severity}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>

          <Box display="flex" justifyContent="flex-end" mx="20px" my="20px">
            <Button
              type="submit"
              variant="contain"
              bg="#E02828"
              color="#fff"
              height="45px"
              radius="12px"
            >
              Save
            </Button>
          </Box>
        </Grid>
      </form>
      <div style={{ border: "1px solid #F2F2F2" }}>
        {historyOfPresentIllness?.isSuccess && (
          <StyledMaterialReactTable
            enableRowSelection={false}
            enableTopToolbar={false}
            enableColumnFilters={false}
            enableColumnActions={false}
            enablePagination={false}
            columns={columns}
            data={historyOfPresentIllness?.data?.data || []}
            muiTablePaperProps={{
              sx: { boxShadow: "none", my: "10px" },
            }}
            muiTableProps={{
              sx: {
                boxShadow: "none",
              },
            }}
            muiTableHeadCellProps={{
              sx: {
                backgroundColor: "none",
                color: "#348AF4",
              },
            }}
            muiTableBodyCellProps={{
              sx: {
                borderBottomColor: "#F2F2F2",
              },
            }}
          />
        )}
      </div>
    </GenericModal>
  );
};

export default AddHopiModal;
