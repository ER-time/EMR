import { Box, Button, GenericModal } from "@/components";
import MuiTypography from "@/components/core/Typography";
import { Grid, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useAddOrUpdatePrescriptionMutation,
  useGetMedicinesDropdownQuery,
} from "@/redux/slices/userProfile";
import { useDispatch } from "react-redux";
import { useGetAllDropdownsQuery } from "@/redux/slices/user";
import { onSuccess } from "@/redux/features/apiStatusSlice";
import { BeatLoader } from "react-spinners";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

export default function AddPrescriptionModal({
  open,
  handleClose,
  appointmentData,
  rowData,
  title,
}) {
  const dispatch = useDispatch();

  const getAllLookup = useGetAllDropdownsQuery();
  const [addOrUpdatePrescription, { isLoading }] =
    useAddOrUpdatePrescriptionMutation();
  const medicineDropdown = useGetMedicinesDropdownQuery();

  const initialValues = {
    medicineId: rowData?.medicineId || "",
    dosageId: rowData?.dosageId || "",
    frequencyId: rowData?.frequencyId || "",
    prescriptionStartTime: rowData?.prescriptionStartTime
      ? dayjs(rowData.prescriptionStartTime)
      : null,
    prescriptionEndTime: rowData?.prescriptionEndTime
      ? dayjs(rowData.prescriptionEndTime)
      : null,
  };

  const validationSchema = Yup.object({
    medicineId: Yup.string().required("Field is Required!"),
    dosageId: Yup.string().required("Field is Required!"),
    frequencyId: Yup.string().required("Field is Required!"),
    prescriptionEndTime: Yup.date()
      .required("Field is Required!")
      .min(
        Yup.ref("prescriptionStartTime"),
        "End date must be later than start date!"
      ),
  });

  const formik = useFormik({
    initialValues,
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {
          prescriptionId: rowData ? rowData?.prescriptionId : 0,
          appointmentId: appointmentData?.data?.appointmentId,
          medicineId: values.medicineId,
          frequencyId: values.frequencyId,
          dosageId: values.dosageId,
          prescriptionStartTime: values.prescriptionStartTime.toISOString(),
          prescriptionEndTime: values.prescriptionEndTime.toISOString(),
        };
        const response = await addOrUpdatePrescription(payload);
        console.log("response", response);
        if (response.data.succeeded) {
          dispatch(
            onSuccess({ message: "Record Updated Successfully" || "Success" })
          );
          resetForm();
          handleClose();
        }
      } catch (err) {
        console.error("Error updating prescription:", err);
        // Handle error appropriately
      }
    },
    validationSchema,
  });
  console.log(
    "formik.errors.prescriptionEndTime=====>",
    formik.errors.prescriptionEndTime
  );
  return (
    <GenericModal show={open} onHide={handleClose} tittle={title}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box width="100%">
              <MuiTypography
                variant="subtitle1"
                component="label"
                fontWeight="500"
                spacing="0.1px"
                gutterBottom
              >
                Medicine <span style={{ color: "#e02828" }}>*</span>
              </MuiTypography>
              <Select
                id="medicineId"
                name="medicineId"
                value={formik.values.medicineId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.medicineId && Boolean(formik.errors.medicineId)
                }
                fullWidth
                MenuProps={{
                  style: {
                    maxHeight: 250,
                  },
                }}
              >
                {medicineDropdown?.data?.data?.map((medication) => (
                  <MenuItem
                    key={medication.medicineId}
                    value={medication.medicineId}
                  >
                    {medication.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.medicineId && formik.errors.medicineId && (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.medicineId}
                </MuiTypography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box width="100%">
              <MuiTypography
                variant="subtitle1"
                component="label"
                fontWeight="500"
                spacing="0.1px"
                gutterBottom
              >
                Dose <span style={{ color: "#e02828" }}>*</span>
              </MuiTypography>
              <Select
                id="dosageId"
                name="dosageId"
                value={formik.values.dosageId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.dosageId && Boolean(formik.errors.dosageId)
                }
                fullWidth
                MenuProps={{ style: { maxHeight: 300 } }}
              >
                {getAllLookup?.data?.data
                  ?.filter((item) => item?.type === "MedicineDose")
                  .map((medication) => (
                    <MenuItem
                      key={medication.lookupId}
                      value={medication.lookupId}
                    >
                      {medication.value}
                    </MenuItem>
                  ))}
              </Select>
              {formik.touched.dosageId && formik.errors.dosageId && (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.dosageId}
                </MuiTypography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box width="100%">
              <MuiTypography
                variant="subtitle1"
                component="label"
                fontWeight="500"
                spacing="0.1px"
                gutterBottom
              >
                Dose Frequency <span style={{ color: "#e02828" }}>*</span>
              </MuiTypography>
              <Select
                id="frequencyId"
                name="frequencyId"
                value={formik.values.frequencyId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.frequencyId &&
                  Boolean(formik.errors.frequencyId)
                }
                fullWidth
                MenuProps={{ style: { maxHeight: 300 } }}
              >
                {getAllLookup?.data?.data
                  ?.filter((item) => item?.type === "MedicineFrequency")
                  .map((medication) => (
                    <MenuItem
                      key={medication.lookupId}
                      value={medication.lookupId}
                    >
                      {medication.value}
                    </MenuItem>
                  ))}
              </Select>
              {formik.touched.frequencyId && formik.errors.frequencyId && (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.frequencyId}
                </MuiTypography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box width="100%">
              <MuiTypography
                variant="subtitle1"
                component="label"
                fontWeight="500"
                spacing="0.1px"
                gutterBottom
              >
                Prescription Start Time
              </MuiTypography>
              <DatePicker
                value={formik.values.prescriptionStartTime}
                onChange={(newValue) =>
                  formik.setFieldValue("prescriptionStartTime", newValue)
                }
              />
              {formik.touched.prescriptionStartTime &&
                formik.errors.prescriptionStartTime && (
                  <MuiTypography
                    variant="span"
                    component="span"
                    color="#E02828"
                  >
                    {formik.errors.prescriptionStartTime}
                  </MuiTypography>
                )}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box width="100%">
              <MuiTypography
                variant="subtitle1"
                component="label"
                fontWeight="500"
                spacing="0.1px"
                gutterBottom
              >
                Prescription End Time
              </MuiTypography>
              <DatePicker
                value={formik.values.prescriptionEndTime}
                onChange={(newValue) =>
                  formik.setFieldValue("prescriptionEndTime", newValue)
                }
              />
              {formik.touched.prescriptionEndTime &&
                formik.errors.prescriptionEndTime && (
                  <MuiTypography
                    variant="span"
                    component="span"
                    color="#E02828"
                  >
                    {formik.errors.prescriptionEndTime ===
                    "prescriptionEndTime must be a `date` type, but the final value was: `Invalid Date` (cast from the value `null`)."
                      ? ""
                      : formik.errors.prescriptionEndTime}
                  </MuiTypography>
                )}
            </Box>
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="flex-end" my="15px">
          <Button
            variant="contain"
            bg="#E02828"
            color="#fff"
            height="45px"
            radius="12px"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <BeatLoader color="#fff" size="10px" /> : "Save"}
          </Button>
        </Box>
      </form>
    </GenericModal>
  );
}
