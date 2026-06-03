"use client";
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Container,
  Typography,
  InputAdornment,
} from "@mui/material";
import styled from "styled-components";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import { Button } from "@/components";
import HorizontalCalendar from "./parts/horizontalCalendar";
import InputField from "@/components/core/Input";
import MuiTypography from "@/components/core/Typography";
import RequestQuestionsModal from "./parts/requestQuestions";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { useGetSingleDoctorQuery } from "@/redux/slices/doctors";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetDoctorSlotsQuery } from "@/redux/slices/sloting";
import moment from "moment";
import StripeForm from "./payment/stripe-form";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Loader1, LoaderTable } from "@/components/core/Loader/Loader";
import { useLazyGetDoctorSlotsQuery } from "@/redux/slices/user";
import { useCannotAffordMutation } from "@/redux/slices/chat";
import { useAddOrUpdateFreeAppointmnetMutation } from "@/redux/slices/appointments";
import { useDispatch } from "react-redux";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";
import { useSession } from "next-auth/react";
import { BeatLoader } from "react-spinners";

const QontoConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#999999",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#999999",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#999999",
    height: 100,
    marginLeft: 12,
  },
}));

const steps = [
  {
    id: "01",
    name: "Select date and time",
  },
  {
    id: "02",
    name: "Payment",
  },
];

const StyledBox = styled(Box)`
  @media (max-width: 739px) {
    width: 100% !important;
    display: flex;
    justify-content: end;
  }
`;
const INPUT_LABEL_PROPS = {
  variant: "subtitle1",
  component: "label",
  fontWeight: "500",
  spacing: "0.1px",
};

const StyledSidebar = styled(Box)`
  background: #ffffff;
  box-shadow: 0px 0px 24px 0px #0000000a;
  height: 100%;
  border-radius: 8px;
`;

const PAPER_PROPS = {
  backgroundColor: "#fff",
  boxShadow: "0px 0px 24px 0px #0000000A",
};

const INPUT_FIELD_PROPS = {
  label: "",
  fullWidth: true,
  variant: "standard",
};

