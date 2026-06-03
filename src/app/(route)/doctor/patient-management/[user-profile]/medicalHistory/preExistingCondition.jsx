import { Grid, MenuItem, Select } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import MuiTypography from "@/components/core/Typography";
import { Box, Button, GenericModal } from "@/components";
import AddIcon from "@mui/icons-material/Add";
import InputField from "@/components/core/Input";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useGetAllPreExistingConditionQuery } from "@/redux/slices/userProfile";
import { usePathname } from "next/navigation";
import { BeatLoader } from "react-spinners";

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

export default function PreExistingCondition() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const pathname = usePathname();
  const url = pathname.split("/");
  const patientId = url[url.length - 1];
  const GetAllPreExistingCondition = useGetAllPreExistingConditionQuery({
    patientId: patientId,
  });

  const initialValues = {
    year: "",
    month: "",
  };

  const onSubmit = (values) => {
    console.log("Form Values", values);
  };

  const validationSchema = Yup.object({
    year: Yup.string().required("Field is Required!"),
    month: Yup.string().required("Field is Required!"),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const PRE_EXISTING_CONDITION = [
    {
      name: "Asthma",
      duration: "2 yr",
    },
    {
      name: "Diabetes",
      duration: "1yr 5 mo",
    },
    {
      name: "Hypertention ",
      duration: "10 mo",
    },
  ];
  console.log("GetAllPreExistingCondition",GetAllPreExistingCondition);
  return (
    <Grid container spacing={3}>
      <>
        {/* <Box
          display="flex"
          justifyContent={
            PRE_EXISTING_CONDITION.length === 0 ? "center" : "flex-end"
          }
          sx={{ mt: 2 }}
        >
          <Button
            variant="outlined"
            height="45px"
            radius="12px"
            sx={{ margin: "15px 0px" }}
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Add {PRE_EXISTING_CONDITION.length > 0 && "More"} Pre-Existing
            Condition
          </Button>
        </Box> */}
        <Box display="flex" justifyContent="center" my="15px">
          <div>{GetAllPreExistingCondition?.isLoading && <BeatLoader />}</div>
        </Box>

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
      </>

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
                    value={10}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    label=""
                    fullWidth={true}
                    sx={INPUT_FIELD_STYLES.sx}
                  >
                    <MenuItem value={10}>Asthama</MenuItem>
                    <MenuItem value={20}>Diabetes</MenuItem>
                    <MenuItem value={30}>Hypertention </MenuItem>
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
                    Year
                  </MuiTypography>
                  <InputField
                    id="yearId"
                    type="text"
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

              <Grid item xs={12} md={12} lg={4}>
                <Box width="100%">
                  <MuiTypography
                    {...INPUT_LABEL_PROPS}
                    htmlFor="month"
                    gutterBottom={true}
                  >
                    Month
                  </MuiTypography>
                  <InputField
                    id="monthId"
                    placeholder="September"
                    type="text"
                    name="month"
                    {...INPUT_FIELD_PROPS}
                    sx={INPUT_FIELD_STYLES.sx}
                    {...formik.getFieldProps("month")}
                  />
                  {formik.touched.month && formik.errors.month ? (
                    <MuiTypography
                      variant="span"
                      component="span"
                      color="#E02828"
                    >
                      {formik.errors.month}
                    </MuiTypography>
                  ) : null}
                </Box>
              </Grid>

              <Box display="flex" justifyContent="flex-end" my="15px">
                <Button
                  variant="outlined"
                  height="45px"
                  radius="12px"
                  sx={{ mr: 1 }}
                  startIcon={<AddIcon />}
                >
                  Add Medicine
                </Button>
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
            </Box>
            <Grid container spacing={3}>
              {PRE_EXISTING_CONDITION.map((conditionItem, index) => (
                <Grid item xs={12} lg={6} key={index}>
                  <FiberManualRecordIcon
                    sx={{ fontSize: "10px", color: "#348AF4", mx: 2 }}
                  />
                  <MuiTypography
                    variant="subtitle1"
                    color="#333"
                    component="span"
                    fontWeight="300"
                  >
                    {conditionItem.name}
                    <span
                      style={{ color: "#666" }}
                    >{`(From - ${conditionItem.duration})`}</span>
                  </MuiTypography>
                </Grid>
              ))}
            </Grid>
          </div>
        </GenericModal>
      )}
    </Grid>
  );
}
