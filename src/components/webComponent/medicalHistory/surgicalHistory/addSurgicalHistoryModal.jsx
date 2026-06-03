import React from "react";
import * as Yup from "yup";
import Table from "@/components/core/Table";
import { Button } from "@/components";
import { Box, Grid, MenuItem, Select } from "@mui/material";
import InputField from "@/components/core/Input";
import MuiTypography from "@/components/core/Typography";
import { GenericModal } from "@/components";
import { useFormik } from "formik";
import { useSurgicalHistoryAddOrUpdateMutation } from "@/redux/slices/userProfile";
import { getSession } from "next-auth/react";
import MaterialReactTable from "material-react-table";
import styled from "styled-components";
import { useGetLookupByValueQuery } from "@/redux/slices/lookups";
import { useDispatch } from "react-redux";
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
const SurgicalHistoryModal = ({
  appointmentData,
  open,
  handleClose,
  GetAllSurgicalHistory,
  columns,
}) => {
  const dispatch = useDispatch();
  const [
    surgicalHistoryAddOrUpdate,
    { data: surgicalHistoryData, isLoading, isError, error, isSuccess },
  ] = useSurgicalHistoryAddOrUpdateMutation();
  const SocialAddictionType = useGetLookupByValueQuery("surgeryType");

  const initialValues = {
    year: "",
    reason: "",
    surgery: "",
  };
  const onSubmit = async (values) => {
    const session = await getSession();
    try {
      let finalPayload = {
        surgicalHistoryId: 0,
        surgeryTypeId: values?.surgery,
        surgeryYear: values.year,
        surgeryReason: values?.reason,
        patientId: appointmentData
          ? appointmentData?.data?.patientId
          : session?.user?.user?.userId,
      };
      const resp = await surgicalHistoryAddOrUpdate(finalPayload).unwrap();
      if (resp?.succeeded === true) {
        handleClose();
        dispatch(
          onSuccess({
            message: resp?.message || "Success",
          })
        );
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
    surgery: Yup.string().required("Field is Required!"),
    year: Yup.string().required("Field is Required!"),
    reason: Yup.string().required("Field is Required!"),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });
  return (
    <GenericModal show={open} onHide={handleClose} tittle="Add Medications">
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="surgery"
                gutterBottom={true}
              >
                Surgery
              </MuiTypography>
              <Select
                // value={10}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                label=""
                fullWidth={true}
                sx={INPUT_FIELD_STYLES.sx}
                {...formik.getFieldProps("surgery")}
              >
                {SocialAddictionType?.data?.data?.map(
                  (SocialAddiction, index) => (
                    <MenuItem key={index} value={SocialAddiction?.lookupId}>
                      {SocialAddiction?.value}
                    </MenuItem>
                  )
                )}
              </Select>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="year"
                gutterBottom={true}
              >
                Surgery year
              </MuiTypography>
              <InputField
                id="yearId"
                type="number"
                name="year"
                placeholder="2024"
                {...INPUT_FIELD_PROPS}
                sx={INPUT_FIELD_STYLES.sx}
                {...formik.getFieldProps("year")}
              />
              {formik.touched.year && formik.errors.year ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.year}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>
          <Grid item xs={12} md={12}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="diseases"
                gutterBottom={true}
              >
                Surgery Reason
              </MuiTypography>
              <InputField
                id="reasonId"
                placeholder="Diabetes, Cholesterol, High Blood Pressure,"
                type="text"
                name="reason"
                {...INPUT_FIELD_PROPS}
                sx={INPUT_FIELD_STYLES.sx}
                {...formik.getFieldProps("reason")}
              />
              {formik.touched.reason && formik.errors.reason ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.reason}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Box display="flex" justifyContent="flex-end" my="15px">
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
        </Grid>
      </form>
      <div style={{ border: "1px solid #F2F2F2" }}>
        {GetAllSurgicalHistory?.isSuccess && (
          <StyledMaterialReactTable
            enableRowSelection={false}
            enableTopToolbar={false}
            enableColumnFilters={false}
            enableColumnActions={false}
            enablePagination={false}
            columns={columns}
            data={GetAllSurgicalHistory?.data?.data || []}
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
      {/* <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="medicineName"
                gutterBottom={true}
              >
                Medicine <span style={{ color: "#e02828" }}>*</span>
              </MuiTypography>
              <Select
                label="Medicine Name"
                id="medicineName"
                name="medicineName"
                value={formik.values.medicineName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.medicineName &&
                  Boolean(formik.errors.medicineName)
                }
                fullWidth={true}
              >
                <MenuItem value="22">Actidil Elixir</MenuItem>
                <MenuItem value="23">Augmentin Drops</MenuItem>
                <MenuItem value="24">Avodart Capsules</MenuItem>
                <MenuItem value="25">Betnovate N Ointment</MenuItem>
                <MenuItem value="26">Calpol Tablets</MenuItem>
              </Select>

              {formik.touched.medicineName && formik.errors.medicineName ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.medicineName}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="doseNumber"
                gutterBottom={true}
              >
                Dose <span style={{ color: "#e02828" }}>*</span>
              </MuiTypography>

              <Select
                label="Dose"
                id="dose"
                name="dose"
                value={formik.values.dose}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.dose && Boolean(formik.errors.dose)}
                fullWidth={true}
              >
                <MenuItem value="1">Biopsy</MenuItem>
                <MenuItem value="2">Edema</MenuItem>
                <MenuItem value="3">Hypertension</MenuItem>
                <MenuItem value="4">Inpatient</MenuItem>
                <MenuItem value="5">Gland</MenuItem>
              </Select>
              {formik.touched.dose && formik.errors.dose ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.dose}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="doseFrequency"
                gutterBottom={true}
              >
                Dose Frequency <span style={{ color: "#e02828" }}>*</span>
              </MuiTypography>

              <Select
                label="Dose"
                id="doseFrequency"
                name="doseFrequency"
                value={formik.values.doseFrequency}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.doseFrequency &&
                  Boolean(formik.errors.doseFrequency)
                }
                fullWidth={true}
              >
                <MenuItem value="7">Once daily</MenuItem>
                <MenuItem value="8">Twice daily</MenuItem>
                <MenuItem value="9">Three times daily</MenuItem>
                <MenuItem value="10">Every 8 hours</MenuItem>
                <MenuItem value="11">As needed (PRN)</MenuItem>
                <MenuItem value="12">Every other day</MenuItem>
                <MenuItem value="13">Weekly</MenuItem>
              </Select>
              {formik.touched.doseFrequency && formik.errors.doseFrequency ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.doseFrequency}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Box width="100%">
              <MuiTypography {...INPUT_LABEL_PROPS} htmlFor="reason">
                Reason <span style={{ color: "#e02828" }}>*</span>
              </MuiTypography>
              <InputField
                type="text"
                id="reason"
                placeholder="Type here"
                name="reason"
                {...INPUT_FIELD_PROPS}
                sx={INPUT_FIELD_STYLES.sx}
                onChange={formik.handleChange}
                value={formik.values.reason}
              />
              {formik.touched.reason && formik.errors.reason ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.reason}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>
          <Box display="flex" justifyContent="flex-end" my="15px">
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
        {getMedications?.isSuccess && (
          <Table
            columns={columns}
            data={getMedications?.data?.data || []}
            enableRowSelection={false}
            enableRowActions={false}
          />
        )}
      </div> */}
    </GenericModal>
  );
};

export default SurgicalHistoryModal;
