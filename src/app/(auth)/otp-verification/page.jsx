"use client";

import { Box, Button } from "@/components";
import MuiTypography from "@/components/core/Typography";

import { useRouter, useSearchParams } from "next/navigation";

import { MuiOtpInput } from "mui-one-time-password-input";
import WestIcon from "@mui/icons-material/West";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import axios from "axios";
import { useReSendOtpMutation } from "@/redux/slices/auth";
import { useDispatch } from "react-redux";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";
import { BeatLoader } from "react-spinners";

export default function OtpVerification() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(null);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const searchParams = useSearchParams();
  const [reSendOtp, { isLoading, isError, error, isSuccess }] =
    useReSendOtpMutation();

  const email = searchParams.get("email");
  const dispatch = useDispatch();
  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds === 0) {
        clearInterval(myInterval);
      } else {
        setSeconds(seconds - 1);
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  console.log("searchParams", searchParams.get("name"));

  const onSubmit = async (values) => {
    if (otp === "") {
      setOtpError("Otp Code is Required");
      return;
    } else {
      setVerifyOtpLoading(true);
      const response = await signIn("credentials", {
        email: email,
        password: "123456aA@",
        otpCode: otp,
        redirect: true,
        callbackUrl: "/dashboard",
      });

      if (response?.error) {
        setVerifyOtpLoading(false);

        console.log("response at otp verifcation screen if", response);
      } else {
        dispatch(
          onSuccess({
            message: "Login Successful" || "Success",
          })
        );
        console.log("response at otp verifcation screen else");
        setVerifyOtpLoading(false);
      }
    }
  };

  const handleChange = (newValue) => {
    setOtpError(null);
    setOtp(newValue);
  };

  const resendOtpHandler = async () => {
    console.log("runing......");
    try {
      console.log("email", email);
      const resp = await reSendOtp({
        email: email,
      }).unwrap();
      if (resp?.succeeded === true) {
        setSeconds(59);
        dispatch(
          onSuccess({
            message:
              "An OTP code has been sent to your registered Email" || "Success",
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
      <Box maxWidth="420px" mx="auto">
        <Box my={4}>
          <MuiTypography variant="h3" component="h4" textAlign="center">
            OTP Code
          </MuiTypography>

          <MuiTypography
            variant="subtitle2"
            component="span"
            color="#979797"
            fontWeight="400"
          >
            Please enter the code below we’ve sent to your email
          </MuiTypography>
        </Box>

        <MuiOtpInput
          id="otpCode"
          name="otpCode"
          // {...formik.getFieldProps("otpCode")}
          sx={{ marginBottom: "10px" }}
          onChange={handleChange}
          value={otp}
        />
        {otpError ? (
          <MuiTypography
            sx={{ marginTop: 1 }}
            variant="span"
            component="span"
            color="#E02828"
          >
            {otpError}
          </MuiTypography>
        ) : null}
        <Box
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          my={2}
        >
          {seconds === 0 && (
            <Button
              variant="text"
              bg="none"
              sx={{
                color: "#999999",
                fontSize: "18px",
                fontWeight: "500",
                textTransform: "capitalize",
                display: "inline",
              }}
              disabled={isLoading ? true : false}
              onClick={resendOtpHandler}
            >
              {isLoading === true ? "Loading..." : "Resend"}
            </Button>
          )}

          {seconds > 0 && (
            <MuiTypography variant="body1" component="span" color="#000000">
              OTP Expire in {seconds < 10 ? `0${seconds}` : seconds} sec
            </MuiTypography>
          )}
        </Box>
      </Box>

      <Box width="100%" my="20px">
        <Button
          type="submit"
          variant="contain"
          bg="#E02828"
          color="#fff"
          width="100%"
          height="45px"
          onClick={() => onSubmit()}
          disabled={verifyOtpLoading ? true : false}
        >
          {verifyOtpLoading ? (
            <BeatLoader color="#fff" size="10px" />
          ) : (
            " Confirm Code "
          )}
        </Button>
      </Box>
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
