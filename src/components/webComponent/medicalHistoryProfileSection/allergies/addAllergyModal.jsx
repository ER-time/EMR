import React, { useEffect } from "react";
import * as Yup from "yup";
import Table from "@/components/core/Table";
import { Button } from "@/components";
import { Box, Grid, MenuItem, Select } from "@mui/material";
import InputField from "@/components/core/Input";
import MuiTypography from "@/components/core/Typography";
import { GenericModal } from "@/components";
import { useFormik } from "formik";
import { useState } from "react";
import { getSession, useSession } from "next-auth/react";
import MaterialReactTable from "material-react-table";
import styled from "styled-components";
import { useGetLookupByValueQuery } from "@/redux/slices/lookups";
import { Loader1 } from "@/components/core/Loader/Loader";
import useSWR, { mutate } from "swr";
import { API_END_POINTS } from "@/config";
import { useDispatch } from "react-redux";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";
import { useGetAllDropdownsQuery } from "@/redux/slices/user";
import { useAllergiesAddOrUpdateMutation } from "@/redux/slices/userProfile";
import { BeatLoader } from "react-spinners";
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

const AddAllergyModal = ({
  open,
  handleClose,
  allAllergies,
  columns,
  rowData,
}) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  // const allergiesTypes = useGetLookupByValueQuery("AllergyTypes");
  const [
    addOrUpdateAllergies,
    { data: AllergiesData, isLoading: AllergiesDataLaoding },
  ] = useAllergiesAddOrUpdateMutation();
  const getAllLookup = useGetAllDropdownsQuery();
  const initialValues = {
    allergyType: rowData?.allergyFromTypeId || "",
    reaction: rowData?.reaction || "",
    medicationTreatment: rowData?.medicationTreatment || "",
  };
  useEffect(() => {
    formik.setFieldValue("allergyType", rowData?.allergyFromTypeId);
  }, [rowData]);

  const onSubmit = async (values, { resetForm }) => {
    const session = await getSession();

    let finalPayload = {
      medicalHistoryId: rowData?.medicalHistoryId || 0,
      allergyFromTypeId: values?.allergyType,
      reaction: values.reaction,
      medicationTreatment: values.medicationTreatment,
      patientId: session?.user?.user?.userId,
    };
    setIsLoading(true);
    try {
      const resp = await addOrUpdateAllergies(
        finalPayload,
        session?.user?.user?.token
      );
      if (resp?.data?.succeeded === true) {
        handleClose();
        dispatch(
          onSuccess({
            message: resp?.data?.message || "Success",
          })
        );

        mutate(`${API_END_POINTS.GET_ALL_MEDICAL_HISTORY}`);
        resetForm();
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      dispatch(
        onFailure({
          message: resp?.data?.message || "Failure",
        })
      );
    }
  };

  const validationSchema = Yup.object({
    allergyType: Yup.string().required("Field is Required!"),
    reaction: Yup.string().required("Field is Required!"),
    medicationTreatment: Yup.string().required("Field is Required!"),
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
      tittle="Add Allergies History"
    >
      {getAllLookup.isLoading ? (
        <Loader1 />
      ) : (
        <>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box width="100%">
                  <MuiTypography
                    {...INPUT_LABEL_PROPS}
                    htmlFor="reaction"
                    gutterBottom={true}
                  >
                    Allergy From
                  </MuiTypography>
                  <Select
                    name="allergyType"
                    // value={formik.values.allergyType}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    label=""
                    fullWidth={true}
                    sx={INPUT_FIELD_STYLES.sx}
                    {...formik.getFieldProps("allergyType")}
                  >
                    {getAllLookup?.data?.data
                      ?.filter((item) => item?.type === "AllergyTypes")
                      ?.map((allergyItem, index) => {
                        return (
                          <MenuItem key={index} value={allergyItem?.lookupId}>
                            {allergyItem?.value}
                          </MenuItem>
                        );
                      })}
                  </Select>
                  {formik.touched.allergyType && formik.errors.allergyType ? (
                    <MuiTypography
                      variant="span"
                      component="span"
                      color="#E02828"
                    >
                      {formik.errors.allergyType}
                    </MuiTypography>
                  ) : null}
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box width="100%">
                  <MuiTypography
                    {...INPUT_LABEL_PROPS}
                    htmlFor="reaction"
                    gutterBottom={true}
                  >
                    Reaction
                  </MuiTypography>
                  <InputField
                    id="reactionId"
                    type="text"
                    name="reaction"
                    placeholder="reaction"
                    {...INPUT_FIELD_PROPS}
                    sx={INPUT_FIELD_STYLES.sx}
                    {...formik.getFieldProps("reaction")}
                  />
                  {formik.touched.reaction && formik.errors.reaction ? (
                    <MuiTypography
                      variant="span"
                      component="span"
                      color="#E02828"
                    >
                      {formik.errors.reaction}
                    </MuiTypography>
                  ) : null}
                </Box>
              </Grid>

              <Grid item xs={12} md={12} lg={12}>
                <Box width="100%">
                  <MuiTypography
                    {...INPUT_LABEL_PROPS}
                    htmlFor="medicationTreatment"
                    gutterBottom={true}
                  >
                    Medication / Treatments
                  </MuiTypography>
                  <InputField
                    id="medicationTreatment"
                    placeholder="Type here"
                    type="text"
                    name="medicationTreatment"
                    {...INPUT_FIELD_PROPS}
                    sx={INPUT_FIELD_STYLES.sx}
                    {...formik.getFieldProps("medicationTreatment")}
                  />
                  {formik.touched.medicationTreatment &&
                  formik.errors.medicationTreatment ? (
                    <MuiTypography
                      variant="span"
                      component="span"
                      color="#E02828"
                    >
                      {formik.errors.medicationTreatment}
                    </MuiTypography>
                  ) : null}
                </Box>
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <Box display="flex" justifyContent="flex-end" my="15px">
                  {isLoading ? (
                    <Loader1 />
                  ) : (
                    <Button
                      type="submit"
                      variant="contain"
                      bg="#E02828"
                      color="#fff"
                      height="45px"
                      radius="12px"
                    >
                      {AllergiesDataLaoding ? (
                        <BeatLoader color="#fff" size="10px" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </form>
          <div style={{ border: "1px solid #F2F2F2" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              boxSizing="border-box"
              style={{ background: "#F9FAFC", padding: "8px 14px" }}
            >
              <MuiTypography variant="h6" component="h6" fontWeight="500">
                Allergy
              </MuiTypography>
            </Box>
            <StyledMaterialReactTable
              enableRowSelection={false}
              enableTopToolbar={false}
              enableColumnFilters={false}
              enableColumnActions={false}
              enablePagination={false}
              columns={columns}
              data={allAllergies || []}
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
          </div>
        </>
      )}
    </GenericModal>
  );
};

export default AddAllergyModal;
