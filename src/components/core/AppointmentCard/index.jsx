import styled from "styled-components";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import { Box } from "..";
import MuiTypography from "../Typography";
import moment from "moment";
import { APPOINTMENT_STATUSES } from "@/config";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { ReturnCurrentTime, extractDateTimeComponents } from "@/lib/utils";

const StyldAppointmentCard = styled(Box)`
  :hover {
    background: ${(props) =>
      props.status === "Booked"
        ? "#faba3111"
        : props.status === "Completed"
        ? "#ebfaec"
        : props.status === "Cancelled"
        ? "#d6424232"
        : props.status === "Upcoming"
        ? "#348af416"
        : props.status === "Missed"
        ? "#ff5e0e1a"
        : ""};
  }
  border-color: ${(props) =>
    props.status === "Booked"
      ? "#FABA31"
      : props.status === "Completed"
      ? "#34C240"
      : props.status === "Cancelled"
      ? "#D64242"
      : props.status === "Upcoming"
      ? "#348AF4"
      : props.status === "Missed"
      ? "#FF5E0E"
      : ""};
  h5,
  svg {
    color: ${(props) =>
      props.status === "Booked"
        ? "#FABA31"
        : props.status === "Completed"
        ? "#34C240"
        : props.status === "Cancelled"
        ? "#D64242"
        : props.status === "Upcoming"
        ? "#348AF4"
        : props.status === "Missed"
        ? "#FF5E0E"
        : ""};
  }
`;

export default function AppointmentCard({ data }) {
  const router = useRouter();

  const slotStartTimeLocal = moment
    .utc(data?.startDateTime)
    .local()
    .format("HH:mm:ss");

  const slotEndTimeLocal = moment
    .utc(data?.endDateTime)
    .local()
    .format("HH:mm:ss");

  let currentTimeCheck = ReturnCurrentTime();
  const currentDate = new Date().toISOString().split("T")[0];
  const { date } = extractDateTimeComponents(data?.startDateTime);
  console.log("date::::",date);
  return (
    <StyldAppointmentCard
      display="flex"
      borderRadius="6px"
      sx={{ border: "2px solid #F2F3F2", cursor: "pointer" }}
      p={2}
      my={3}
      status={data.status}
    >
      <Box sx={{ flex: 1 }}>
        <AccessTimeFilledIcon
          sx={{
            color: `${
              data.statusId === APPOINTMENT_STATUSES.BOOKED
                ? "#E02828"
                : data.statusId === APPOINTMENT_STATUSES.COMPLETED
                ? "#34C240"
                : data.statusId === APPOINTMENT_STATUSES.CANCELED
                ? "#D64242"
                : data.statusId === APPOINTMENT_STATUSES.UPCOMING
                ? "#348AF4"
                : data.statusId === APPOINTMENT_STATUSES.MISSED
                ? "#FF5E0E"
                : ""
            }`,
          }}
        />
      </Box>
      <Box ml={1}>
        <MuiTypography
          variant="body2"
          component="h5"
          fontWeight="500"
          color="#2E3130"
        >
          {moment
            .utc(data.startDateTime)
            .local()
            .format("dddd MMMM D, YYYY [at] h:mm A")}
        </MuiTypography>
        <Box my={1}>
          <MuiTypography
            variant="body2"
            component="h6"
            fontWeight="400"
            color="#969C9A"
          >
            Appointment Status
          </MuiTypography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <MuiTypography
            variant="body2"
            component="h6"
            fontWeight="400"
            color="#2E3130"
          >
            {data.status}
          </MuiTypography>
          <Box
            bgcolor={`${
              data.statusId === APPOINTMENT_STATUSES.BOOKED
                ? "#E02828"
                : data.statusId === APPOINTMENT_STATUSES.COMPLETED
                ? "#34C240"
                : data.statusId === APPOINTMENT_STATUSES.CANCELED
                ? "#F6D5D5"
                : data.statusId === APPOINTMENT_STATUSES.UPCOMING
                ? "#E7F1FE"
                : data.statusId === APPOINTMENT_STATUSES.MISSED
                ? "#FFDDCC"
                : ""
            }`}
            width="fit-content"
            px={2}
            py={1}
            borderRadius="50px"
          >
            {currentTimeCheck >= slotStartTimeLocal &&
            currentTimeCheck <= slotEndTimeLocal &&
            data.statusId !== APPOINTMENT_STATUSES.COMPLETED &&
            currentDate === date ? (
              <Button
                onClick={() => {
                  router.push(`/tele-communication/${data?.appointmentId}`);
                }}
                variant="contain"
                bg={"red"}
                color="#fff"
                width="100%"
                height="45px"
                sx={{ p: 0, fontSize: "12px" }}
              >
                {"Join"}
              </Button>
            ) : (
              <MuiTypography
                variant="body2"
                component="h6"
                fontWeight="400"
                color={`${
                  data.statusId === APPOINTMENT_STATUSES.BOOKED
                    ? "#ffffff"
                    : data.statusId === APPOINTMENT_STATUSES.COMPLETED
                    ? "#fff"
                    : data.statusId === APPOINTMENT_STATUSES.CANCELED
                    ? "#D64242"
                    : data.statusId === APPOINTMENT_STATUSES.UPCOMING
                    ? "#348AF4"
                    : data.statusId === APPOINTMENT_STATUSES.MISSED
                    ? "#FF5E0E"
                    : ""
                }`}
                sx={{ fontSize: "12px" }}
              >
                {data.status}
              </MuiTypography>
            )}
          </Box>
        </Box>
      </Box>
    </StyldAppointmentCard>
  );
}
