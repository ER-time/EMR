import { Box, Button, GenericModal } from "@/components";
import MaterialReactTable from "material-react-table";
import styled from "styled-components";
import { Grid, MenuItem, Select } from "@mui/material";
import MuiTypography from "@/components/core/Typography";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import InputField from "@/components/core/Input";
import { useFormik } from "formik";
import * as Yup from "yup";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useGetAllSurgicalHistoryQuery } from "@/redux/slices/userProfile";
import { usePathname } from "next/navigation";
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

export default function SurgicalHistory() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const pathname = usePathname();
  const url = pathname.split("/");
  const patientId = url[url.length - 1];
  const GetAllSurgicalHistory = useGetAllSurgicalHistoryQuery({
    patientId:
      patientId
  });

  const initialValues = {
    age: "",
    reason: "",
  };

  const onSubmit = (values) => {
    console.log("Form Values", values);
  };

  const validationSchema = Yup.object({
    age: Yup.string().required("Field is Required!"),
    reason: Yup.string().required("Field is Required!"),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });
  return (
    <>
      {/* <Box
        display="flex"
        justifyContent={data.length === 0 ? "center" : "flex-end"}
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
          Add {data.length > 0 && "More"} Surgical History
        </Button>
      </Box> */}
       <Box display="flex" justifyContent="center" my="15px">
        <div>{GetAllSurgicalHistory?.isLoading && <BeatLoader />}</div>
      </Box>

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
      {open && (
        <GenericModal
          show={open}
          onHide={handleClose}
          tittle="Surgical History"
        >
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box width="100%">
                  <MuiTypography
                    {...INPUT_LABEL_PROPS}
                    htmlFor="familyMember"
                    gutterBottom={true}
                  >
                    Surgery
                  </MuiTypography>
                  <Select
                    value={10}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    label=""
                    fullWidth={true}
                    sx={INPUT_FIELD_STYLES.sx}
                  >
                    <MenuItem value={10}>Father</MenuItem>
                    <MenuItem value={20}>Mother</MenuItem>
                    <MenuItem value={30}>Brother </MenuItem>
                  </Select>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box width="100%">
                  <MuiTypography
                    {...INPUT_LABEL_PROPS}
                    htmlFor="age"
                    gutterBottom={true}
                  >
                    Surgery Age
                  </MuiTypography>
                  <InputField
                    id="ageId"
                    type="text"
                    name="age"
                    placeholder="58yr"
                    {...INPUT_FIELD_PROPS}
                    sx={INPUT_FIELD_STYLES.sx}
                    {...formik.getFieldProps("age")}
                  />
                  {formik.touched.age && formik.errors.age ? (
                    <MuiTypography
                      variant="span"
                      component="span"
                      color="#E02828"
                    >
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
                    <MuiTypography
                      variant="span"
                      component="span"
                      color="#E02828"
                    >
                      {formik.errors.reason}
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
                Surgical History
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
            <StyledMaterialReactTable
              enableRowSelection={false}
              enableTopToolbar={false}
              enableColumnFilters={false}
              enableColumnActions={false}
              enablePagination={false}
              columns={columns}
              data={data}
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
        </GenericModal>
      )}
    </>
  );
}

const columns = [
  {
    header: "Surgery",
    accessorKey: "surgeryType",
  },
  {
    header: "Surgery Year",
    accessorKey: "surgeryYear",
  },
  {
    header: "Surgery Reason",
    accessorKey: "surgeryReason",
  },
];

const data = [...Array(3)].map(() => ({
  surgery: "Cardio Vascular",
  year: "2020",
  reason: "Having blood clot into the vein traveling towards my heart.",
}));
