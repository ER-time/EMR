"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { signIn, useSession } from "next-auth/react";
import { useRouter, redirect } from "next/navigation";

import { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import styled from "styled-components";
import BeatLoader from "react-spinners/BeatLoader";

import { Box, Button } from "@/components";
import MuiTypography from "@/components/core/Typography";
import InputField from "@/components/core/Input";
import { useLoginMutation } from "@/redux/slices/auth";
import { useDispatch } from "react-redux";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";

const StyledEyeIcon = styled.div`
  position: absolute;
  right: 16px;
  bottom: 22px;
  color: #999999;
`;
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [checkUserLoggedInState, setCheckUserLoggedInState] = useState(true);
  const [login, { isLoading, isError, error, isSuccess }] = useLoginMutation();
  const dispatch = useDispatch();
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const session = useSession();
  const router = useRouter();

  const initialValues = {
    email: "",
    password: "",
  };

  const onSubmit = (values) => {
    loginHandler(values);
  };

  const validationSchema = Yup.object({
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

  useEffect(() => {
    // setCheckUserLoggedInState(true);
    console.log("session::::::::::", session);
    if (session && session.status === "authenticated") {
      setCheckUserLoggedInState(false);
      router.push("/dashboard");
    } else {
      setCheckUserLoggedInState(false);
    }
  }, [session, router]);

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

  const loginHandler = async (values) => {
    try {
      let finalPayload = {
        emailAddress: values.email,
        password: values.password,
      };
      const resp = await login(finalPayload).unwrap();
      if (resp?.succeeded === true) {
        const signInResponse = await signIn("credentials", {
          email: values.email,
          password: values.password,
          otpCode: "000000",
          redirect: true,
          callbackUrl: "/dashboard",
        });
      } else {
        dispatch(
          onFailure({
            message: resp?.message || "Invalid Email address",
          })
        );
      }
    } catch (err) {
      console.log("err", err);
      dispatch(
        onFailure({
          message: err?.data?.message || "Failure",
        })
      );
    }
  };

  return (
    <div style={{ margin: "auto 0" }}>
      <Box my="20px">
        <MuiTypography variant="h3" component="h4">
          Sign In
        </MuiTypography>
        <MuiTypography
          variant="subtitle2"
          component="p"
          fontWeight="400"
          color="#979797"
          lineHeight="30px"
        >
          Login with your data that you entered during your registration.
        </MuiTypography>
      </Box>
      <Box mt="15px" width="100%">
        <form onSubmit={formik.handleSubmit}>
          <Box width="100%">
            <MuiTypography
              {...INPUT_LABEL_PROPS}
              htmlFor="email"
              gutterBottom={true}
            >
              Email
            </MuiTypography>
            <InputField
              type="email"
              id="email"
              placeholder="Enter your email"
              name="email"
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
              <StyledEyeIcon
                style={{ position: "absolute", top: "27px", right: "18px" }}
                onClick={handleClickShowPassword}
              >
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
          >
            {/* <FormGroup>
              <FormControlLabel
                control={<Checkbox style={{ color: "#979797" }} />}
                sx={{
                  color: "#979797",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
                label="Remember me"
              />
            </FormGroup> */}
            <Button
              variant="text"
              sx={{
                color: "#348AF4",
                fontSize: "14px",
                fontWeight: "500",
                textTransform: "capitalize",
                display: "block",
                marginLeft: "auto",
              }}
              onClick={() => router.push("/update-password")}
            >
              Forgot Password ?
            </Button>
          </Box>

          <Box width="100%" my="20px">
            <Button
              type="submit"
              variant="contain"
              bg="#E02828"
              color="#fff"
              width="100%"
              height="45px"
              disabled={isLoading ? true : false}
            >
              {isLoading ? <BeatLoader color="#fff" size="10px" /> : "Login"}
            </Button>
          </Box>
        </form>
        <Box
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <MuiTypography variant="body1" component="span" color="#979797">
            Don&apos;t have an Account?
          </MuiTypography>
          <Button
            variant="text"
            bg="none"
            onClick={() => router.push("/signup")}
            sx={{
              color: "#3C3A3B",
              fontSize: "18px",
              fontWeight: "500",
              textTransform: "capitalize",
              display: "inline",
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </div>
  );
}
