import { Grid, MenuItem, Select } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import MuiTypography from "@/components/core/Typography";
import { Box, Button, GenericModal } from "@/components";
import AddIcon from "@mui/icons-material/Add";
import InputField from "@/components/core/Input";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useGetAllPreExistingConditionQuery,
  usePreExistingConditionAddOrUpdateMutation,
} from "@/redux/slices/userProfile";
import { BeatLoader } from "react-spinners";
import { getSession } from "next-auth/react";
import { useGetLookupByValueQuery } from "@/redux/slices/lookups";
import { useDispatch } from "react-redux";

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

export default function PreExistingCondition({ appointmentData, hideAction }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [userId, setuserId] = useState(null);
  const dispatch = useDispatch();
  const GetAllPreExistingCondition = useGetAllPreExistingConditionQuery({
    patientId: appointmentData?.data?.patientId,
  });
  const diseaseLookups = useGetLookupByValueQuery("DiseaseType");
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

  const onSubmit = async (values) => {
    try {
      let finalPayload = {
        preExistingId: 0,
        diseaseTypeId: values.diseaseType,
        existingConditionDuration: values.year,
        patientId: appointmentData ? appointmentData?.data?.patientId : userId,
      };
      const resp = await preExistingConditionAddOrUpdate(finalPayload).unwrap();
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
    diseaseType: Yup.string().required("Field is Required!"),
    year: Yup.string().required("Field is Required!"),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  return (
    <>
      <Box display="flex" justifyContent="center" my="15px">
        <div>{GetAllPreExistingCondition?.isLoading && <BeatLoader />}</div>
      </Box>
      {!hideAction && (
        <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button
            variant={`${
              GetAllPreExistingCondition?.data?.data?.length > 0
                ? ""
                : "outlined"
            }`}
            height="45px"
            radius="12px"
            bg={`${
              GetAllPreExistingCondition?.data?.data?.length > 0
                ? "#E02828"
                : ""
            }`}
            sx={{
              margin: `${
                GetAllPreExistingCondition?.data?.data?.length > 0
                  ? "15px "
                  : "15px auto"
              }`,
            }}
            startIcon={
              GetAllPreExistingCondition?.data?.data?.length > 0 ? (
                ""
              ) : (
                <AddIcon />
              )
            }
            onClick={handleOpen}
          >
            Add Pre-Existing Condition
          </Button>
        </Box>
      )}

      <Grid container spacing={3}>
        {GetAllPreExistingCondition?.isSuccess && (
          <>
            {GetAllPreExistingCondition?.data?.data?.map(
              (conditionItem, index) => {
                return (
                  <Grid item xs={12} lg={6} key={index}>
                    <FiberManualRecordIcon
                      sx={{ fontSize: "10px", color: "#348AF4", mr: 1 }}
                    />
                    <MuiTypography
                      variant="subtitle1"
                      color="#333"
                      component="span"
                      fontWeight="300"
                    >
                      {conditionItem.diseaseTpye || "Cancer"}
                      <span style={{ color: "#666" }}>{`(${
                        conditionItem.existingConditionDuration || "2024"
                      })`}</span>
                    </MuiTypography>
                  </Grid>
                );
              }
            )}
          </>
        )}

        {open && (
          <GenericModal
            show={open}
            onHide={handleClose}
            tittle="Pre-Existing Condition"
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
                    >
                      {diseaseLookups?.data?.data?.map(
                        (diseaseLookup, index) => (
                          <MenuItem key={index} value={diseaseLookup?.lookupId}>
                            {diseaseLookup?.value}
                          </MenuItem>
                        )
                      )}
                    </Select>
                    {formik.touched.diseaseType && formik.errors.diseaseType ? (
                      <MuiTypography
                        variant="span"
                        component="span"
                        color="#E02828"
                      >
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
                      <MuiTypography
                        variant="span"
                        component="span"
                        color="#E02828"
                      >
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
            <div style={{ border: "1px solid #F2F2F2" }}>
              <Grid container spacing={3}>
                {GetAllPreExistingCondition?.isSuccess && (
                  <>
                    {GetAllPreExistingCondition?.data?.data?.map(
                      (conditionItem, index) => (
                        <Grid item xs={12} lg={6} key={index}>
                          <FiberManualRecordIcon
                            sx={{ fontSize: "10px", color: "#348AF4", mr: 1 }}
                          />
                          <MuiTypography
                            variant="subtitle1"
                            color="#333"
                            component="span"
                            fontWeight="300"
                          >
                            {conditionItem.diseaseTpye || "Cancer"}
                            <span style={{ color: "#666" }}>{`(${
                              conditionItem.existingConditionDuration || "2024"
                            })`}</span>
                          </MuiTypography>
                        </Grid>
                      )
                    )}
                  </>
                )}
              </Grid>
            </div>
          </GenericModal>
        )}
      </Grid>
    </>
  );
}
