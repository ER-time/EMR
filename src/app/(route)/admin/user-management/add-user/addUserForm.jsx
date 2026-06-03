"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Grid, MenuItem, Select } from "@mui/material";
import { Box, Button } from "@/components";
import MuiTypography from "@/components/core/Typography";
import InputField from "@/components/core/Input";
import DatePicker from "@/components/core/DatePicker";
import { useDispatch } from "react-redux";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";
import { BeatLoader } from "react-spinners";
import { GENDER_OPTIONS, USER_ROLE } from "@/config";
import { useGetAllSpecialitiesQuery } from "@/redux/slices/lookups";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { useUpdateUserByIdMutation } from "@/redux/slices/userProfile";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  useGetAllDepartmentsOrGetByIdQuery,
  useGetAllSpecializationByDeptIdMutation,
} from "@/redux/slices/doctors";

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
const INPUT_CURRENCY_STYLES = {
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

export default function DoctorDetails({
  allUsersData,
  userData,
  type,
  onCancel,
  setRefetchData,
}) {
  const specialities = useGetAllSpecialitiesQuery();
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [userRegisteration, { isLoading, isError, error, isSuccess }] =
    useUpdateUserByIdMutation();
  const getAllDepartments = useGetAllDepartmentsOrGetByIdQuery();
  const [showSpecility, setShowSpecility] = useState(true);
  const [
    getAllSpecializationByDeptId,
    {
      data: getAllSpecializationLookups,
      isLoading: getAllSpecializationLookupsLoading,
    },
  ] = useGetAllSpecializationByDeptIdMutation();
  // console.log("userData:::", userData);
  // console.log("userData::::", userData.specializations.map((spec) => spec.specializationId));
  const [dropdownWidth, setDropdownWidth] = useState("340px");
  useEffect(() => {
    if (inputRef.current) {
      setDropdownWidth(`${inputRef.current.offsetWidth}px`);
    }
  }, []);
  useEffect(() => {
    // debugger
    formik.setFieldValue("roleId", type);
    formik.setFieldValue("firstName", userData?.firstName || "");
    formik.setFieldValue("lastName", userData?.lastName || "");
    formik.setFieldValue("email", userData?.email || "");
    formik.setFieldValue("dateOfBirth", userData?.dob || "");
    formik.setFieldValue("genderId", 11 || "");
    formik.setFieldValue("phoneNumber", userData?.phoneNo || "");
    formik.setFieldValue("address", userData?.address || "");
    formik.setFieldValue("doctorFee", userData?.doctorFee || "");
    if (userData?.specializations) {
      formik.setFieldValue(
        "doctorSpecializationList",
        userData.specializations.map((spec) => spec?.specializationId) || []
      );
    }

    const departmentList =
      userData.departments?.map((dept) => dept.departmentId) || [];
    formik.setFieldValue("doctorDepartmentList", departmentList);
    // formik.setFieldValue("specializationId", userData?.SpecializationId || "");

    if (userData?.doctorDepartmentList) {
      getAllSpecializationByDeptId(userData.doctorDepartmentList);
    }
  }, [type, userData]);
  useEffect(() => {
    // debugger;
    const fetchSpecility = async () => {
      console.log("userData.doctorDepartmentList", userData);
      const deptIDs = userData?.departments.map(
        (department) => department?.departmentId
      );
      console.log("deptIDs::::", deptIDs);
      const response = await getAllSpecializationByDeptId(deptIDs);
      console.log("response=====>", response);
    };
    if (userData) fetchSpecility();
  }, [userData]);

  const initialValues = {
    roleId: "",
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    genderId: 11,
    phoneNumber: "",
    address: "",
    doctorSpecializationList: [],
    doctorFee: null,
    doctorDepartmentList: [],
    specializationId: "",
  };

  const patientValidationSchema = Yup.object({
    roleId: Yup.number().required("Field is Required!"),
    firstName: Yup.string().required("Field is Required!"),
    lastName: Yup.string().required("Field is Required!"),
    email: Yup.string()
      .email("Invalid Email Format!")
      .required("Field is Required!"),
    dateOfBirth: Yup.date()
      .max(
        new Date(Date.now() - 86400000), // Subtracting 1 day in milliseconds
        "Date of Birth must be in the past"
      )
      .required("Field is Required!"),
    genderId: Yup.string().required("Field is Required!"),
    phoneNumber: Yup.string().required("Field is Required!"),
    address: Yup.string().required("Field is Required!"),
  });
  const doctorValidationSchema = Yup.object({
    roleId: Yup.number().required("Field is Required!"),
    firstName: Yup.string().required("Field is Required!"),
    lastName: Yup.string().required("Field is Required!"),
    email: Yup.string()
      .email("Invalid Email Format!")
      .required("Field is Required!"),
    dateOfBirth: Yup.date()
      .max(
        new Date(Date.now() - 86400000), // Subtracting 1 day in milliseconds
        "Date of Birth must be in the past"
      )
      .required("Field is Required!"),
    genderId: Yup.string().required("Field is Required!"),
    // doctorDepartmentList: Yup.string().required("Field is Required!"),
    // specializationId: Yup.string().required("Field is Required!"),
    phoneNumber: Yup.string().required("Field is Required!"),
    address: Yup.string().required("Field is Required!"),
    // doctorSpecializationList: Yup.array().when("roleId", {
    //   is: USER_ROLE.doctor,
    //   then: () =>
    //     Yup.array().min(1).required("At least one item needs to be here"),
    // }),
    // doctorDepartmentList: Yup.array().when("roleId", {
    //   is: USER_ROLE.doctor,
    //   then: () =>
    //     Yup.array().min(1).required("At least one item needs to be here"),
    // }),
    doctorSpecializationList: Yup.array().when("roleId", {
      is: USER_ROLE.doctor,
      then: () =>
        Yup.array()
          .min(1, "Please select at least one specialization")
          .required("Specialization is required"),
    }),
    doctorDepartmentList: Yup.array().when("roleId", {
      is: USER_ROLE.doctor,
      then: () =>
        Yup.array()
          .min(1, "Please select at least one department")
          .required("Department is required"),
    }),

    // doctorFee: Yup.string().when("roleId", {
    //   is: USER_ROLE.doctor,
    //   then: () =>
    //     Yup.number().positive()
    //   .label('Doctor Fee')
    //   .required('Field is Required!')

    // }),
  });

  const onSubmit = async (values) => {
    // console.log("values:::", values);
    try {
      let finalPayload = {
        userId: userData?.userId || 0,
        roleId: type,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        dateOfBirth: new Date(values.dateOfBirth).toISOString(),
        genderId: values.genderId,
        phoneNumber: values.phoneNumber,
        address: values.address,
        userLanguageList: [
          {
            languageId: 1,
          },
        ],
        doctorSpecializationList: values?.doctorSpecializationList?.map(
          (specialityId) => ({
            specializationId: specialityId,
          })
        ),
        doctorFee: values?.doctorFee || 100,
        doctorDepartmentList: values?.doctorDepartmentList?.map(
          (departmentId) => ({
            departmentId: departmentId,
          })
        ),
        // specializationId: values?.specializationId,
      };
      // console.log("finalPayload::::", finalPayload);
      // return;
      const resp = await userRegisteration(finalPayload).unwrap();
      if (resp?.succeeded === true) {
        dispatch(
          onSuccess({
            message:
              finalPayload.userId !== 0
                ? "User updated successfully"
                : finalPayload.roleId === USER_ROLE.patient
                ? "Patient created Successfully and Email has been sent on the registered email to set a Password"
                : "Doctor created Successfully and Email has been sent on the registered email to set a Password",
          })
        );
        setRefetchData((prevState) => !prevState);
        onCancel();
      } else {
        dispatch(
          onFailure({
            message: resp?.message || "Failure",
          })
        );
      }
    } catch (err) {
      dispatch();
      // onFailure({
      //   message: resp?.message || "Failure",
      // })
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema:
      type === USER_ROLE.patient
        ? patientValidationSchema
        : doctorValidationSchema,
  });
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    const updatedValues = Array.from(new Set(value));

    // console.log("Updated Specialties:", updatedValues);

    formik.setFieldValue("doctorSpecializationList", updatedValues);
  };

  const getAllDepartmentsHandler = async (event, a1, a2, a3) => {
    // debugger;
    formik.setFieldValue("doctorDepartmentList", event.target.value);
    try {
      const response = await getAllSpecializationByDeptId(event.target.value);
      formik.setFieldValue("doctorSpecializationList", []);
      if (event.target.value.length === 0) {
        setShowSpecility(false);
      } else {
        setShowSpecility(true);
      }
      console.log("response::::", response);
    } catch (error) {
      console.log("error::::", error);
    }
  };

  console.log("doctorSpecializationList", formik.doctorSpecializationList);
  const onKeyDown = (e) => {
    e.preventDefault();
  };
  // console.log("formik values", formik);
  return (
    <form onSubmit={formik.handleSubmit}>
      {specialities?.isLoading ? (
        <div>Loading...</div>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
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
                type="text"
                name="firstName"
                {...INPUT_FIELD_PROPS}
                sx={INPUT_FIELD_STYLES.sx}
                {...formik.getFieldProps("firstName")}
                value={formik.values.firstName}
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.firstName}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="lastName"
                gutterBottom={true}
              >
                Last Name <span style={{ color: "#e02828" }}>*</span>
              </MuiTypography>
              <InputField
                id="lastName"
                placeholder="Last Name"
                type="text"
                name="lastName"
                {...INPUT_FIELD_PROPS}
                sx={INPUT_FIELD_STYLES.sx}
                {...formik.getFieldProps("lastName")}
                value={formik.values.lastName}
              />
              {formik.touched.lastName && formik.errors.lastName ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.lastName}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
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
                value={dayjs(formik.values.dateOfBirth)}
                onChange={(newValue) => {
                  formik.setFieldValue("dateOfBirth", newValue);
                }}
                slotProps={{
                  textField: {
                    readOnly: true,
                  },
                }}
              />
              {formik.touched.dateOfBirth && formik.errors.dateOfBirth ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.dateOfBirth}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>
          {type === USER_ROLE.doctor && (
            <>
              <Grid item xs={12} md={6} lg={6}>
                <Box width="100%">
                  <MuiTypography
                    {...INPUT_LABEL_PROPS}
                    htmlFor="doctorDepartmentList"
                    gutterBottom={true}
                    sx={{ minWidth: 30 }}
                  >
                    Department
                  </MuiTypography>
                  <Select
                    value={formik.values.doctorDepartmentList}
                    multiple
                    onChange={getAllDepartmentsHandler}
                    MenuProps={{
                      style: {
                        maxHeight: 350,
                        maxWidth: "10px",
                      },
                    }}
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
                            {item?.departmentName}{" "}
                          </MenuItem>
                        );
                      })}
                  </Select>

                  {formik.touched.doctorDepartmentList &&
                  formik.errors.doctorDepartmentList ? (
                    <MuiTypography
                      variant="span"
                      component="span"
                      color="#E02828"
                    >
                      {formik.errors.doctorDepartmentList}
                    </MuiTypography>
                  ) : null}
                </Box>
              </Grid>
              {showSpecility &&
                getAllSpecializationLookups &&
                getAllSpecializationLookups?.data?.length > 0 && (
                  <Grid item xs={12} md={6} lg={6}>
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
                        label=""
                        multiple
                        value={formik.values.doctorSpecializationList}
                        onChange={handleChange}
                        fullWidth={true}
                        sx={{
                          ...INPUT_FIELD_STYLES.sx,
                          "& .MuiPopover-paper ": {
                            width: "200px", // Desired width for the input base
                          },
                        }}
                        MenuProps={{
                          style: {
                            maxHeight: 350,
                            width: 1000,
                          },
                        }}
                      >
                        {getAllSpecializationLookups &&
                          getAllSpecializationLookups?.data?.length > 0 &&
                          getAllSpecializationLookups?.data?.map((item) => {
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
              {/* <Grid item xs={12} md={6} lg={6}>
                <Box width="100%">
                  <MuiTypography
                    {...INPUT_LABEL_PROPS}
                    htmlFor="specializationId"
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
                    disabled={!formik.values.doctorDepartmentList}
                    // displayEmpty
                    // multiple
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

                  {formik.touched.specializationId && formik.errors.specializationId ? (
                  <MuiTypography variant="span" component="span" color="#E02828">
                    {formik.errors.specializationId}
                  </MuiTypography>
                ) : null} 
                </Box>
              </Grid> */}
            </>
          )}
          {type === USER_ROLE.doctor && (
            <>
              {/* <Grid item xs={12} md={6} lg={6}>
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
                    onChange={handleChange}
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
                  <MuiTypography
                    variant="span"
                    component="span"
                    color="#E02828"
                  >
                    Field is Required!
                  </MuiTypography>
                ) : null}
              </Grid> */}
              <Grid item xs={12} md={6} lg={6}>
                <Box width="100%">
                  <MuiTypography
                    {...INPUT_LABEL_PROPS}
                    htmlFor="doctorFee"
                    gutterBottom={true}
                  >
                    Doctor Fee
                  </MuiTypography>
                  <InputField
                    id="email"
                    placeholder="Doctor Fee"
                    type="number"
                    name="doctorFee"
                    {...INPUT_FIELD_PROPS}
                    sx={INPUT_CURRENCY_STYLES.sx}
                    {...formik.getFieldProps("doctorFee")}
                    // disabled={userData?.doctorFee}
                  />
                </Box>

                {formik.touched.doctorFee && formik.errors.doctorFee ? (
                  <MuiTypography
                    variant="span"
                    component="span"
                    color="#E02828"
                  >
                    {formik.errors.doctorFee}
                  </MuiTypography>
                ) : null}
              </Grid>
            </>
          )}
          <Grid item xs={12} md={6} lg={6}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="email"
                gutterBottom={true}
              >
                Email <span style={{ color: "#e02828" }}>*</span>
              </MuiTypography>
              <InputField
                id="email"
                placeholder="Email"
                type="email"
                name="email"
                {...INPUT_FIELD_PROPS}
                sx={INPUT_FIELD_STYLES.sx}
                {...formik.getFieldProps("email")}
                disabled={userData?.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.email}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
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
                onChange={(e) =>
                  formik.setFieldValue("genderId", e.target.value)
                }
                disabled={userData?.genderId}
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

              {/* {formik.touched.genderId && formik.errors.genderId ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.genderId}
                </MuiTypography>
              ) : null} */}
            </Box>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <Box width="100%">
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="phoneNumber"
                gutterBottom={true}
              >
                Phone Number
              </MuiTypography>

              <PhoneInput
                className="country-list"
                value={formik.values.phoneNumber}
                onChange={(value) => formik.setFieldValue("phoneNumber", value)}
                placeholder="Type your phone here"
                inputStyle={{
                  width: "100%",
                  height: "48px",
                  fontSize: "13px",
                  paddingLeft: "48px",
                  borderRadius: "5px",
                  // marginButton: "0px",
                  // .react-tel-input:marginButton:0px
                }}
                buttonStyle={{ borderRadius: "5px 0 0 5px" }}
                dropdownStyle={{ width: dropdownWidth }}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.phoneNumber}
                </MuiTypography>
              ) : null}
            </Box>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
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
                placeholder=" Current Address"
                type="text"
                name="address"
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

          <Box display="flex" justifyContent="flex-end" my="15px">
            <Button
              variant="contain"
              bg="#CCC"
              color="#4D4D4D"
              height="45px"
              radius="12px"
              sx={{ margin: "0px 10px" }}
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contain"
              bg="#E02828"
              color="#fff"
              height="45px"
              radius="12px"
              disabled={isLoading ? true : false}
            >
              {isLoading ? (
                <BeatLoader color="#fff" size="10px" />
              ) : userData ? (
                `${type === USER_ROLE.doctor ? "Edit Doctor" : "Edit Patient"}`
              ) : (
                `${type === USER_ROLE.doctor ? "Add Doctor" : "Add Patient"}`
              )}
            </Button>
          </Box>
        </Grid>
      )}
    </form>
  );
}