const INPUT_FIELD_STYLES = {
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

const StyledHr = styled.hr`
  border: 1px solid #f2f3f2;
`;

const ColorlibStepIconRoot = styled("div")(({ ownerState }) => ({
  zIndex: 1,

  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid #999999",
  paddLeft: "200px",
  border: "1px solid #999999",
  color: "#999999",
  ...(ownerState.active && {
    backgroundColor: "#E02828",
    border: "none",
    color: "#fff",
  }),
  // ...(ownerState.completed && {
  //   border: "1px solid #999999",
  //   color: "#999999",
  // }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <CalendarTodayOutlinedIcon />,
    2: <PaymentsOutlinedIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

export default function BookAppointments() {
  const donationAmountRef = useRef(null);
  const [donationAmountError, setDonationAmountError] = useState("");
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectSingleButton, setSelectSingleButton] = useState(null);
  const [skipped, setSkipped] = useState(new Set());
  const [activeDate, setActiveDate] = useState(new Date());
  const searchParams = useSearchParams();
  const [selectedRadioButton, setSelectedRadioButton] = useState("Available");
  const router = useRouter();
  const dispatch = useDispatch();
  const session = useSession();
  const [showLoading, setShowLoading] = useState(false);
  const appointedDoctorId = searchParams.get("doctorId");
  const isAdminApproved = searchParams.get("isAdminApproved");
  const chatSessionId = searchParams.get("sessionId");
  console.log("chatSessionId::::", chatSessionId);
  const { data: doctorData, isLoading: isDoctorLoading } =
    useGetSingleDoctorQuery(appointedDoctorId);
  const [getDoctorSlots, { data: doctorSlots, isLoading }] =
    useLazyGetDoctorSlotsQuery({
      doctorId: appointedDoctorId,
      date: moment(activeDate).format("YYYY-MM-DD"),
    });

    console.log("doctorData::::",doctorData);

  const [
    CannotAfford,
    { data: CannotAffordData, isLoading: CannotAffordLoading },
  ] = useCannotAffordMutation();
  console.log("CannotAffordData::::", CannotAffordData);
  const [
    addOrUpdateFreeAppointmnet,
    {
      data: addOrUpdateFreeAppointmnetData,
      isLoading: addOrUpdateFreeAppointmnetLoading,
    },
  ] = useAddOrUpdateFreeAppointmnetMutation();

  const stripePromise = loadStripe(
    "pk_test_51L9UqtG0EzPHWgTDq0mLASG8axNG8G7x3TcjraB6UUKAyRAHm6ofJaQOLeidaTG6yO2CUf8rkLJwrxNVPQ5Cyqg400jo9SxLTM"
  );
  useEffect(() => {
    async function fetchSlots() {
      await getDoctorSlots({
        doctorId: appointedDoctorId,
        date: moment(activeDate).format("YYYY-MM-DD"),
      });
    }
    fetchSlots();
  }, [router, activeDate]);

  const callApiHandler = async () => {
    const response = await CannotAfford({ query: "i cant afford" });
  };

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    router.back();
    // setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // const handleReset = () => {
  //   setActiveStep(0);
  // };

  const donationAmountHandler = (event) => {
    donationAmountRef.current = event.target.value;
    const value = donationAmountRef.current.trim();
    console.log("value:::", value);
    if (value < 0) {
      setDonationAmountError("Enter a donation above $0");
    } else {
      setDonationAmountError("");
    }
  };
  //list booked slot array
  const filteredSlots = doctorSlots?.data?.filter((slotItem) => {
    if (selectedRadioButton === "Available") {
      return slotItem.status === "Available";
    } else if (selectedRadioButton === "Booked") {
      return slotItem.status === "Booked";
    }
    return true;
  });

  const handleBookAppointment = async () => {
    try {
      let finalPayload = {
        appointmentId: 0,
        doctorId: doctorData?.data?.userId,
        patientId: session?.data?.user?.user?.userId,
        startDateTime:
          selectSingleButton?.startDateTime ||
          moment(new Date()).format("YYYY-MM-DD"),
        endDateTime:
          selectSingleButton?.endDateTime ||
          moment(new Date()).format("YYYY-MM-DD"),
        amount: 0,
        donationAmount: 0,
        token: "string",
        chatSessionId: chatSessionId || "",
      };
      // return;

      const resp = await addOrUpdateFreeAppointmnet(finalPayload).unwrap();

      if (resp?.succeeded === true) {
        dispatch(
          onSuccess({
            message: "Appointment Booked Successfully" || "Success",
          })
        );
        setShowLoading(true);
        router.push("/patient/my-appointments");
      } else {
        dispatch(
          onFailure({
            message: resp?.message || "Failure",
          })
        );
      }
    } catch (e) {
      dispatch(
        onFailure({
          message: e.message || "Failure",
        })
      );
      console.log("Error:", e);
    }
  };
  console.log("doctorData:::", doctorData);
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            ...PAPER_PROPS,
            height: "100%",
            boxShadow: "none",
          }}
        >
          <StyledSidebar>
            <Box sx={{ padding: "30px" }}>
              <Stepper
                activeStep={activeStep}
                orientation="vertical"
                connector={<QontoConnector />}
              >
                {steps.map((label, index) => {
                  const stepProps = {};
                  const labelProps = {};
                  if (isStepSkipped(index)) {
                    stepProps.completed = false;
                  }
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel
                        {...labelProps}
                        StepIconComponent={ColorlibStepIcon}
                      >
                        <MuiTypography
                          variant="span"
                          component="span"
                          color="#969C9A"
                        >
                          Step {label?.id}
                        </MuiTypography>
                        <MuiTypography
                          variant="h6"
                          component="h6"
                          fontWeight="500"
                          color="#E02828"
                          lineHeight="24px"
                        >
                          {label?.name}
                        </MuiTypography>
                      </StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </Box>
          </StyledSidebar>
        </Paper>
      </Grid>
      <Grid item xs={12} md={8} lg={9}>
        <Paper sx={{ ...PAPER_PROPS, padding: "22px 38px 22px 26px" }}>
          {activeStep === 0 ? (
            <>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <MuiTypography
                  sx={{ mt: 2, mb: 1 }}
                  variant="h5"
                  component="h5"
                  fontWeight="500"
                  color="#000"
                >
                  Select Date and Time
                </MuiTypography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <MuiTypography
                    sx={{ mt: 2, mb: 1, mr: 2, cursor: "pointer" }}
                    variant="p"
                    component="p"
                    fontWeight="500"
                    color="#3E3E3E"
                    display="flex"
                    alignItems="center"
                    onClick={() => {
                      setSelectedRadioButton("Booked");
                    }}
                  >
                    <RadioButtonCheckedIcon
                      onClick={() => {
                        setSelectedRadioButton("Booked");
                      }}
                      sx={{
                        color:
                          selectedRadioButton === "Booked"
                            ? "#E02828"
                            : "#F2F3F2",
                        marginRight: "10px",
                      }}
                    />
                    Booked slots
                  </MuiTypography>
                  <MuiTypography
                    sx={{ mt: 2, mb: 1, cursor: "pointer" }}
                    variant="p"
                    component="p"
                    fontWeight="500"
                    color="#3E3E3E"
                    display="flex"
                    alignItems="center"
                    onClick={() => {
                      setSelectedRadioButton("Available");
                    }}
                  >
                    {" "}
                    <RadioButtonCheckedIcon
                      onClick={() => {
                        setSelectedRadioButton("Available");
                      }}
                      sx={{
                        color:
                          selectedRadioButton === "Available"
                            ? "#E02828"
                            : "#F2F3F2",
                        marginRight: "10px",
                      }}
                    />
                    Available slots
                  </MuiTypography>
                  {/* <Select
                    value={1}
                    // onChange={handleChange}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    label=""
                    // fullWidth={true}
                    sx={INPUT_FIELD_STYLES.sx}
                  >
                    <MenuItem value={1}>Today</MenuItem>
                    <MenuItem value={2}>Yesterday</MenuItem>
                    <MenuItem value={3}>Tomorrow</MenuItem>
                  </Select> */}
                </Box>
              </div>
              <MuiTypography
                sx={{ mb: 1 }}
                variant="p"
                component="p"
                fontWeight="400"
                color="#8D8D8D"
              >
                Select the suitable time slot for you.
              </MuiTypography>
              <HorizontalCalendar
                activeDate={activeDate}
                setActiveDate={setActiveDate}
                appointedDoctorId={appointedDoctorId}
              />
              <Grid container spacing={3}>
                {isLoading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      minHeight: "300px",
                    }}
                  >
                    <Loader1 />
                  </Box>
                ) : filteredSlots?.length > 0 ? (
                  filteredSlots?.map((slotItem) => (
                    <Grid
                      key={slotItem.doctorId}
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={3}
                    >
                      <SingleSlotButton
                        onClickFunc={() => setSelectSingleButton(slotItem)}
                        slotItem={slotItem}
                        selectSingleButton={selectSingleButton}
                      />
                    </Grid>
                  ))
                ) : (
                  <MuiTypography
                    style={{
                      display: "block",
                      textAlign: "center",
                      margin: "30px auto",
                    }}
                  >
                    No Slots Available
                  </MuiTypography>
                )}
              </Grid>
            </>
          ) : (
            <>
              {isDoctorLoading ? (
                <h1>
                  <LoaderTable />
                </h1>
              ) : (
                <>
                  <Box
                    sx={{ mb: 5 }}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    <Box>
                      <MuiTypography
                        sx={{ mt: 2, mb: 1 }}
                        variant="h5"
                        component="h5"
                        fontWeight="500"
                        color="#000"
                      >
                        Payment
                      </MuiTypography>
                      <MuiTypography
                        sx={{ mb: 1 }}
                        variant="p"
                        component="p"
                        fontWeight="400"
                        color="#8D8D8D"
                      >
                        Pay your payment to confirm your appointment.
                      </MuiTypography>
                    </Box>
                    {/* <StyledBox>
                      <Button
                        sx={{ mr: 1, fontSize: "18px" }}
                        variant="contain"
                        bg="#E02828"
                        color="#FFFFFF"
                        height="52px"
                        radius="12px"
                        width="164px"
                        onClick={() => {
                          setOpen(true);
                          callApiHandler();
                        }}
                      >
                        I can&apos;t Afford
                      </Button>
                    </StyledBox> */}
                  </Box>
                  <StyledHr />
                  <Box>
                    <MuiTypography
                      sx={{ mt: 2, mb: 3 }}
                      variant="h6"
                      component="h6"
                      fontWeight="500"
                      fontSize="24px"
                      color="#000"
                    >
                      Appointment details
                    </MuiTypography>
                    <Container>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Grid container>
                                <Grid
                                  item
                                  xs={12}
                                  display="flex"
                                  sx={{ pb: 2 }}
                                >
                                  <Typography
                                    variant="body1"
                                    component="p"
                                    color="#2E3130"
                                  >
                                    Name:
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    component="span"
                                    color="#000000"
                                    sx={{ pl: 1, fontWeight: "bold" }}
                                  >
                                    {doctorData?.data?.doctor || ""}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} display="flex">
                                  <Typography
                                    variant="body1"
                                    component="p"
                                    color="#2E3130"
                                  >
                                    Appt. Time:
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    component="span"
                                    color="#000000"
                                    sx={{ pl: 1, fontWeight: "bold" }}
                                  >
                                    {`${moment
                                      .utc(selectSingleButton?.startDateTime)
                                      .local()
                                      .format("LT")} - ${moment
                                      .utc(selectSingleButton?.endDateTime)
                                      .local()
                                      .format("LT")}`}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={6}>
                              <Grid container>
                                <Grid
                                  item
                                  xs={12}
                                  display="flex"
                                  sx={{ pb: 2 }}
                                >
                                  <Typography
                                    variant="body1"
                                    component="p"
                                    color="#2E3130"
                                  >
                                    Appt. Date:
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    component="span"
                                    color="#000000"
                                    sx={{ pl: 1, fontWeight: "bold" }}
                                  >
                                    {moment(
                                      selectSingleButton?.startDateTime
                                    ).format("D/M/YYYY") || "8/26/2023"}
                                  </Typography>
                                </Grid>
                                {/* <Grid item xs={12} display="flex">
                                  <Typography
                                    variant="body1"
                                    component="p"
                                    color="#2E3130"
                                  >
                                    Address:
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    component="span"
                                    color="#000000"
                                    sx={{ pl: 1, fontWeight: "bold" }}
                                  >
                                    {doctorData?.data?.address || "N/A"}
                                  </Typography>
                                </Grid> */}
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          {isAdminApproved === "false" && (
                            <Grid item xs={12}>
                              <Typography
                                {...INPUT_LABEL_PROPS}
                                htmlFor="donationAmount"
                                gutterBottom
                              >
                                Donation
                              </Typography>
                              <InputField
                                id="donationAmountId"
                                placeholder="Donation"
                                type="number"
                                name="donationAmount"
                                {...INPUT_FIELD_PROPS}
                                sx={INPUT_FIELD_STYLES.sx}
                                ref={donationAmountRef}
                                onChange={donationAmountHandler}
                                startAdornment={
                                  <InputAdornment position="start">
                                    $
                                  </InputAdornment>
                                }
                              />
                              {donationAmountError && (
                                <Typography
                                  variant="body2"
                                  component="span"
                                  color="#E02828"
                                >
                                  {donationAmountError}
                                </Typography>
                              )}
                            </Grid>
                          )}
                        </Grid>
                        <Grid item xs={6}>
                          <Grid item xs={12} display="flex" sx={{ pb: 2 }}>
                            <Typography
                              variant="body1"
                              component="p"
                              color="#2E3130"
                            >
                              Doctor Fee:
                            </Typography>
                            <Typography
                              variant="body1"
                              component="span"
                              color="#000000"
                              sx={{ pl: 1, fontWeight: "bold" }}
                            >
                              ${doctorData?.data?.doctorFee || 100}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Container>
                  </Box>
                  <StyledHr />
                  {isAdminApproved === "true" ? (
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "end",
                        mt: 5,
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
                        onClick={handleBookAppointment}
                        disabled={showLoading}
                      >
                        {showLoading ? (
                          <BeatLoader color="#fff" size="10px" />
                        ) : (
                          "Confirm"
                        )}
                      </Button>
                    </Box>
                  ) : (
                    <Elements stripe={stripePromise}>
                      <StripeForm
                        donationAmountRef={donationAmountRef}
                        doctorData={doctorData}
                        selectSingleButton={selectSingleButton}
                        handleBack={handleBack}
                        donationAmountError={donationAmountError}
                        setDonationAmountError={setDonationAmountError}
                      />
                    </Elements>
                  )}
                </>
              )}
            </>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              pt: 2,
            }}
          >
            {activeStep === 0 && (
              <Button
                // disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1, border: "1px solid #999999", fontSize: "18px" }}
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

            {activeStep === 0 && filteredSlots?.length > 0 && (
              <Button
                // disabled={!selectSingleButton}
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
                Next
              </Button>
            )}
          </Box>
          {open && (
            <RequestQuestionsModal
              open={open}
              CannotAffordLoading={CannotAffordLoading}
              handleClose={() => setOpen(false)}
              CannotAffordData={CannotAffordData}
            />
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}

// export async function getStaticProps() {
//   const filePath = path.join(process.cwd(), 'data', 'slotsList.json')
//   const jsonData = await fs.readFile(filePath);
//   const data = JSON.parse(jsonData);

//   return {
//     props: {
//       slotList: data.SlotList
//     }
//   }
// }

const SingleSlotButton = ({ slotItem, selectSingleButton, onClickFunc }) => {
  // Parse and convert start time from UTC to local time
  const slotStartTimeLocal = moment
    .utc(slotItem?.startDateTime)
    .local()
    .format("LT");

  // Parse and convert end time from UTC to local time
  const slotEndTimeLocal = moment
    .utc(slotItem?.endDateTime)
    .local()
    .format("LT");

  return (
    <Button
      disabled={slotItem.status === "Booked"}
      key={slotItem.id}
      variant="contain"
      bg={`${slotItem.status === "Booked" ? "#F2F2F2" : "#FCE9E9"}`}
      color={`${slotItem.status === "Booked" ? "#4A4F4D" : "#2E3130"}`}
      height="54px"
      radius="3px"
      width="100%"
      sx={{
        fontWeight: selectSingleButton === slotItem ? "700" : "500",
        border: selectSingleButton === slotItem ? "4px solid #E02828" : "none",
      }}
      onClick={onClickFunc}
    >
      {`${slotStartTimeLocal} - ${slotEndTimeLocal}`}
    </Button>
  );
};
