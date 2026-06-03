import React from "react";
import * as Yup from "yup";
import Table from "@/components/core/Table";
import { Button } from "@/components";
import { Box, Grid, MenuItem, Select } from "@mui/material";
import InputField from "@/components/core/Input";
import MuiTypography from "@/components/core/Typography";
import { GenericModal } from "@/components";
import { useFormik } from "formik";
import { useFamilyHistoryAddOrUpdateMutation } from "@/redux/slices/userProfile";
import { getSession } from "next-auth/react";
import MaterialReactTable from "material-react-table";
import styled from "styled-components";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";
import { useGetLookupByValueQuery } from "@/redux/slices/lookups";
import { useDispatch } from "react-redux";
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
const AddFamilyHistoryModal = ({
  open,
  handleClose,
  GetAllMedicalHistory,
  columns,
  familyHistoryId,
  rowData,
}) => {
  const dispatch = useDispatch();
  const getAllLookup = useGetAllDropdownsQuery()
  const [familyHistoryAddOrUpdate, { isLoading, isError, error, isSuccess }] =
    useFamilyHistoryAddOrUpdateMutation();

  const initialValues = {
    familyMember: rowData?.familyMemberTypeId || "",
    age: rowData?.age || "",
    diseases: rowData?.diseases || "",
  };

  const onSubmit = async (values) => {
    const session = await getSession();
    try {
      let finalPayload = {
        familyHistoryId: familyHistoryId ? familyHistoryId : 0,
        familyMemberTypeId: values.familyMember,
        age: values.age,
        diseases: values.diseases,
        patientId: session?.user?.user?.userId,
      };
      const resp = await familyHistoryAddOrUpdate(finalPayload).unwrap();
      if (resp?.data?.succeeded === true) {
        handleClose();
        dispatch(
          onSuccess({
            message: resp?.data?.message || "Success",
          })
        );
      } else {
        dispatch(
          onFailure({
            message: resp?.data?.message || "Failure",
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
    familyMember: Yup.string().required("Field is Required!"),
    age: Yup.number().required("Field is Required!"),
    diseases: Yup.string().required("Field is Required!"),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });
  return (
    <GenericModal show={open} onHide={handleClose} tittle="Family History">
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="familyMember"
                gutterBottom={true}
              >
                Family Member
              </MuiTypography>
              <Select
                // value={10}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                label=""
                fullWidth={true}
                sx={INPUT_FIELD_STYLES.sx}
                {...formik.getFieldProps("familyMember")}
                MenuProps={{
                  style: {
                     maxHeight: 350},
                  }}
              >
                {getAllLookup?.data?.data
              ?.filter((item) => item?.type === "FamilyRelation")
              ?.map((lookupItem, index) => (
                  <MenuItem key={index} value={lookupItem?.lookupId}>
                    {lookupItem?.value}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.familyMember && formik.errors.familyMember ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.familyMember}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="age"
                gutterBottom={true}
              >
                Age
              </MuiTypography>
              <InputField
                id="ageId"
                type="number"
                name="age"
                placeholder="58yr"
                {...INPUT_FIELD_PROPS}
                sx={INPUT_FIELD_STYLES.sx}
                {...formik.getFieldProps("age")}
              />
              {formik.touched.age && formik.errors.age ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.age}
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
                Diseases
              </MuiTypography>
              <InputField
                id="diseasesId"
                placeholder="Diabetes, Cholesterol, High Blood Pressure,"
                type="text"
                name="diseases"
                {...INPUT_FIELD_PROPS}
                sx={INPUT_FIELD_STYLES.sx}
                {...formik.getFieldProps("diseases")}
              />
              {formik.touched.diseases && formik.errors.diseases ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.diseases}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>
          <Grid item xs={12} md={12}>
            <Box display="flex" justifyContent="flex-end" my="15px">
              <Button
                type="submit"
                variant="contain"
                bg="#E02828"
                color="#fff"
                height="45px"
                radius="12px"
              >
               {isLoading ? <BeatLoader color="#fff" size="10px" /> :"Save"} 
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
      <div style={{ border: "1px solid #F2F2F2" }}>
        {GetAllMedicalHistory?.isSuccess && (
          <StyledMaterialReactTable
            enableRowSelection={false}
            enableTopToolbar={false}
            enableColumnFilters={false}
            enableColumnActions={false}
            enablePagination={false}
            columns={columns}
            data={GetAllMedicalHistory?.data?.data || []}
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

export default AddFamilyHistoryModal;
