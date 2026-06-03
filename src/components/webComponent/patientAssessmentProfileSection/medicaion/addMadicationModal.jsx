import React from "react";
import * as Yup from "yup";
import Table from "@/components/core/Table";
import { Button } from "@/components";
import { Box, Grid, MenuItem, Select } from "@mui/material";
import InputField from "@/components/core/Input";
import MuiTypography from "@/components/core/Typography";
import { GenericModal } from "@/components";
import { useFormik } from "formik";
import { useAddOrUpdateMutation } from "@/redux/slices/userProfile";
import { useState } from "react";
import { getSession } from "next-auth/react";

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
const MedicationModal = ({
  open,
  handleClose,
  getMedications,
  columns,
  medicationId,
  getAllLookup,
}) => {
  const [userId, setuserId] = useState(null);

  const [addOrUpdate, { isLoading, isError, error, isSuccess }] =
    useAddOrUpdateMutation();

  console.log("getAllLookup", getAllLookup?.data?.data);
  const onSubmit = async (values) => {
    const session = await getSession();
    try {
      let finalPayload = {
        medicationId: medicationId ? medicationId : 0,
        medicineId: values.medicine,
        doseTypeId: values.dose,
        doseTypeId: values.dose,
        doseFrequencyTypeId: values.doseFrequency,
        reason: values.reason,
        patientId: session?.user?.user?.userId,
      };

      const resp = await addOrUpdate(finalPayload).unwrap();
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

  const initialValues = {
    medicineName: "",
    dose: "",
    doseFrequency: "",
    reason: "",
  };

  const validationSchema = Yup.object({
    medicineName: Yup.string().required("Field is Required!"),
    dose: Yup.string().required("Field is Required!"),
    doseFrequency: Yup.string().required("Field is Required!"),
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
                {getAllLookup?.data?.data
                  ?.filter((item) => item?.type === "MedicineDose")
                  ?.map((medication, index) => {
                    return (
                      <MenuItem key={index} value={medication?.lookupId}>
                        {medication?.value}
                      </MenuItem>
                    );
                  })}
                {/* <MenuItem value="23">Augmentin Drops</MenuItem>
                <MenuItem value="24">Avodart Capsules</MenuItem>
                <MenuItem value="25">Betnovate N Ointment</MenuItem>
                <MenuItem value="26">Calpol Tablets</MenuItem> */}
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
                {getAllLookup?.data?.data
                  ?.filter((item) => item?.type === "MedicineDose")
                  ?.map((medication, index) => {
                    return (
                      <MenuItem key={index} value={medication?.lookupId}>
                        {medication?.value}
                      </MenuItem>
                    );
                  })}
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
                {getAllLookup?.data?.data
                  ?.filter((item) => item?.type === "MedicineFrequency")
                  ?.map((medication, index) => {
                    return (
                      <MenuItem key={index} value={medication?.lookupId}>
                        {medication?.value}
                      </MenuItem>
                    );
                  })}
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
            {/* <StyledOutlineBtn
                  variant="contain"
                  bg="#FFFFFF"
                  color="#348AF4"
                  height="45px"
                  radius="12px"
                  startIcon={<AddIcon />}
                  sx={{ margin: "0px 10px" }}
                >
                  Add Medicine
                </StyledOutlineBtn> */}
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
        {/* <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              boxSizing="border-box"
              style={{ background: "#F9FAFC", padding: "8px 14px" }}
            >
              <MuiTypography variant="h6" component="h6" fontWeight="500">
                Blood Presure
              </MuiTypography>
              <div className="d-flex justify-content-end">
                <Button
                  variant="contain"
                  bg="none"
                  color="#666666"
                  height="45px"
                  startIcon={<DeleteOutlinedIcon />}
                  radius="12px"
                  className="me-2"
                  style={{ marginRight: "10px" }}
                  onClick={() => {
                    setDeleteModal(true);
                    setAnchorElUser(null);
                  }}
                >
                  Delete
                </Button>
                <Button
                  variant="contain"
                  bg="none"
                  color="#666666"
                  height="45px"
                  startIcon={<EditOutlinedIcon />}
                  radius="12px"
                >
                  Edit
                </Button>
              </div>
            </Box> */}
        {/* {getMedications?.isLoading && <BeatLoader/>} */}
        {getMedications?.isSuccess && (
          <Table
            columns={columns}
            data={getMedications?.data?.data || []}
            enableRowSelection={false}
            enableRowActions={false}
          />
        )}
      </div>
    </GenericModal>
  );
};

export default MedicationModal;
