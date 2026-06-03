import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { Box, Button } from "@/components";
import { useFormik } from "formik";
import { useAddOrUpdateMutation } from "@/redux/slices/appointments";
import { useDispatch } from "react-redux";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";
import moment from "moment";
import "./stripe-form.css";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { BeatLoader } from "react-spinners";
import { useState } from "react";

const StripeForm = ({donationAmountRef,  doctorData, selectSingleButton,handleBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatSessionId = searchParams.get("sessionId");
  const [showLoading,setShowLoading]=useState(false)
  const patientData = session?.data?.user?.user;
  const [
    addOrUpdate,
    { data: addUpdateData, isLoading, isError, error, isSuccess },
  ] = useAddOrUpdateMutation();
  const formik = useFormik({
    initialValues: {
      cardNumber: "",
      cvcCode: "",
      cardExpiry: "",
    },
    onSubmit: handleSubmit,
  });

  async function handleSubmit() {
    try {
      const card = elements?.getElement(CardNumberElement);
      if (card) {
        const result = await stripe?.createToken(card);
        if (result?.error) {
          throw new Error(result.error.message);
        }
        const tokenId = result?.token?.id || "";
        let finalPayload = {
          appointmentId:0,
          doctorId: doctorData?.data?.userId || 32,
          patientId: patientData?.userId,
          startDateTime:
            selectSingleButton?.startDateTime ||
            moment(new Date()).format("YYYY-MM-DD"),
          endDateTime:
            selectSingleButton?.endDateTime ||
            moment(new Date()).format("YYYY-MM-DD"),
          amount: 100,
          token: tokenId,
          donationAmount:donationAmountRef.current || 0,
          chatSessionId: chatSessionId || "",
        };
        console.log("donationAmountRef:::",donationAmountRef.current);
        console.log("finalPayload:::",finalPayload);
        const resp = await addOrUpdate(finalPayload).unwrap();
      
        if (resp?.succeeded === true) {
          dispatch(
            onSuccess({
              message: "Appointment Booked Successfully" || "Success",
            })
          );
          setShowLoading(true)
          router.push('/patient/my-appointments')
        } else {
          dispatch(
            onFailure({
              message: resp?.message || "Failure",
            })
          );
        }
      }
    } catch (e) {
      dispatch(
        onFailure({
          message: e.message || "Failure",
        })
      );
      console.log("Error:", e);
    }
  }

  const elementStyles = {
    base: {
      fontSize: "16px",
      color: "black",
      "::placeholder": {
        color: "#DDDDDD",
      },
      backgroundColor: "#ffffff",
      padding: "10px 20px 11px",
      borderRadius: "20px",
      width: "100%",
    },
    invalid: {
      color: "red",
    },
    complete: {
      backgroundColor: "#00800015",
    },
  };

  return (
    <form onSubmit={formik.handleSubmit} className="example example3">
      <div className="fieldset">
        <div className="field1">
          <CardNumberElement
            options={{ style: elementStyles }}
            onBlur={formik.handleBlur}
          />
        </div>
        
        <div className="field">
          <CardCvcElement
            options={{ style: elementStyles }}
            onBlur={formik.handleBlur}
          />
        </div>
        <div className="field">
          <CardExpiryElement
            options={{ style: elementStyles }}
            onBlur={formik.handleBlur}
          />
        </div>
      </div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          pt: 2,
        }}
      >
        <Button
          type="submit"
          sx={{ mr: 1, fontSize: "18px" }}
          variant="contain"
          
          bg="#E02828"
          color="#FFFFFF"
          height="52px"
          radius="12px"
          width="164px"
          disabled={showLoading}
        >
        {(isLoading) ? <BeatLoader color="#fff" size="10px"/> : "Confirm"}  
        </Button>
        <Button
          onClick={handleBack}
          sx={{ mr: 1, border: "1px solid #999999 !important", fontSize: "18px" }}
          variant="contain"
          bg="transparent"
          color="#999999"
          height="52px"
          radius="12px"
          width="164px"
        >
          Back
        </Button>
      </Box>
    </form>
  );
};

export default StripeForm;
