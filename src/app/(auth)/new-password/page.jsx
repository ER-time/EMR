"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button } from "@/components";
import MuiTypography from "@/components/core/Typography";
import InputField from "@/components/core/Input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import WestIcon from "@mui/icons-material/West";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styled from "styled-components";
import BeatLoader from "react-spinners/BeatLoader";
import { useUpdatePasswordWithEncryptedMutation } from "@/redux/slices/auth";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";
import { useDispatch } from "react-redux";

const StyledEyeIcon = styled.div`
  position: absolute;
  right: 16px;
  bottom: 22px;
  color: #999999;
`;

export default function NewPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [
    updatePasswordWithEncrypted,
    { isLoading, isError, error, isSuccess },
  ] = useUpdatePasswordWithEncryptedMutation();

  const router = useRouter();

  const searchParams = useSearchParams();
  const encryptedValue = searchParams.get("value");
  const dispatch = useDispatch();
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const initialValues = {
    newPassword: "",
    confirmPassword: "",
  };

  const onSubmit = async (values) => {
    try {
      let finalPayload = {
        emailAddress: `http://localhost:3000/new-password?value=${encryptedValue}`,
        password: values.newPassword,
      };
      const resp = await updatePasswordWithEncrypted(finalPayload).unwrap();
      if (resp?.succeeded === true) {
        dispatch(
          onSuccess({
            message: "Password updated successfully" || "Success",
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

    router.push("/");
  };

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(8, "Password must be 8 characters long")
      .matches(/[0-9]/, "Password requires a number")
      .matches(/[a-z]/, "Password requires a lowercase letter")
      .matches(/[A-Z]/, "Password requires an uppercase letter")
      .matches(/[^\w]/, "Password requires a symbol")
      .required("New Password is Required!"),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("newPassword"), null],
        'Must match "new password"'
      )
      .required("Confirm Password is Required!"),
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
      <Box my={4}>
        <MuiTypography variant="h3" component="h4">
          Create New Password
        </MuiTypography>

        <MuiTypography
          variant="subtitle2"
          component="span"
          color="#979797"
          fontWeight="400"
        >
          Please create your new password for next time login
        </MuiTypography>
      </Box>
      <form onSubmit={formik.handleSubmit}>
        <Box width="100%">
          {console.log("formik", formik.errors)}
          <MuiTypography
            {...INPUT_LABEL_PROPS}
            htmlFor="newPassword"
            gutterBottom={true}
          >
            New Password
          </MuiTypography>
          <Box sx={{ position: "relative" }}>
            <InputField
              type={showPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              placeholder="Enter your password"
              {...INPUT_FIELD_PROPS}
              sx={INPUT_FIELD_STYLES.sx}
              {...formik.getFieldProps("newPassword")}
            />
            <StyledEyeIcon onClick={handleClickShowPassword}>
              {showPassword ? (
                <AiOutlineEye size={18} />
              ) : (
                <AiOutlineEyeInvisible size={18} />
              )}
            </StyledEyeIcon>
          </Box>
          {formik.touched.newPassword && formik.errors.newPassword ? (
            <MuiTypography variant="span" component="span" color="#E02828">
              {formik.errors.newPassword}
            </MuiTypography>
          ) : null}
        </Box>

        <Box width="100%">
          <MuiTypography
            {...INPUT_LABEL_PROPS}
            htmlFor="confirmPassword"
            gutterBottom={true}
          >
            Confirm Password
          </MuiTypography>
          <Box sx={{ position: "relative" }}>
            <InputField
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Enter your confirm password"
              {...INPUT_FIELD_PROPS}
              sx={INPUT_FIELD_STYLES.sx}
              {...formik.getFieldProps("confirmPassword")}
            />
            <StyledEyeIcon onClick={handleShowConfirmPassword}>
              {showConfirmPassword ? (
                <AiOutlineEye size={18} />
              ) : (
                <AiOutlineEyeInvisible size={18} />
              )}
            </StyledEyeIcon>
          </Box>
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <MuiTypography variant="span" component="span" color="#E02828">
              {formik.errors.confirmPassword}
            </MuiTypography>
          ) : null}
        </Box>

        <Box width="100%" my="20px">
          <Button
            //   onClick={(e) => loginHandler(e)}
            type="submit"
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
              "Update Password"
            )}
          </Button>
        </Box>
      </form>
      {/* <Box
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        my={2}
      >
        <WestIcon sx={{ fontSize: "18px", color: "#262D3D" }} />
        <Button
          variant="text"
          bg="none"
          onClick={() => router.push("/")}
          sx={{
            color: "#262D3D",
            fontSize: "18px",
            fontWeight: "500",
            textTransform: "capitalize",
            display: "inline",
          }}
        >
          Back To Sign In
        </Button>
      </Box> */}
    </div>
  );
}
