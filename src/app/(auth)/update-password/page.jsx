"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import WestIcon from "@mui/icons-material/West";

import { Box, Button } from "@/components";
import MuiTypography from "@/components/core/Typography";
import InputField from "@/components/core/Input";
import BeatLoader from "react-spinners/BeatLoader";
import { useSendLinkForPasswordResetMutation } from "@/redux/slices/auth";
import { useDispatch } from "react-redux";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";

export default function ForgotPassword() {
  const router = useRouter();
  const dispatch = useDispatch();

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid Email Format!")
      .required("Email is Required!"),
  });

  const [sendLinkForPasswordReset, { isLoading, isError, error, isSuccess }] =
    useSendLinkForPasswordResetMutation();

  const onSubmit = async (values) => {
    try {
      const resp = await sendLinkForPasswordReset({
        email: values?.email,
      }).unwrap();
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
      <Box>
        <MuiTypography variant="h3" component="h4">
          Forgot Password
        </MuiTypography>

        <MuiTypography
          variant="subtitle2"
          component="span"
          color="#979797"
          fontWeight="400"
        >
          Enter your Email, We will send you a reset link.
        </MuiTypography>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Box width="100%">
          {/* <MuiTypography
            {...INPUT_LABEL_PROPS}
            htmlFor="email"
            gutterBottom={true}
          >
            Email
          </MuiTypography> */}
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

        {/* <Box width="100%">
          <MuiTypography
            {...INPUT_LABEL_PROPS}
            htmlFor="password"
            gutterBottom={true}
          >
            Password
          </MuiTypography>
          <InputField
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            {...INPUT_FIELD_PROPS}
            sx={INPUT_FIELD_STYLES.sx}
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password ? (
            <MuiTypography variant="span" component="span" color="#E02828">
              {formik.errors.password}
            </MuiTypography>
          ) : null}
        </Box> */}

        {/* <Box width="100%">
          <MuiTypography
            {...INPUT_LABEL_PROPS}
            htmlFor="confirmPassword"
            gutterBottom={true}
          >
            Confirm Password
          </MuiTypography>
          <InputField
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Enter your confirm password"
            {...INPUT_FIELD_PROPS}
            sx={INPUT_FIELD_STYLES.sx}
            {...formik.getFieldProps("confirmPassword")}
          />
          {console.log("formik.errors", formik.errors)}
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <MuiTypography variant="span" component="span" color="#E02828">
              {formik.errors.confirmPassword}
            </MuiTypography>
          ) : null}
        </Box> */}

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
            {isLoading ? <BeatLoader color="#fff" size="10px" /> : "Send Link"}
          </Button>
        </Box>
      </form>
      <Box
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
      </Box>
    </div>
  );
}
