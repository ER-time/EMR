"use client";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Avatar, Grid, MenuItem, Select } from "@mui/material";
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
  useGetUserByIdQuery,
  useUpdateUserByIdMutation,
  useUploadImageMutation,
} from "@/redux/slices/userProfile";
import { Loader1 } from "@/components/core/Loader/Loader";
import { GENDER_OPTIONS, USER_ROLE } from "@/config";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";
import { useDispatch } from "react-redux";
import moment from "moment";
import { useGetAllSpecialitiesQuery } from "@/redux/slices/lookups";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  useGetAllDepartmentsOrGetByIdQuery,
  useGetAllSpecializationByDeptIdMutation,
} from "@/redux/slices/doctors";

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

const DoctorProfile = () => {
  const session = useSession();

  const dispatch = useDispatch();
  const [
    uploadImage,
    { data: uploadImageData, isLoading: uploadImageLoading },
  ] = useUploadImageMutation();

  const [imageURl, setImageUrl] = useState(null);
  console.log("session::::",session);
  const [uploadedImages, setUploadedImages] = useState([
    { documentURL: "", keyName: "" },
  ]);
  const [loading, setLoading] = useState(null);
  const [profileImageLoading, setProfileImageLoading] = useState(null);
  const specialities = useGetAllSpecialitiesQuery();
  const [showSpecility, setShowSpecility] = useState(true);
  const [
    getAllSpecializationByDeptId,
    {
      data: getAllSpecializationLookups,
      isLoading: getAllSpecializationLookupsLoading,
    },
  ] = useGetAllSpecializationByDeptIdMutation();

  const getAllDepartments = useGetAllDepartmentsOrGetByIdQuery();

  const router = useRouter();

  // useEffect(() => {
  //   setLoading(false);
  // }, [session]);
  // console.log("setLoading");
  const [
    getAllUsers,
    { data: allUsersData, isLoading, isError, isSuccess, error },
  ] = useGetAllUsersMutation();

console.log("allUsersData::::",allUsersData);

  useEffect(() => {
    setImageUrl(null);
  }, [router]);

  useEffect(() => {
    const payload = {
      userId: session.data?.user?.user?.userId,
      userRoleId: session?.data?.user?.user?.roleId,
    };
    getAllUsers(payload);
  }, [router]);

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
    doctorSpecializationList: [],
    doctorDepartmentList: [],
    // specializationId: "",
  };

  const onSubmit = async (values) => {
    console.log("values:::", values);
    try {
      let finalPayload = {
        userId: session?.data?.user?.user?.userId,
        roleId: USER_ROLE?.doctor,
        firstName: values?.firstName,
        lastName: values?.lastName,
        email: values?.email,
        dateOfBirth: moment(values?.dob)?.local()?.toISOString(),
        genderId: values?.genderId,
        phoneNumber: values?.phoneNo,
        address: values?.address,
        // doctorSpecializationList: null,
        doctorDepartmentList: values?.doctorDepartmentList?.map(
          (departmentId) => ({
            departmentId: departmentId,
          })
        ),
        // specializationId: values?.specializationId,
        doctorSpecializationList: values?.doctorSpecializationList?.map(
          (specialityId) => ({
            specializationId: specialityId,
          })
        ),
        doctorFee: values?.doctorFee || 100,
        profilePicture: imageURl
          ? imageURl?.keyName
          : allUsersData?.data?.[0]?.profileImage,
        doctorDocumentList: uploadedImages?.map((imageUrl) => {
          return {
            documentURL: imageUrl.keyName
              ? imageUrl?.keyName
              : imageUrl?.documentName,
          };
        }),
      };
      console.log("finalPayload:::", finalPayload);
      // return;
      const resp = await updateUserById(finalPayload)?.unwrap();

      if (resp?.succeeded === true) {
        let sessionPayload = {
          address: values?.address,
          dob: moment(values?.dob).local().toISOString(),
          email: values?.email,
          genderId: values?.genderId,
          name: `${values?.firstName} ${values?.lastName}`,
          phoneNumber: values?.phoneNo,
          profilePicture: imageURl?.baseUrl,
          userId: session?.data?.user?.user?.userId,
          role: "Doctor",
          roleId: USER_ROLE.doctor,
          profilePictureKey: imageURl?.keyName,
        };

        const updatedSessionData = {
          ...session.data.user,
          user: {
            ...session.data.user.user,
            ...sessionPayload,
          },
        };
        await session.update({ data: updatedSessionData });
        dispatch(
          onSuccess({
            message: "Profile Updated Successfully" || "Success",
          })
        );
        router.push("/dashboard");
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
    firstName: Yup.string().required("Field is Required!"),
    lastName: Yup.string().required("Field is Required!"),
    dob: Yup.date()
      .max(new Date(), "Date of Birth must be in the past")
      .required("Date of Birth is Required!"),
    genderId: Yup.string().required("Field is Required!"),
    phoneNo: Yup.string().required("Field is Required!"),
    address: Yup.string().required("Field is Required!"),
    // doctorDepartmentList: Yup.array().when("roleId", {
    //   then: () =>
    //     Yup.array().min(1).required("At least one item needs to be here"),
    // }),
    doctorSpecializationList: Yup.array().when("roleId", {
      then: () =>
        Yup.array().min(1).required("At least one item needs to be here"),
    }),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  // console.log(
  //   " allUsersData?.data?.[0]?.DepartmentId",
  //   allUsersData?.data?.[0]
  // );
  console.log("allUsersData:::::", allUsersData);
  useEffect(() => {
    console.log("allUsersData:::use effect", allUsersData);
    if (allUsersData && allUsersData.data && allUsersData.data.length > 0) {
      const userData = allUsersData.data[0];

      // Set form values
      formik.setFieldValue("firstName", userData.firstName || "");
      formik.setFieldValue("lastName", userData.lastName || "");
      formik.setFieldValue("email", userData.email || "");
      formik.setFieldValue("phoneNo", userData.phoneNo || "");
      formik.setFieldValue("dob", userData.dob || "");
      formik.setFieldValue("genderId", userData.genderId || "");
      formik.setFieldValue("address", userData.address || "");
      // Set specializations
      const doctorSpecializationList =
        userData.specializations?.map((spec) => spec.specializationId) || [];
      formik.setFieldValue(
        "doctorSpecializationList",
        doctorSpecializationList
      );
      // Set documents
      const imagesUrlArray =
        userData.documents?.map((item) => ({
          documentURL: item?.documentURL || "",
          documentName: item?.documentKey || "",
        })) || [];
      setUploadedImages(imagesUrlArray);

      // Set departments
      const departmentList =
        userData.departments?.map((dept) => dept.departmentId) || [];
      formik.setFieldValue("doctorDepartmentList", departmentList);
    }
  }, [allUsersData]); // Ensure this updates when allUsersData changes

  useEffect(() => {
    const userData = allUsersData?.data[0];
    const fetchSpecility = async () => {
      console.log("userData.doctorDepartmentList", userData);
      const deptIDs = userData?.departments.map(
        (department) => department?.departmentId
      );
      const response = await getAllSpecializationByDeptId(deptIDs);
    };
    if (userData) fetchSpecility();
  }, [allUsersData]);

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
    setProfileImageLoading(true)
    // setLoading(true);
    const file = event.target.files[0]; // Handle only the first selected file
    // console.log("");
    if (!file) {
      setProfileImageLoading(false)
      // setLoading(false);
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
        setProfileImageLoading(false)
        // setLoading(true);
        return;
      }
      setImageUrl(response?.data);
      console.log("File uploaded successfully:", file.name);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setProfileImageLoading(false)
      // setLoading(false);
    }
  };

  const handleDocumentChange = async (event) => {
    setLoading(true);
    const files = event.target.files;

    // No size or type checks, directly process all files
    for (const file of files) {
      const base64 = await fileToBase64(file);
      try {
        const response = await uploadImage({
          base64address: base64,
          fileName: file.name,
          extensions: file.name.split(".").pop(),
        });
        console.log("response:::::",response);
        // Push uploaded image URL to the array
        setUploadedImages([
          ...uploadedImages,
          {
            documentURL: response?.data?.baseUrl,
            keyName: response?.data?.keyName,
          },
        ]);
        setLoading(false);
        console.log("File uploaded successfully:", file.name);
      } catch (error) {
        setLoading(false);
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleDocumentDrop = async (event) => {
    setLoading(true);
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;

    // No size or type checks, directly process all files
    for (const file of droppedFiles) {
      const base64 = await fileToBase64(file);
      try {
        const response = await uploadImage({
          base64address: base64,
          fileName: file.name,
          extensions: file.name.split(".").pop(),
        });
        setUploadedImages([...uploadedImages, response?.data]);
        setLoading(false);
        console.log("File uploaded successfully:", file.name);
      } catch (error) {
        setLoading(false);
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = uploadedImages.filter(
      (_, index) => index !== indexToRemove
    );
    setUploadedImages(updatedImages);
  };

  const handleRemoveFile = (index) => {
    setImageUrl(null);
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const fileTypes = ["JPEG", "PNG", "GIF"];

  const [file, setFile] = useState(null);
  const handleChange = (file) => {
    setFile(file);
  };
  const handleChange1 = (event) => {
    const {
      target: { value },
    } = event;

    formik.setFieldValue("doctorSpecializationList", value);
  };

  if (isLoading) {
    return (
      <Box>
        <Loader1 />
      </Box>
    );
  }

  if (isError) {
    return (
      <MuiTypography color="#e02828" m="auto">
        {error?.data?.message || "Error"}
      </MuiTypography>
    );
  }

  const getAllDepartmentsHandler = async (event) => {
    // debugger;
    formik.setFieldValue("doctorDepartmentList", event.target.value);

    let valuesAlreadyExist = formik.getFieldProps("doctorDepartmentList").value;
    console.log("valuesAlreadyExist", valuesAlreadyExist);
    formik.setFieldValue("doctorSpecializationList", []);
    if (event.target.value.length === 0) {
      setShowSpecility(false);
    } else {
      setShowSpecility(true);
    }

    try {
      const response = await getAllSpecializationByDeptId(event.target.value);
    } catch (error) {
      console.log("error::::", error);
    }
  };

  const doctorSpecializationListHandler = (event) => {
    const {
      target: { value },
    } = event;

    formik.setFieldValue("doctorSpecializationList", value);
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{ background: "white", padding: "20px" }}
    >
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
                  {profileImageLoading ? (
                    <Loader1 />
                  ) : (
                    <Avatar
                      src={
                        imageURl?.baseUrl ||
                        allUsersData?.data?.[0]?.profileImageURL
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
            <PhoneInput
              className="country-list"
              name="phoneNo"
              value={formik.values.phoneNo}
              onChange={(value) => formik.setFieldValue("phoneNo", value)}
              placeholder="Type your phone here"
              inputStyle={{
                width: "80%",
                height: "50px",
                fontSize: "13px",
                paddingLeft: "48px",
                borderRadius: "5px",
                marginButton: "0px",
              }}
              buttonStyle={{ borderRadius: "5px 0 0 5px" }}
              dropdownStyle={{ width: "430px" }}
            />
            {/* <PhoneInputCompo
              name="phoneNo"
              value={formik.values.phoneNo}
              onChange={(value) => formik.setFieldValue("phoneNo", value)}
            /> */}

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
              disabled={allUsersData ? true : false}
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
        {/* <Grid item xs={12} md={6} xl={4}>
          <Box width="100%">
            <MuiTypography
              {...INPUT_LABEL_PROPS}
              htmlFor="speciality"
              gutterBottom={true}
            >
              Speciality
            </MuiTypography>
            <Select
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              labe=""
              multiple
              value={formik.values.doctorSpecializationList}
              onChange={handleChange1}
              fullWidth={true}
              sx={INPUT_FIELD_STYLES.sx}
              MenuProps={{
                style: {
                  maxHeight: 350,
                },
              }}
            >
              {specialities?.data?.data.map((specialityItem, index) => (
                <MenuItem
                  key={specialityItem?.specializationId}
                  value={specialityItem.specializationId}
                >
                  {specialityItem?.title}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {formik.touched.doctorSpecializationList &&
          formik.errors.doctorSpecializationList ? (
            <MuiTypography variant="span" component="span" color="#E02828">
              At least one Speciality required
            </MuiTypography>
          ) : null}
        </Grid> */}
        <>
          <Grid item xs={12} md={6} xl={4}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="departmentId"
                gutterBottom={true}
                sx={{ minWidth: 30 }}
              >
                Department
              </MuiTypography>
              <Select
                value={formik.values.doctorDepartmentList}
                onChange={getAllDepartmentsHandler}
                MenuProps={{
                  style: {
                    maxHeight: 350,
                    minWidth: "10px",
                  },
                }}
                multiple
                // disabled={userData?.genderId}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                label=""
                fullWidth={true}
                sx={INPUT_FIELD_STYLES.sx}
              >
                {getAllDepartments &&
                  getAllDepartments?.data?.data?.length > 0 &&
                  getAllDepartments?.data?.data?.map((item) => {
                    const truncateText = (text, maxLength) => {
                      if (text?.length > maxLength) {
                        return text?.slice(0, maxLength) + "...";
                      }
                      return text;
                    };
                    return (
                      <MenuItem
                        key={item.departmentId}
                        value={item.departmentId}
                      >
                        {truncateText(item?.departmentName, 10)}{" "}
                      </MenuItem>
                    );
                  })}
              </Select>

              {formik.touched.departmentId && formik.errors.departmentId ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.departmentId}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>
          {showSpecility &&
            getAllSpecializationLookups &&
            getAllSpecializationLookups?.data?.length > 0 && (
              <Grid item xs={12} md={6} xl={4}>
                <Box width="100%">
                  <MuiTypography
                    {...INPUT_LABEL_PROPS}
                    htmlFor="speciality"
                    gutterBottom={true}
                  >
                    Speciality
                  </MuiTypography>
                  <Select
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    labe=""
                    multiple
                    value={formik.values.doctorSpecializationList}
                    onChange={doctorSpecializationListHandler}
                    fullWidth={true}
                    sx={INPUT_FIELD_STYLES.sx}
                    MenuProps={{
                      style: {
                        maxHeight: 350,
                      },
                    }}
                  >
                    {getAllSpecializationLookups &&
                      getAllSpecializationLookups?.data?.length > 0 &&
                      getAllSpecializationLookups?.data?.map((item) => {
                        console.log("item::::::", item);
                        return (
                          <MenuItem
                            key={item.specializationId}
                            value={item.specializationId}
                          >
                            {item?.specializationName || ""}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </Box>

                {formik.touched.doctorSpecializationList &&
                formik.errors.doctorSpecializationList ? (
                  <MuiTypography
                    variant="span"
                    component="span"
                    color="#E02828"
                  >
                    Field is Required!
                  </MuiTypography>
                ) : null}
              </Grid>
            )}

          {/* <Grid item xs={12} md={6} lg={4}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor=" "
                gutterBottom={true}
                sx={{ minWidth: 30 }}
              >
                Speciality
              </MuiTypography>
              <Select
                value={formik.values.specializationId}
                onChange={(e) =>
                  formik.setFieldValue("specializationId", e.target.value)
                }
                MenuProps={{
                  style: {
                    maxHeight: 350,
                    minWidth: "10px",
                  },
                }}
                disabled={!formik.values.departmentId}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                label=""
                fullWidth={true}
                sx={INPUT_FIELD_STYLES.sx}
              >
                {getAllSpecializationLookups &&
                  getAllSpecializationLookups?.data?.length > 0 &&
                  getAllSpecializationLookups?.data?.map((item) => {
                    console.log("item::::::", item);
                    return (
                      <MenuItem
                        key={item.specializationId}
                        value={item.specializationId}
                      >
                        {item?.specializationName || ""}
                      </MenuItem>
                    );
                  })}
              </Select>

              {formik.touched.specializationId &&
              formik.errors.specializationId ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.specializationId}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid> */}
        </>

        <Grid item xs={12}>
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "70%",
                // flexWrap: "nowrap", // Ensures items stay in a single row
                // justifyContent: "flex-start", // or "space-between" for equal spacing
                // alignItems: "center", // or "flex-start" for vertical alignment
                // overflowX: "auto", // Enable horizontal scrolling if necessary
                // scrollbarWidth: "none", // Hide the scrollbar
                // msOverflowStyle: "none", // Hide the scrollbar in IE
                // "&::-webkit-scrollbar": {
                //   display: "none", // Hide the scrollbar in webkit browsers
                // },
              }}
              className="bkxuJu"
            >
              {loading ? (
                <Loader1 />
              ) : (
                uploadedImages.map((imageUrl, index) => {
                  console.log(
                    "imageUrl?.documentURL",
                    imageUrl
                  );
                  return (
                    <Box
                      key={index}
                      sx={{ mr: 2 }} // Adjust margin as needed
                      display="flex"
                      mt={1}
                    >
                      {/* Display image preview */}
                      {imageUrl?.documentURL && (
                        <img
                          src={imageUrl?.documentURL}
                          // alt={`Uploaded Image ${index + 1}`}
                          style={{
                            width: 150,
                            height: 150,
                            objectFit: "cover",
                            position: "block",
                            borderRadius: "20px",
                          }}
                        />
                      )}
                      {/* Add a button to remove the image */}
                      <Box>
                        <AiOutlineClose
                          cursor="pointer"
                          size={18}
                          onClick={() => handleRemoveImage(index)}
                        />
                      </Box>
                      {/* Optionally display image name */}
                      {/* <MuiTypography
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
            {imageUrl?.data?.keyName}
          </MuiTypography> */}
                    </Box>
                  );
                })
              )}
            </Box>
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="flex-end" my="92px">
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
            {updateUserLoading === true ? (
              <BeatLoader color="#fff" size="10px" />
            ) : (
              "Update"
            )}
          </Button>
        </Box>
      </Grid>
    </form>
  );
};

export default DoctorProfile;
