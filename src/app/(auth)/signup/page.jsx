"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";

import { Box, Button } from "@/components";
import MuiTypography from "@/components/core/Typography";
import InputField from "@/components/core/Input";
import { useQuickRegisterationMutation } from "@/redux/slices/auth";
import { useDispatch } from "react-redux";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";

const StyledEyeIcon = styled.div`
  position: absolute;
  right: 16px;
  bottom: 22px;
  color: #999999;
`;
export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [quickRegisteration, { isLoading, isError, error, isSuccess }] =
    useQuickRegisterationMutation();

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleInputChange = (event) => {
    const inputText = event.target.value;
    const alphabetsOnly = inputText.replace(/[^A-Za-z]/g, "");

    event.target.value = alphabetsOnly;
  };

  const onSubmit = async (values) => {
    try {
      let finalPayload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      };
      const resp = await quickRegisteration(finalPayload).unwrap();
      if (resp?.succeeded === true) {
        dispatch(
          onSuccess({
            message: resp?.message || "Success",
          })
        );
        router.push("/");
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
    email: Yup.string()
      .email("Invalid Email Format!")
      .required("Email is Required!"),
    password: Yup.string()
      .min(8, "Password must be 8 characters long")
      .matches(/[0-9]/, "Password requires a number")
      .matches(/[a-z]/, "Password requires a lowercase letter")
      .matches(/[A-Z]/, "Password requires an uppercase letter")
      .matches(/[^\w]/, "Password requires a symbol")
      .required("Password is Required!"),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

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
      margin: "10px 0px",
      "& fieldset": { border: "1px solid #E2E5ED" },
    },
  };

  return (
    <div style={{ margin: "auto 0" }}>
      <Box my="20px">
        <MuiTypography variant="h3" component="h4">
          Create new account
        </MuiTypography>
        <Box
          width="100%"
          display="flex"
          // justifyContent="center"
          alignItems="center"
        >
          <MuiTypography
            variant="subtitle2"
            component="span"
            color="#979797"
            fontWeight="400"
          >
            Already a member?
          </MuiTypography>
          <Button
            variant="text"
            bg="none"
            onClick={() => router.push("/")}
            sx={{
              color: "#E02828",
              fontSize: "17px",
              fontWeight: "400",
              display: "inline",
            }}
          >
            Login
          </Button>
        </Box>
      </Box>
      <Box mt="15px" width="100%">
        <form onSubmit={formik.handleSubmit}>
          <Box display="flex">
            <Box mr={1}>
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="firstName"
                gutterBottom={true}
              >
                First Name
              </MuiTypography>
              <InputField
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Enter your first name"
                {...INPUT_FIELD_PROPS}
                sx={INPUT_FIELD_STYLES.sx}
                {...formik.getFieldProps("firstName")}
                onInput={handleInputChange}
                // onChange={formik.handleChange}
                // onBlur={formik.handleBlur}
                value={formik.values.firstName}
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.firstName}
                </MuiTypography>
              ) : null}
            </Box>

            <Box ml={1}>
              <MuiTypography
                {...INPUT_LABEL_PROPS}
                htmlFor="lastName"
                gutterBottom={true}
              >
                Last Name
              </MuiTypography>
              <InputField
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Enter your last name"
                {...INPUT_FIELD_PROPS}
                sx={INPUT_FIELD_STYLES.sx}
                {...formik.getFieldProps("lastName")}
                onInput={handleInputChange}
                // onChange={formik.handleChange}
                // onBlur={formik.handleBlur}
                value={formik.values.lastName}
              />
              {formik.touched.lastName && formik.errors.lastName ? (
                <MuiTypography variant="span" component="span" color="#E02828">
                  {formik.errors.lastName}
                </MuiTypography>
              ) : null}
            </Box>
          </Box>
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
              placeholder="Enter your email"
              {...INPUT_FIELD_PROPS}
              sx={INPUT_FIELD_STYLES.sx}
              {...formik.getFieldProps("email")}
            />

            {formik.touched.email && formik.errors.email ? (
              <MuiTypography variant="span" component="span" color="#E02828">
                {formik.errors.email}
              </MuiTypography>
            ) : null}
          </Box>
          <Box width="100%">
            <MuiTypography
              {...INPUT_LABEL_PROPS}
              htmlFor="password"
              gutterBottom={true}
            >
              Password
            </MuiTypography> 
            <Box sx={{ position: "relative" }}>
              <InputField
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                {...INPUT_FIELD_PROPS}
                sx={INPUT_FIELD_STYLES.sx}
                {...formik.getFieldProps("password")}
              />
              <StyledEyeIcon onClick={handleClickShowPassword}>
                {showPassword ? (
                  <AiOutlineEye size={18} />
                ) : (
                  <AiOutlineEyeInvisible size={18} />
                )}
              </StyledEyeIcon>
            </Box>
            {formik.touched.password && formik.errors.password ? (
              <MuiTypography variant="span" component="span" color="#E02828">
                {formik.errors.password}
              </MuiTypography>
            ) : null}
          </Box>

          <Box width="100%" my="20px">
            <Button
              type="submit"
              // onClick={() => router.push("/otp-verification")}
              variant="contain"
              bg="#E02828"
              color="#fff"
              width="100%"
              height="45px"
              disabled={isLoading ? true : false}
            >
              {isLoading ? (
                <BeatLoader color="#fff" size="10px" />
              ) : (
                "Create Account"
              )}
            </Button>
          </Box>
        </form>
        <Box
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            variant="text"
            bg="none"
            // onClick={() => router.push("/")}
            sx={{
              color: "#324CD7",
              fontSize: "12px",
              fontWeight: "400",
              display: "inline",
            }}
          >
            Privacy and Terms & Conditions
          </Button>
        </Box>
      </Box>
    </div>
  );
}
