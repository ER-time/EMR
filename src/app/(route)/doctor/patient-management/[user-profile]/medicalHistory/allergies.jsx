import { Box, Button, GenericModal } from "@/components";
import MaterialReactTable from "material-react-table";
import styled from "styled-components";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import MuiTypography from "@/components/core/Typography";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Grid, MenuItem, Select } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InputField from "@/components/core/Input";
import { useGetAllAllergiesHistoryQuery } from "@/redux/slices/userProfile";
import { usePathname } from "next/navigation";
import { Loader1, LoaderTable } from "@/components/core/Loader/Loader";

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

export default function Allergies() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const pathname = usePathname();
  const url = pathname.split("/");
  const patientId = url[url.length - 1];
  const allergiesData = useGetAllAllergiesHistoryQuery({
    patientId: patientId,
  });

  const initialValues = {
    reaction: "",
    reason: "",
  };

  const onSubmit = (values) => {
    console.log("Form Values", values);
  };

  const validationSchema = Yup.object({
    reaction: Yup.string().required("Field is Required!"),
    reason: Yup.string().required("Field is Required!"),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const columns = [
    {
      header: "Allergy From",
      accessorKey: "allergyFromType",
    },
    {
      header: "Reaction",
      accessorKey: "reaction",
    },
    {
      header: "Medication/Treatments",
      accessorKey: "medicationTreatment",
    },
  ];

  const data = [...Array(5)].map(() => ({
    allergyFrom: "Dust allergy",
    reaction: "Sneezing, coughing, teary eyes",
    medication: "Wear a mask while cleaning.",
  }));

  return (
    <>
      {/* <Box
        display="flex"
        justifyContent={data.length === 0 ? "center" : "flex-end"}
      >
        <Button
          variant="outlined"
          height="45px"
          radius="12px"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add {data.length > 0 && "More"} Allergies
        </Button>
      </Box> */}

      {allergiesData?.isLoading ? (
        <div>
          <Loader1 />
        </div>
      ) : (
        <StyledMaterialReactTable
          enableRowSelection={false}
          enableTopToolbar={false}
          enableColumnFilters={false}
          enableColumnActions={false}
          enablePagination={false}
          columns={columns}
          data={allergiesData?.data?.data || []}
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
        <GenericModal show={open} onHide={handleClose} tittle="Medical History">
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
                    value={10}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    label=""
                    fullWidth={true}
                    sx={INPUT_FIELD_STYLES.sx}
                  >
                    <MenuItem value={10}>Dust Allergy</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
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
                    placeholder="01"
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
                    htmlFor="reason"
                    gutterBottom={true}
                  >
                    Medication / Treatments
                  </MuiTypography>
                  <InputField
                    id="reason"
                    placeholder="Type here"
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
