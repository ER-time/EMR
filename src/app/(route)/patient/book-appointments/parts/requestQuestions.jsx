import React, { useState } from "react";
import { FormControl, Grid } from "@mui/material";
import { Box, Button, GenericModal } from "@/components";
import MuiTypography from "@/components/core/Typography";
import InputField from "@/components/core/Input";
import { Loader1 } from "@/components/core/Loader/Loader";
import { useSession } from "next-auth/react";
import { getFormattedCurrentDate } from "@/lib/utils";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";
import { useSaveOrUpdateCantAffordMutation } from "@/redux/slices/iCantAfford";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

const INPUT_LABEL_PROPS = {
  variant: "subtitle1",
  component: "label",
  fontWeight: "600",
  spacing: "0.1px",
  margin: "0px 0px 12px 0px",
};

const INPUT_FIELD_PROPS = {
  label: "",
  fullWidth: true,
  variant: "standard",
  multiline: true,
  minRows: 4,
  inputProps: { maxLength: 300 }, // Restrict to 200 characters
};

export default function RequestQuestionsModal({
  open,
  handleClose,
  CannotAffordData,
  CannotAffordLoading,
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const session = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const [saveOrUpdateCantAfford, { isLoading }] =
    useSaveOrUpdateCantAffordMutation();

  const questionArray =
    CannotAffordData?.data?.question?.map((currentQuestion) => ({
      questionText: currentQuestion,
    })) || [];

  const isStepSkipped = (step) => skipped.has(step);

  const handleNext = () => {
    if (!answers[activeStep]) {
      setError("Answer is required.");
      return;
    }
    setError("");

    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    if (activeStep === questionArray.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };

  const handleBack = () =>
    setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const handleAnswerChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[activeStep] = e.target.value;
    setAnswers(newAnswers);
  };

  const currentDateTime = getFormattedCurrentDate();

  const handleSubmit = async () => {
    const submissionData = questionArray.reduce((acc, question, index) => {
      acc[`question${index + 1}`] = question.questionText;
      acc[`answer${index + 1}`] = answers[index] || "";
      return acc;
    }, {});

    const payload = {
      ...submissionData,
      patientId: session?.data?.user?.user?.userId,
      createAt: currentDateTime,
      iCantAffordDetailId: 0,
    };
    try {
      const resp = await saveOrUpdateCantAfford(payload);
      if (resp?.data?.succeeded === true) {
        setSubmissionSuccess(true);
      } else {
        dispatch(onFailure({ message: resp?.data?.message || "Failure" }));
        setSubmissionSuccess(false);
      }
    } catch (error) {
      dispatch(onFailure({ message: error.message || "Failure" }));
      setSubmissionSuccess(false);
    }
  };

  return (
    <GenericModal
      sx={{
        "& > .MuiBox-root": {
          background: "red",
        },
      }}
      show={open}
      onHide={() => {
        submissionSuccess ? router.push("/dashboard") : handleClose();
        handleClose();
      }}
      tittle={
        submissionSuccess
          ? "All Steps Completed"
          : activeStep === questionArray.length
          ? "Enter Answers to Questions"
          : "Enter Answers to Questions"
      }
    >
      {CannotAffordLoading ? (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "30vh",
          }}
        >
          <Loader1 />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <Box sx={{ width: "100%" }}>
              {submissionSuccess ? (
                <Box>
                  <Box
                    width="full-width"
                    height="full-height"
                    borderRadius="12px"
                    sx={{ p: 2, background: "#FA9D47" }}
                  >
                    <MuiTypography color="#fff" textAlign="center">
                      Your request has been sent to Admin for Approval
                    </MuiTypography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "end",
                      mt: 5,
                    }}
                  >
                    <Button
                      onClick={() => {
                        router.push("/dashboard");
                        handleClose();
                      }}
                      sx={{
                        mr: 1,
                        border: "1px solid #999999",
                        fontSize: "18px",
                      }}
                      variant="contain"
                      bg="red"
                      color="white"
                      height="52px"
                      radius="12px"
                      width="164px"
                    >
                      Close
                    </Button>
                  </Box>
                </Box>
              ) : (
                <React.Fragment>
                  <FormControl fullWidth>
                    <MuiTypography
                      {...INPUT_LABEL_PROPS}
                      htmlFor={`question${activeStep + 1}`}
                      gutterBottom={true}
                    >
                      {questionArray[activeStep]?.questionText}
                    </MuiTypography>
                    <Grid item xs={12}>
                      <Box>
                        <InputField
                          id="answer"
                          placeholder="Enter answer"
                          type="text"
                          name="answer"
                          {...INPUT_FIELD_PROPS}
                          value={answers[activeStep] || ""}
                          onChange={handleAnswerChange}
                        />
                        <MuiTypography
                          sx={{ display: "flex", justifyContent: "end" }}
                          variant="caption"
                          color="textSecondary"
                        >
                          {`${answers[activeStep]?.length || 0}/300`}
                        </MuiTypography>
                        {error && (
                          <MuiTypography color="#E02828">{error}</MuiTypography>
                        )}
                      </Box>
                    </Grid>
                  </FormControl>
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    {activeStep === 0 ? (
                      <Button
                        onClick={handleClose}
                        sx={{
                          mr: 1,
                          border: "1px solid #999999",
                          fontSize: "18px",
                        }}
                        variant="contain"
                        bg="transparent"
                        color="#999999"
                        height="52px"
                        radius="12px"
                        width="164px"
                      >
                        Cancel
                      </Button>
                    ) : (
                      <Button
                        onClick={handleBack}
                        sx={{
                          mr: 1,
                          border: "1px solid #999999",
                          fontSize: "18px",
                        }}
                        variant="contain"
                        bg="transparent"
                        color="#999999"
                        height="52px"
                        radius="12px"
                        width="164px"
                      >
                        Back
                      </Button>
                    )}
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Button
                      onClick={handleNext}
                      type="submit"
                      sx={{ mr: 1, fontSize: "18px" }}
                      variant="contain"
                      bg="#E02828"
                      color="#FFFFFF"
                      height="52px"
                      radius="12px"
                      width="164px"
                    >
                      {activeStep === questionArray.length - 1
                        ? "Done"
                        : "Next"}
                    </Button>
                  </Box>
                </React.Fragment>
              )}
            </Box>
          </Grid>
        </Grid>
      )}
    </GenericModal>
  );
}
