import React, { useState } from "react";
import * as Yup from "yup";
import Table from "@/components/core/Table";
import { Button } from "@/components";
import { Box, Grid, IconButton } from "@mui/material";
import InputField from "@/components/core/Input";
import MuiTypography from "@/components/core/Typography";
import { GenericModal } from "@/components";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";
import { BeatLoader } from "react-spinners";
import AddIcon from "@mui/icons-material/Add";

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

const DepartmentModal = ({
  open,
  handleClose,
  getMedications,
  columns,
  medicationRowData,
  getAllLookup,
}) => {
  const [arr, setArr] = useState([{ type: "text", id: 0, value: "" }]);
  const dispatch = useDispatch();

  const addInput = () => {
    formik.validateForm().then((errors) => {
      if (!errors.reason && arr.every((item) => item.value)) {
        setArr((s) => [...s, { type: "text", id: s.length, value: "" }]);
      } else {
        formik.setTouched({
          reason: true,
          ...arr.reduce((acc, item, index) => {
            acc[`speciality-${index}`] = true;
            return acc;
          }, {}),
        });
      }
    });
  };

  const handleChange = (e) => {
    e.preventDefault();
    const index = e.target.id;
    setArr((s) => {
      const newArr = s.slice();
      newArr[index].value = e.target.value;
      return newArr;
    });
  };

  const onSubmit = async (values, { resetForm }) => {
    const departmentData = {
      deptTitle: values.reason,
      speciality: arr.map((item) => ({ specTitle: item.value })),
    };
    console.log(departmentData);
    // Additional submit logic...
    resetForm();
    handleClose();
  };

  const initialValues = {
    reason: medicationRowData?.reason || "",
  };

  const validationSchema = Yup.object({
    reason: Yup.string().required("Field is Required!"),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  return (
    <GenericModal show={true} onHide={handleClose} title="Add Department">
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <Box width="100%">
              <MuiTypography {...INPUT_LABEL_PROPS} htmlFor="reason">
                Department Title <span style={{ color: "#e02828" }}>*</span>
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
                onBlur={formik.handleBlur}
              />
              {formik.touched.reason && formik.errors.reason ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.reason}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            {arr.map((item, i) => (
              <Box key={i} width="100%" mb={2}>
                <MuiTypography
                  {...INPUT_LABEL_PROPS}
                  htmlFor={`speciality-${i}`}
                >
                  Speciality Title <span style={{ color: "#e02828" }}>*</span>
                </MuiTypography>
                <InputField
                  type="text"
                  id={i.toString()}
                  placeholder="Type here"
                  name={`speciality-${i}`}
                  {...INPUT_FIELD_PROPS}
                  sx={INPUT_FIELD_STYLES.sx}
                  onChange={handleChange}
                  value={item.value}
                  onBlur={formik.handleBlur}
                />
                {formik.touched[`speciality-${i}`] && !item.value && (
                  <MuiTypography
                    variant="span"
                    component="span"
                    color="#E02828"
                  >
                    Field is Required!
                  </MuiTypography>
                )}
              </Box>
            ))}
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <IconButton
              onClick={addInput}
              color="primary"
              aria-label="add speciality"
            >
              <AddIcon sx={{ background: "red" }} />
            </IconButton>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Box display="flex" justifyContent="flex-end" mb="15px">
              <Button
                type="submit"
                variant="contain"
                bg="#E02828"
                color="#fff"
                height="45px"
                radius="12px"
              >
                {formik.isSubmitting ? (
                  <BeatLoader color="#fff" size="10px" />
                ) : (
                  "Save"
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
      <div style={{ border: "1px solid #F2F2F2" }}>
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

export default DepartmentModal;
