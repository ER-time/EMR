import { Grid } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Table from "@/components/core/Table";
import { Box, Button } from "@/components";
import MuiTypography from "@/components/core/Typography";
import { useGetAllAppointmentsMutation } from "@/redux/slices/appointments";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Loader1 } from "@/components/core/Loader/Loader";
import { ReturnCurrentTime, extractDateTimeComponents } from "@/lib/utils";
import { useRouter } from "next/navigation";
import moment from "moment";
import { USER_ROLE } from "@/config";
export default function Appointments() {
  const [getAllAppointments, { isLoading, data: appointmentData }] =
    useGetAllAppointmentsMutation();
  const currentTime = new Date();
  const session = useSession();
  const router = useRouter();
  const columns = (router) => [
    {
      header: "Patients",
      accessorKey: "patient",
      Cell: ({ cell }) => (
        <Box display="flex" alignItems="center">
          <MuiTypography variant="body2" component="span">
            {cell.row.original.patient}
          </MuiTypography>
        </Box>
      ),
    },
    {
      header: "Doctors",
      accessorKey: "doctor",
    },
    {
      header: "Appointment Date",
      accessorKey: "aptDate",
      accessorFn: (row) => {
        const { date } = extractDateTimeComponents(row?.startDateTime);
        return <div>{moment(date).format("MM/DD/YY")}</div>;
      },
    },
    {
      header: "Appointment Time",
      accessorKey: "aptTime",
      accessorFn: (row) => {
        const { time } = extractDateTimeComponents(row?.startDateTime);
        return <div>{moment.utc(row?.startDateTime).local().format("LT")}</div>;
      },
    },
    {
      header: "Appointment Fee",
      accessorKey: "amount",
      accessorFn: (row) => {
        return <div>$ {row.amount}</div>;
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      accessorFn: (row) => {
        const { startDateTime, endDateTime, status } = row;

        const slotStartTimeLocal = moment
          .utc(startDateTime)
          .local()
          .format("HH:mm:ss");
        const slotEndTimeLocal = moment
          .utc(endDateTime)
          .local()
          .format("HH:mm:ss");

        let currentTimeCheck = ReturnCurrentTime();
        // check if current date is equal to the start date
        const currentDate = new Date().toISOString().split("T")[0];
        const { date } = extractDateTimeComponents(startDateTime);
        // if (currentDate === date) {
        if (
          currentTimeCheck >= slotStartTimeLocal &&
          currentTimeCheck <= slotEndTimeLocal &&
          currentDate === date
        ) {
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                onClick={() => {
                  router.push(`/tele-communication/${row?.appointmentId}`);
                }}
                variant="contain"
                bg={"red"}
                color="#fff"
                width="45px"
                height="45px"
              >
                Join
              </Button>
            </div>
          );
        } else {
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <FiberManualRecordIcon
                sx={{ color: "#6c757d", marginRight: "5px", fontSize: "12px" }}
              />
              <p>{status}</p>
            </div>
          );
        }
        // }
      },
    },
  ];
  let userID = session?.data?.user?.user?.userId;

  useEffect(() => {
    const fetchData = async () => {
      const payload = {
        userId: userID,
        pageNo: 1,
        pageSize: 5,
        userRoleId: USER_ROLE.patient,
        // date: startDate,
      };
      const response = await getAllAppointments(payload);
    };
    if (userID) fetchData();
  }, [userID]);
  return (
    <Grid>
      <Grid item xs={12}>
        <TabelComponent
          columns={columns(router)}
          appointmentData={appointmentData}
          isLoading={isLoading}
          currentTime={currentTime}
        />
      </Grid>
    </Grid>
  );
}

const TabelComponent = ({
  appointmentData,
  isLoading,
  currentTime,
  columns,
}) => {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt="20px">
        <Loader1 />
      </Box>
    );
  }

  const handleClick = (data) => {};
  return (
    <>
      <Table
        columns={columns}
        data={appointmentData?.data || []}
        defaultColumn={{
          maxSize: 0,
          minSize: 0,
          size: 0,
        }}
        enableRowSelection={false}
        enableRowActions={false}
        onClick={(data) => handleClick(data)}
      />
    </>
  );
};
