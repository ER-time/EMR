import React from "react";
import * as Yup from "yup";
import Table from "@/components/core/Table";
import { Button } from "@/components";
import { Box, Grid, MenuItem, Select } from "@mui/material";
import InputField from "@/components/core/Input";
import MuiTypography from "@/components/core/Typography";
import { GenericModal } from "@/components";
import { useFormik } from "formik";
import { useGetAllPreExistingConditionQuery, usePreExistingConditionAddOrUpdateMutation, useSurgicalHistoryAddOrUpdateMutation } from "@/redux/slices/userProfile";
import { getSession } from "next-auth/react";
import MaterialReactTable from "material-react-table";
import styled from "styled-components";
import { useGetLookupByValueQuery } from "@/redux/slices/lookups";
import { useDispatch } from "react-redux";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";
import { BeatLoader } from "react-spinners";
import { useGetAllDropdownsQuery } from "@/redux/slices/user";
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
const AddPresExistingConditions = ({
  open,
  handleClose,
  GetAllSurgicalHistory,
  surgicalHistoryData,
  columns,
}) => {
  // const GetAllPreExistingCondition = useGetAllPreExistingConditionQuery({
  //   patientId: userId,
  // });
  const getAllLookup = useGetAllDropdownsQuery();
  getSession().then((session) => {
    setuserId(session?.user?.user?.userId);
  });
  const [
    preExistingConditionAddOrUpdate,
    { isLoading, isError, error, isSuccess },
  ] = usePreExistingConditionAddOrUpdateMutation();

  const initialValues = {
    diseaseType: "",
    year: "",
    month: "",
  };

  const onSubmit = async (values, { resetForm }) => {
    try {
      let finalPayload = {
        preExistingId: 0,
        diseaseTypeId: values.diseaseType,
        existingConditionDuration: values.year,
        patientId: userId,
      };
      const resp = await preExistingConditionAddOrUpdate(finalPayload).unwrap();
      if (resp?.succeeded === true) {
        handleClose();
        resetForm();
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
    diseaseType: Yup.string().required("Field is Required!"),
    year: Yup.string()
      .required("Field is Required!")
      .matches(/^\d{4}$/, "Year must be a 4-digit number"),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });
  return (
    <GenericModal
      show={open}
      onHide={handleClose}
      tittle="Add Surgical History"
    >
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="reaction"
                gutterBottom={true}
              >
                Disease
              </MuiTypography>
              <Select
                // value={10}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                label=""
                fullWidth={true}
                sx={INPUT_FIELD_STYLES.sx}
                {...formik.getFieldProps("diseaseType")}
                MenuProps={{
                  style: {
                    maxHeight: 300,
                    maxWidth: 300,
                  },
                }}
              >
                {getAllLookup?.data?.data
                  ?.filter((item) => item?.type === "DiseaseType")
                  ?.map((lookupItem, index) => (
                    <MenuItem key={index} value={lookupItem?.lookupId}>
                      {lookupItem?.value}
                    </MenuItem>
                  ))}
              </Select>
              {formik.touched.diseaseType && formik.errors.diseaseType ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.diseaseType}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="year"
                gutterBottom={true}
              >
                Year
              </MuiTypography>
              <InputField
                id="yearId"
                type="number"
                name="year"
                placeholder="2021"
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
 
    </GenericModal>
  );
};

export default AddPresExistingConditions;
