"use client";
import { useEffect, useState } from "react";
import { ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import { Avatar, Grid, InputAdornment, MenuItem, Select } from "@mui/material";
import styled from "styled-components";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { AiOutlineClose } from "react-icons/ai";
import dayjs from "dayjs";
import UploadIcon from "@mui/icons-material/Upload";
import { Box } from "@/components/core";
import MuiTypography from "@/components/core/Typography";
import { Button } from "@/components";
import PhoneInputCompo from "@/components/core/PhoneInput";
import InputField from "@/components/core/Input";
import DatePicker from "@/components/core/DatePicker";
import { useSession } from "next-auth/react";
import {
  useGetAllUsersMutation,
  useUpdateUserByIdMutation,
  useUploadImageMutation,
} from "@/redux/slices/userProfile";
import { Loader1 } from "@/components/core/Loader/Loader";
import { GENDER_OPTIONS, USER_ROLE } from "@/config";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";
import { useDispatch } from "react-redux";
import moment from "moment";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useRouter } from "next/navigation";

const StyledLabel = styled.label`
  border: 2px dashed #a1a1a1;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  flex-wrap: wrap;
`;

const INPUT_FIELD_STYLES = {
  sx: {
    margin: "0px 0px",
    height: "50px",
    "& fieldset": { border: "1px solid #E2E5ED" },
  },
};
const INPUT_NUMBER_FIELD_STYLE = {
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

const PatientProfile = () => {
  const session = useSession();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [
    uploadImage,
    { data: uploadImageData, isLoading: uploadImageLoading },
  ] = useUploadImageMutation();
  const [imageURl, setImageUrl] = useState(null);

  const [
    getAllUsers,
    { data: allUsersData, isLoading, isError, isSuccess, error },
  ] = useGetAllUsersMutation();

  useEffect(() => {
    setImageUrl(null);
  }, [router]);
  useEffect(() => {
    const payload = {
      userId: session.data?.user?.user?.userId,
      userRoleId: session?.data?.user?.user?.roleId,
    };
    getAllUsers(payload);
  }, [session]);
  const [updateUserById, { isLoading: updateUserLoading }] =
    useUpdateUserByIdMutation();

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    address: "",
    phoneNo: "",
    genderId: 11,
    height: "",
    weight: "",
  };

  const onSubmit = async (values) => {
    try {
      let finalPayload = {
        userId: session?.data?.user?.user?.userId,
        roleId: USER_ROLE?.patient,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        dateOfBirth: moment(values.dob).local().toISOString(),
        genderId: values.genderId,
        phoneNumber: values.phoneNo,
        address: values.address,
        height: values.height,
        weight: values.weight,
        profilePicture: imageURl
          ? imageURl?.keyName
          : allUsersData?.data?.[0]?.profileImage,
        // doctorDocumentList: uploadedImages.map((imageUrl) => {
        //   return {
        //     documentURL: imageUrl?.data?.keyName,
        //   };
        // }),
      };

      const resp = await updateUserById(finalPayload).unwrap();
      console.log("resp::::", resp);
      if (resp?.succeeded === true) {
        let sessionPayload = {
          address: values.address,
          dob: moment(values.dob).local().toISOString(),
          email: values.email,
          genderId: values.genderId,
          name: `${values.firstName} ${values.lastName}`,
          phoneNumber: values.phoneNo,
          userId: session?.data?.user?.user?.userId,
          role: "Patient",
          roleId: USER_ROLE.patient,
          profilePictureKey: imageURl?.keyName,
          profilePicture: imageURl?.baseUrl,
          // roleTypeId: 0,
          // token:
          //   "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiI0NSIsIk5hbWUiOiJRdWluY3kgUG9vbGUiLCJSb2xlSWQiOiIzIiwiRW1haWwiOiJhbGlwYXRAZ2V0bmFkYS5jb20iLCJuYmYiOjE3MTU3NTMzNzgsImV4cCI6MTcxNTgzOTc3OCwiaWF0IjoxNzE1NzUzMzc4fQ.ixNXnuE4QXh-BVfIyxpouk-EMgJTx_DGhxOBrdYA0wQnDUXodRULwjUtJFPkeHRKwwUUleOPNT8WfXidgmYHiA",
        };

        //update session
        const updatedSessionData = {
          ...session.data.user,
          user: {
            ...session.data.user.user,
            ...sessionPayload,
          },
        };
        const result = await session.update({ data: updatedSessionData });
        try {
          const result = await session.update({ data: updatedSessionData });
          if (!result?.error) {
            router.reload(); // Revalidate session data by reloading the page
          }
        } catch (error) {
          console.error("Error updating session:", error);
        }

        console.log("result", result);
        dispatch(
          onSuccess({
            message: "Profile Updated Successfully" || "Success",
          })
        );
        onCancel();
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
  // const renderImagePreview = (file) => {
  //   return URL.createObjectURL(file);
  // };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Field is Required!"),
    lastName: Yup.string().required("Field is Required!"),
    dob: Yup.string().required("Field is Required!"),
    genderId: Yup.string().required("Field is Required!"),
    phoneNo: Yup.string().required("Field is Required!"),
    address: Yup.string().required("Field is Required!"),
    height: Yup.string().required("Field is Required!"),
    weight: Yup.string().required("Field is Required!"),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  useEffect(() => {
    if (allUsersData) {
      formik.setFieldValue(
        "firstName",
        allUsersData?.data?.[0]?.firstName || ""
      );
      formik.setFieldValue("lastName", allUsersData?.data?.[0]?.lastName || "");
      formik.setFieldValue("email", allUsersData?.data?.[0]?.email || "");
      formik.setFieldValue("phoneNo", allUsersData?.data?.[0]?.phoneNo || "");
      formik.setFieldValue("dob", allUsersData?.data?.[0]?.dob || "");
      formik.setFieldValue("genderId", allUsersData?.data?.[0]?.genderId || "");
      formik.setFieldValue("height", allUsersData?.data?.[0]?.height || "");
      formik.setFieldValue("weight", allUsersData?.data?.[0]?.weight || "");
      formik.setFieldValue("address", allUsersData?.data?.[0]?.address || "");
      formik.setFieldValue(
        "otherContact",
        allUsersData?.data?.[0]?.otherContact || ""
      );
    }
  }, [allUsersData]);
  // const isFileTypeAllowed = (file) => {
  //   const allowedTypes = [".png", ".jpg", ".jpeg"];
  //   return allowedTypes.includes(file.name.slice(-4).toLowerCase());
  // };

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  }

  const handleFileChange = async (event) => {
    debugger;
    setLoading(true);
    const file = event.target.files[0]; // Handle only the first selected file
    // console.log("");
    if (!file) {
      setLoading(false);
      console.error("No file selected.");
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      const response = await uploadImage({
        base64address: base64,
        fileName: file.name,
        extensions: file.name.split(".").pop(),
      });
      if (response?.error?.status) {
        dispatch(
          onFailure({
            message: "File size is too large",
          })
        );
        setLoading(true);
        return;
      }
      setImageUrl(response?.data);
      console.log("File uploaded successfully:", file.name);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const fileTypes = ["JPEG", "PNG", "GIF"];

  const [file, setFile] = useState(null);
  const handleChange = (file) => {
    setFile(file);
  };

  if (isLoading) {
    return (
      <Box>
        <Loader1 />
      </Box>
    );
  }

  // if (isError) {
  //   return (
  //     <MuiTypography color="#e02828" m="auto">
  //       {error?.data?.message || "Error"}
  //     </MuiTypography>
  //   );
  // }
  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} xl={4}>
          <Box width="100%">
            {/* Label aligned to the start */}
            <MuiTypography
              {...INPUT_LABEL_PROPS}
              htmlFor="profileImage"
              gutterBottom={true}
              sx={{ textAlign: "left" }} // Align the label to the start
            >
              Profile Image <span style={{ color: "#e02828" }}>*</span>
            </MuiTypography>

            {/* Centered image upload button */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 2, // Add some margin-top for spacing between label and image
              }}
            >
              <div style={{ position: "relative", display: "inline-block" }}>
                <input
                  accept=".png, .jpg, .jpeg"
                  id="contained-button-file"
                  name="profileImage"
                  type="file"
                  {...formik.getFieldProps("profileImage")}
                  onChange={handleFileChange} // Handle file selection
                  style={{ display: "none" }} // Hide the file input
                />
                <label htmlFor="contained-button-file">
                  {loading ? (
                    <Loader1 />
                  ) : (
                    <Avatar
                      src={
                        imageURl?.baseUrl ||
                        session?.data?.user?.user?.profilePicture
                      }
                      alt={session?.data?.user?.user?.name || "Remy Sharp"}
                      sx={{
                        margin: "10px",
                        width: "130px",
                        height: "130px",
                        cursor: "pointer",
                      }}
                    />
                  )}

                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      width: "100%",
                      opacity: 0,
                      transition: ".3s ease",
                      backgroundColor: "red",
                      cursor:"pointer"
                    }}
                  >
                    <a href="#" className="icon" title="User Profile">
                      <UploadIcon />
                    </a>
                  </div>
                </label>
              </div>
            </Box>

            {/* Display validation error */}
            {/* {formik.touched.profileImage && formik.errors.profileImage && (
              <MuiTypography variant="span" component="span" color="#E02828">
                {formik.errors.profileImage}
              </MuiTypography>
            )} */}
          </Box>
        </Grid>

        <Grid item xs={12} md={6} xl={4}>
          <Box width="100%">
            <MuiTypography
              {...INPUT_LABEL_PROPS}
              htmlFor="firstName"
              gutterBottom={true}
            >
              First Name <span style={{ color: "#e02828" }}>*</span>
            </MuiTypography>
            <InputField
              id="firstName"
              placeholder="First name"
              {...INPUT_FIELD_PROPS}
              sx={INPUT_FIELD_STYLES.sx}
              type="text"
              name="firstName"
              {...formik.getFieldProps("firstName")}
            />
            {formik.touched.firstName && formik.errors.firstName ? (
              <MuiTypography variant="span" component="span" color="#E02828">
                {formik.errors.firstName}
              </MuiTypography>
            ) : null}
          </Box>
        </Grid>

        <Grid item xs={12} md={6} xl={4}>
          <Box width="100%">
            <MuiTypography
              {...INPUT_LABEL_PROPS}
              htmlFor="lastName"
              gutterBottom={true}
            >
              Last Name <span style={{ color: "#e02828" }}>*</span>
            </MuiTypography>
            <InputField
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Last Name"
              {...INPUT_FIELD_PROPS}
              sx={INPUT_FIELD_STYLES.sx}
              {...formik.getFieldProps("lastName")}
            />
            {formik.touched.lastName && formik.errors.lastName ? (
              <MuiTypography variant="span" component="span" color="#E02828">
                {formik.errors.lastName}
              </MuiTypography>
            ) : null}
          </Box>
        </Grid>
        <Grid item xs={12} md={6} xl={4}>
          <Box width="100%">
            <MuiTypography
              {...INPUT_LABEL_PROPS}
              htmlFor="email"
              gutterBottom={true}
            >
              Email
            </MuiTypography>
            <InputField
              id="email"
              type="email"
              name="email"
              disabled={true}
              placeholder="Email"
              {...INPUT_FIELD_PROPS}
              sx={INPUT_FIELD_STYLES.sx}
              {...formik.getFieldProps("email")}
            />
            {/* {formik.touched.email && formik.errors.email ? (
              <MuiTypography variant="span" component="span" color="#E02828">
                {formik.errors.email}
              </MuiTypography>
            ) : null} */}
          </Box>
        </Grid>

        <Grid item xs={12} md={6} xl={4}>
          <Box width="100%">
            <MuiTypography
              {...INPUT_LABEL_PROPS}
              htmlFor="phoneNo"
              gutterBottom={true}
            >
              Phone Number
            </MuiTypography>

            {/* <PhoneInputCompo
              name="phoneNo"
              value={formik.values.phoneNo}
              onChange={(value) => formik.setFieldValue("phoneNo", value)}
            /> */}
            <PhoneInput
              className="country-list"
              value={formik.values.phoneNo}
              onChange={(value) => formik.setFieldValue("phoneNo", value)}
              placeholder="Type your phone here"
              inputStyle={{
                width: "100%",
                height: "50px",
                fontSize: "13px",
                paddingLeft: "48px",
                borderRadius: "5px",
                // marginButton: "0px",
              }}
              buttonStyle={{ borderRadius: "5px 0 0 5px" }}
              dropdownStyle={{ width: "365px" }}
            />

            {formik.touched.phoneNo && formik.errors.phoneNo ? (
              <MuiTypography variant="span" component="span" color="#E02828">
                {formik.errors.phoneNo}
              </MuiTypography>
            ) : null}
          </Box>
        </Grid>
        <Grid item xs={12} md={6} xl={4}>
          <Box width="100%">
            <MuiTypography
              {...INPUT_LABEL_PROPS}
              htmlFor="dateOfBirth"
              gutterBottom={true}
            >
              D.O.B
            </MuiTypography>

            <DatePicker
              disableFuture={true}
              value={dayjs(formik.values.dob)}
              onChange={(newValue) => formik.setFieldValue("dob", newValue)}
            />

            {formik.touched.dob && formik.errors.dob ? (
              <MuiTypography variant="span" component="span" color="#E02828">
                {formik.errors.dob}
              </MuiTypography>
            ) : null}
          </Box>
        </Grid>
        <Grid item xs={12} md={6} xl={4}>
          <Box width="100%">
            <MuiTypography
              {...INPUT_LABEL_PROPS}
              htmlFor="gender"
              gutterBottom={true}
            >
              Gender
            </MuiTypography>
            <Select
              value={formik.values.genderId}
              onChange={(e) => formik.setFieldValue("genderId", e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              label=""
              fullWidth={true}
              sx={INPUT_FIELD_STYLES.sx}
            >
              {GENDER_OPTIONS.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>

            {formik.touched.genderId && formik.errors.genderId ? (
              <MuiTypography variant="span" component="span" color="#E02828">
                {formik.errors.genderId}
              </MuiTypography>
            ) : null}
          </Box>
        </Grid>

        <Grid item xs={12} md={6} xl={4}>
          <Box width="100%">
            <MuiTypography
              {...INPUT_LABEL_PROPS}
              htmlFor="address"
              gutterBottom={true}
            >
              Address <span style={{ color: "#e02828" }}>*</span>
            </MuiTypography>
            <InputField
              id="address"
              type="text"
              name="address"
              placeholder="Address"
              {...INPUT_FIELD_PROPS}
              sx={INPUT_FIELD_STYLES.sx}
              {...formik.getFieldProps("address")}
            />
            {formik.touched.address && formik.errors.address ? (
              <MuiTypography variant="span" component="span" color="#E02828">
                {formik.errors.address}
              </MuiTypography>
            ) : null}
          </Box>
        </Grid>
        <Grid item xs={12} md={6} xl={4}>
          <Box width="100%">
            <MuiTypography
              {...INPUT_LABEL_PROPS}
              htmlFor="height"
              gutterBottom={true}
            >
              Height <span style={{ color: "#e02828" }}>*</span>
            </MuiTypography>
            <InputField
              id="height"
              type="number"
              name="height"
              placeholder="5.9"
              {...INPUT_FIELD_PROPS}
              sx={INPUT_NUMBER_FIELD_STYLE.sx}
              {...formik.getFieldProps("height")}
              endAdornment={<InputAdornment position="end">ft</InputAdornment>}
            />
            {formik.touched.height && formik.errors.height ? (
              <MuiTypography variant="span" component="span" color="#E02828">
                {formik.errors.height}
              </MuiTypography>
            ) : null}
          </Box>
        </Grid>
        <Grid item xs={12} md={6} xl={4}>
          <Box width="100%">
            <MuiTypography
              {...INPUT_LABEL_PROPS}
              htmlFor="weight"
              gutterBottom={true}
            >
              Weight <span style={{ color: "#e02828" }}>*</span>
            </MuiTypography>

            <InputField
              id="weight"
              type="number"
              name="weight"
              placeholder="69kg"
              {...INPUT_FIELD_PROPS}
              sx={INPUT_NUMBER_FIELD_STYLE.sx}
              {...formik.getFieldProps("weight")}
              endAdornment={<InputAdornment position="end">kg</InputAdornment>}
            />
            {formik.touched.weight && formik.errors.weight ? (
              <MuiTypography variant="span" component="span" color="#E02828">
                {formik.errors.weight}
              </MuiTypography>
            ) : null}
          </Box>
        </Grid>

        {/* <Grid item xs={12}>
          <Grid item xs={4}>
            <MuiTypography
              {...INPUT_LABEL_PROPS}
              htmlFor="document"
              gutterBottom={true}
            >
              Documents
            </MuiTypography>
            <Box>
              <StyledLabel htmlFor="patient-pic" className="text-center w-100">
                <AddPhotoAlternateOutlinedIcon
                  sx={{ color: "#4A4A4A", marginRight: "10px" }}
                  fontSize="large"
                />
                <p style={{ margin: "0px", fontSize: "14px" }}>
                  <span style={{ fontWeight: "500" }}>Upload</span>
                  <span className="text-black fs-6"> or drag and drop</span>
                </p>
                <p
                  style={{
                    margin: "0px 10px",
                    fontSize: "12px",
                    color: "#898989",
                  }}
                >
                  (PNG, JPG)
                </p>
              </StyledLabel>

              <input
                size="small"
                type="file"
                id="patient-pic"
                name="patient-pic"
                accept="image/png, image/jpeg"
                multiple
                onChange={handleDocumentChange}
                onDrop={handleDocumentDrop}
                onDragOver={(e) => e.preventDefault()}
                style={{ display: "none" }}
              />
            </Box>
            <Box>
              {uploadedImages.map((imageUrl, index) => (
                <Box
                  key={index}
                  display="flex"
                  sx={{ pb: 1, marginRight: 2 }} // Adjust margin as needed
                >
                  Display image preview 

                  <img
                    src={imageUrl?.data?.baseUrl}
                    alt={`Uploaded Image ${index + 1}`}
                    style={{ width: 150, height: 150, objectFit: "cover" }}
                  />
                 <Image
                   src={imageUrl?.data?.baseUrl}
                    loading="eager"
                    layout="fill"
                    objectFit="contain"
                    style={{
                      objectFit: "contain",
                    }}
                    alt={`Uploaded Image ${index + 1}`}
                  /> 
                  Add a button to remove the image 
                  <Box cursor="pointer">
                    <AiOutlineClose
                      size={18}
                      cursor={"pointer"}
                      onClick={() => handleRemoveImage(index)}
                    />
                  </Box>
                  <MuiTypography
                    variant="body2"
                    component="p"
                    sx={{
                      position: "absolute",
                      bottom: -10,
                      left: 5,
                      color: "#fff",
                      textShadow: "1px 1px 1px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    {imageURl?.data?.keyName}
                  </MuiTypography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid> */}
        <Box display="flex" justifyContent="flex-end" my="92px">
          {updateUserLoading === true ? (
            <Loader1 />
          ) : (
            <Button
              type="submit"
              variant="contain"
              bg="#E02828"
              color="#fff"
              height="45px"
              radius="12px"
              width="160px"
              style={{ marginTop: "95px" }}
            >
              Update
            </Button>
          )}
        </Box>
      </Grid>
    </form>
  );
};

export default PatientProfile;
