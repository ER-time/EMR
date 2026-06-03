import { Box, Button, GenericModal } from "@/components";
import InputField from "@/components/core/Input";
import MuiTypography from "@/components/core/Typography";
import { Grid } from "@mui/material";
import { getSession } from "next-auth/react";
import { AiOutlineClose } from "react-icons/ai";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { useState } from "react";
import styled from "styled-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSoapNotesAddOrUpdateMutation } from "@/redux/slices/userProfile";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
const StyledLabel = styled.label`
  && {
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    border-top: 0px;
  }
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  flex-wrap: wrap;
`;

export default function AddSoapNotesModal({ soapNoteId, open, handleClose }) {
  const params = useParams();
  const dispatch = useDispatch();
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
  const [SoapNotesAddOrUpdate, { isLoading, isError, error, isSuccess }] =
    useSoapNotesAddOrUpdateMutation();
  const initialValues = {
    subjective: "",
    objective: "",
  };
  const onSubmit = async (values) => {
    try {
      let finalPayload = {
        soapNoteId: soapNoteId ? soapNoteId : 0,
        appointmentId: params?.appointment || 1,
        subjective: values.subjective,
        objective: values.objective,
        assessment: "N/A",
        plan: "N/A",
      };
      const resp = await SoapNotesAddOrUpdate(finalPayload).unwrap();
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
    subjective: Yup.string().required("Field is Required!"),
    objective: Yup.string().required("Field is Required!"),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [userId, setuserId] = useState(null);
  getSession().then((session) => {
    setuserId(session?.user?.user?.roleId);
  });
  const handleFileChange = (event) => {
    const files = event.target.files;
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    setSelectedFiles([...selectedFiles, ...droppedFiles]);
  };
  const handleRemoveFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };
  return (
    <GenericModal show={open} onHide={handleClose} tittle="Add Soap Notes">
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="subjective"
                gutterBottom={true}
              >
                Subjective
              </MuiTypography>
              <InputField
                id="subjective"
                name="subjective"
                placeholder="subjective"
                {...INPUT_FIELD_PROPS}
                sx={INPUT_FIELD_STYLES.sx}
                {...formik.getFieldProps("subjective")}
              />
              {formik.touched.subjective && formik.errors.subjective ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.subjective}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="objective"
                gutterBottom={true}
              >
                Objective
              </MuiTypography>
              <InputField
                id="objective"
                name="objective"
                placeholder="objective"
                {...INPUT_FIELD_PROPS}
                sx={INPUT_FIELD_STYLES.sx}
                {...formik.getFieldProps("objective")}
                style={{
                  borderBottomRightRadius: "0px",
                  borderBottomLeftRadius: "0px",
                }}
              />
              {formik.touched.objective && formik.errors.objective ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.objective}
                </MuiTypography>
              ) : null}
            </Box>
            <Grid item xs={12}>
              <Box sx={{ background: "#F2F2F2" }}>
                <StyledLabel
                  htmlFor="patient-pic"
                  className="text-center w-100"
                >
                  <FileUploadOutlinedIcon
                    sx={{ color: "#4A4A4A", marginRight: "10px" }}
                  />
                  <p style={{ margin: "0px", fontSize: "14px" }}>
                    <span style={{ fontWeight: "500" }}>
                      Click to upload image
                    </span>
                    {/* <span className="text-black fs-6"> or drag and drop</span> */}
                  </p>
                </StyledLabel>

                <input
                  size="small"
                  type="file"
                  id="patient-pic"
                  name="patient-pic"
                  accept="image/png, image/jpeg, application/pdf"
                  multiple
                  onChange={handleFileChange}
                  onDrop={handleFileDrop}
                  onDragOver={(e) => e.preventDefault()}
                  style={{ display: "none" }}
                />
              </Box>
              {selectedFiles.map((file, index) => (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ pb: 1 }}
                  key={file.index}
                >
                  <MuiTypography {...INPUT_LABEL_PROPS}>
                    {file.name}
                  </MuiTypography>
                  <AiOutlineClose
                    size={18}
                    onClick={() => handleRemoveFile(file.index)}
                  />
                </Box>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="assessment"
                gutterBottom={true}
              >
                Assessment
              </MuiTypography>
              <InputField
                id="assessment"
                disabled={userId == 3 ? true : false}
                placeholder="Assessment"
                {...INPUT_FIELD_PROPS}
                sx={INPUT_FIELD_STYLES.sx}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="plan"
                gutterBottom={true}
              >
                Plan
              </MuiTypography>
              <InputField
                id="plan"
                disabled={userId == 3 ? true : false}
                type="textArea"
                placeholder=" Plan"
                {...INPUT_FIELD_PROPS}
                sx={INPUT_FIELD_STYLES.sx}
              />
            </Box>
          </Grid>
          <Box display="flex" justifyContent="flex-end" my="15px">
            <Button
              variant="contain"
              bg="#E02828"
              color="#fff"
              height="45px"
              radius="12px"
              type="submit"
            >
              Save
            </Button>
          </Box>
        </Grid>
      </form>
    </GenericModal>
  );
}
