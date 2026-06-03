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
const SurgicalHistoryModal = ({
  open,
  handleClose,
  GetAllSurgicalHistory,
  surgicalHistoryData,
  columns,
}) => {
  const dispatch = useDispatch();
  const [
    surgicalHistoryAddOrUpdate,
    { data, isLoading, isError, error, isSuccess },
  ] = useSurgicalHistoryAddOrUpdateMutation();
  const getAllLookup = useGetAllDropdownsQuery();
  const initialValues = {
    year: "" || surgicalHistoryData?.surgeryYear,
    reason: "" || surgicalHistoryData?.surgeryReason,
    surgery: "" || surgicalHistoryData?.surgeryTypeId,
  };
  const onSubmit = async (values) => {
    const session = await getSession();
    try {
      let finalPayload = {
        surgicalHistoryId: surgicalHistoryData
          ? surgicalHistoryData?.surgicalHistoryId
          : 0,
        surgeryTypeId: values?.surgery,
        surgeryYear: values.year,
        surgeryReason: values?.reason,
        patientId: session?.user?.user?.userId,
      };
      const resp = await surgicalHistoryAddOrUpdate(finalPayload).unwrap();
      if (resp?.succeeded === true) {
        dispatch(
          onSuccess({
            message: surgicalHistoryData
              ? "Record Updated Successfully"
              : "Record Saved Successfully",
          })
        );
        handleClose();
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
    year: Yup.string()
      .required("Field is Required!")
      .matches(/^\d{4}$/, "Year must be a 4-digit number"),
    reason: Yup.string().required("Field is Required!"),
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
                MenuProps={{
                  style: {
                    maxHeight: 350,
                  },
                }}
              >
                {getAllLookup?.data?.data
                  ?.filter((item) => item?.type === "SurgeryType")
                  ?.map((lookupItem, index) => (
                    <MenuItem key={index} value={lookupItem?.lookupId}>
                      {lookupItem?.value}
                    </MenuItem>
                  ))}
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
                {isLoading ? (
                  <BeatLoader color="#fff" size="10px" />
                ) : surgicalHistoryData ? (
                  "Update"
                ) : (
                  "Save"
                )}
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
    </GenericModal>
  );
};

export default SurgicalHistoryModal;
