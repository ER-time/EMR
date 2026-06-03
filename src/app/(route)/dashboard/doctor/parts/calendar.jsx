import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { AppointmentCard, Box } from "@/components";
import SlidingCalendar from "./slidingCalendar";
import MuiTypography from "@/components/core/Typography";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useGetAllAppointmentsMutation } from "@/redux/slices/appointments";
import { USER_ROLE } from "@/config";
import { Loader1 } from "@/components/core/Loader/Loader";
import { convertDateToISOFormat } from "@/lib/utils";


export default function CalendarView() {
  const [activeDate, setActiveDate] = useState(new Date());
  const router = useRouter();
  const session = useSession();
  let userID = session?.data?.user?.user?.userId;
  const [getAllAppointments, { isLoading, data: appointmentData }] =
    useGetAllAppointmentsMutation();

  useEffect(() => {
    const fetchData = async () => {
      await getAllAppointments({
        userId: userID,
        pageNo: 1,
        pageSize: 35,
        userRoleId: USER_ROLE.doctor,
        startDate: convertDateToISOFormat(activeDate),
        endDate: convertDateToISOFormat(activeDate),
        // statusId: null,
        // date: startDate,
      });
    };
    fetchData();
  }, [userID, activeDate]);

  return (
    <div>
      <SlidingCalendar setActiveDate={setActiveDate} activeDate={activeDate} />
      <Box>
        {isLoading ? <Loader1/> : appointmentData?.totalCounts === 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginBottom:'20px'
          }}
        >
          No Record to show
        </div>
      ) : appointmentData?.data?.map((item, index) => (
          <div key={index} >
            <AppointmentCard  key={index} data={item} />
          </div>
        ))}
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ cursor: "pointer" }}
      >
        <MuiTypography
          variant="body2"
          component="span"
          color="#0B1406"
          fontWeight="400"
          sx={{ mx: "10px", my: "22px" }}
          fontSize="16px"
          display="flex"
          alignItems="center"
          onClick={() => router.push("/doctor/appointments")}
        >
          See more
          <ChevronRightIcon sx={{ fontSize: "24px", color: "#2E3130" }} />
        </MuiTypography>
      </Box>
    </div>
  );
}
