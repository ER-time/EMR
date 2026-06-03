import { Grid, MenuItem, Select } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import MuiTypography from "@/components/core/Typography";
import { Box, Button, GenericModal } from "@/components";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import InputField from "@/components/core/Input";
import { useFormik } from "formik";
import * as Yup from "yup";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  useGetAllSocialHistoryQuery,
  useSocialHistoryAddOrUpdateMutation,
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
const INPUT_YEAR_FIELD_STYLES = {
  sx: {
    margin: "0px 0px",
    height: "46px",
    "& fieldset": { border: "1px solid #E2E5ED" },
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      WebkitAppearance: "none",
      margin: 0,
    },
    "& input[type=number]": {
      MozAppearance: "textfield",
    },
  },
};

export default function SocialHistory({ appointmentData, hideAction }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [userId, setuserId] = useState(null);
  const dispatch = useDispatch();
  const getAllLookup = useGetLookupByValueQuery("SocialAddictionType");
  const GetAllSocialHistory = useGetAllSocialHistoryQuery({
    patientId: appointmentData?.data?.patientId || undefined,
  });
  getSession().then((session) => {
    setuserId(session?.user?.user?.userId);
  });
  const [socialHistoryAddOrUpdate, { isLoading, isError, error, isSuccess }] =
    useSocialHistoryAddOrUpdateMutation();

  const initialValues = {
    addiction: "",
    year: "",
  };

  const onSubmit = async (values) => {
    try {
      let finalPayload = {
        socialHistoryId: 0,
        socialAddictionTypeId: values.addiction,
        duration: values.year,
        patientId: appointmentData ? appointmentData?.data?.patientId : userId,
      };
      const resp = await socialHistoryAddOrUpdate(finalPayload).unwrap();
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
    year: Yup.string().required("Field is Required!"),
    addiction: Yup.string().required("Field is Required!"),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  return (
    <>
      <Box display="flex" justifyContent="center" my="15px">
        <div>{GetAllSocialHistory?.isLoading && <BeatLoader />}</div>
      </Box>
      {!hideAction && (
        <Box
          display="flex"
          justifyContent={`${
            GetAllSocialHistory?.data?.data?.length > 0 ? "flex-end" : "center"
          }`}
          sx={{ mt: 2 }}
        >
          <Button
            variant={`${
              GetAllSocialHistory?.data?.data?.length > 0 ? "" : "outlined"
            }`}
            height="45px"
            radius="12px"
            bg={`${
              GetAllSocialHistory?.data?.data?.length > 0 ? "#E02828" : ""
            }`}
            sx={{
              margin: `${
                GetAllSocialHistory?.data?.data?.length > 0
                  ? "15px "
                  : "15px auto"
              }`,
            }}
            startIcon={
              GetAllSocialHistory?.data?.data?.length > 0 ? "" : <AddIcon />
            }
            onClick={handleOpen}
          >
            Add Family History
          </Button>
        </Box>
      )}

      <Grid container spacing={3}>
        {GetAllSocialHistory?.isSuccess && (
          <>
            {GetAllSocialHistory?.data?.data?.map((conditionItem, index) => (
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
                  {conditionItem.socialAddictionType}
                  <span style={{ color: "#666" }}>{`(${
                    conditionItem.duration || "2024"
                  })`}</span>
                </MuiTypography>
              </Grid>
            ))}
          </>
        )}

        {open && (
          <GenericModal
            show={open}
            onHide={handleClose}
            tittle="Social History"
          >
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box width="100%">
                    <MuiTypography
                      {...INPUT_LABEL_PROPS}
                      htmlFor="addiction"
                      gutterBottom={true}
                    >
                      Social Addiction
                    </MuiTypography>
                    <Select
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      label=""
                      fullWidth={true}
                      sx={INPUT_FIELD_STYLES.sx}
                      {...formik.getFieldProps("addiction")}
                    >
                      {getAllLookup?.data?.data?.map((diseases, index) => (
                        <MenuItem key={index} value={diseases?.lookupId}>
                          {diseases?.value}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.addiction && formik.errors.addiction ? (
                      <MuiTypography
                        variant="span"
                        component="span"
                        color="#E02828"
                      >
                        {formik.errors.addiction}
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
                      sx={INPUT_YEAR_FIELD_STYLES.sx}
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
                <Box display="flex" justifyContent="flex-end" my="15px">
                  {/* <Button
                    variant="outlined"
                    height="45px"
                    radius="12px"
                    sx={{ mr: 1 }}
                    startIcon={<AddIcon />}
                  >
                    Add Medicine
                  </Button> */}
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
                  Allergy
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
              <Grid container spacing={3}>
                {GetAllSocialHistory?.isSuccess && (
                  <>
                    {GetAllSocialHistory?.data?.data?.map(
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
                            {conditionItem.socialAddictionType}
                            <span style={{ color: "#666" }}>{`(${
                              conditionItem.duration || "2024"
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
