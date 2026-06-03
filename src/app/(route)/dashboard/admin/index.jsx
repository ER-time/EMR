"use client";

import { Grid, Paper } from "@mui/material";
import MuiTypography from "@/components/core/Typography";
import { Box } from "@/components";
import UserList from "./parts/userList";
import Link from "next/link";
import styled from "styled-components";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { FaUserMd } from "react-icons/fa";
import AppointmentsList from "./parts/appointmentsList";
import { useEffect } from "react";
import { useGetCountDataMutation } from "@/redux/slices/dashboard";
import { useDispatch } from "react-redux";
import { onFailure } from "@/redux/features/apiStatusSlice";
import { Loader1 } from "@/components/core/Loader/Loader";

const AppointmenChart = dynamic(() => import("./parts/appointmentChart"), {
  ssr: false,
});
const PatientChart = dynamic(() => import("./parts/patientsChart"), {
  ssr: false,
});
const WeeklyAppointments = dynamic(() => import("./parts/weeklyAppointments"), {
  ssr: false,
});

const StyledLink = styled(Link)`
  font-size: 14px;
  color: #999999;
  font-weight: 400;
  text-decoration: none;
  display: flex;
  align-items: center;
`;

export default function AdminDashboard() {
  const { status, data } = useSession();
  const [getCountData, { data: countData, isLoading }] =
    useGetCountDataMutation();
  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchCountData() {
      try {
        const resp = await getCountData();
        if (resp?.succeeded === true) {
          dispatch(
            onSuccess({
              message: "",
            })
          );
        }
      } catch (error) {
        dispatch(
          onFailure({
            message: "unable to show count data",
          })
        );
      }
    }
    if (data) fetchCountData();
  }, [data]);
  const PAPER_PROPS = {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0px 0px 24px 0px rgba(0, 0, 0, 0.04)",
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={4}>
          <Paper sx={{ ...PAPER_PROPS, padding: "22px 38px 22px 26px" }}>
            <div>
              <MuiTypography
                color="#1A1A1A"
                variant="h6"
                component="h6"
                fontWeight="500"
              >
                Total Appointments
              </MuiTypography>
              {isLoading ? (
                <Loader1 />
              ) : (
                <MuiTypography
                  color="#1A1A1A"
                  variant="h2"
                  component="h2"
                  fontWeight="600"
                >
                  {countData?.data?.totalAppts}
                </MuiTypography>
              )}
            </div>
            <Image
              src={"/images/calendar-filled.png"}
              loading="lazy"
              alt="calendar-img"
              width={46}
              height={46}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper sx={{ ...PAPER_PROPS, padding: "22px 38px 22px 26px" }}>
            <div>
              <MuiTypography
                color="#1A1A1A"
                variant="h6"
                component="h6"
                fontWeight="500"
              >
                Total Patients
              </MuiTypography>
              {isLoading ? (
                <Loader1 />
              ) : (
                <MuiTypography
                  color="#1A1A1A"
                  variant="h2"
                  component="h2"
                  fontWeight="600"
                >
                  {countData?.data?.totalPatients}
                </MuiTypography>
              )}
            </div>
            <Image
              src={"/images/total-users.png"}
              loading="lazy"
              alt="users-img"
              width={46}
              height={46}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper sx={{ ...PAPER_PROPS, padding: "22px 38px 22px 26px" }}>
            <Box>
              <MuiTypography
                color="#1A1A1A"
                variant="h6"
                component="h6"
                fontWeight="500"
              >
                Total Doctors
              </MuiTypography>
              {isLoading ? (
                <Loader1 />
              ) : (
                <MuiTypography
                  color="#1A1A1A"
                  variant="h2"
                  component="h2"
                  fontWeight="600"
                >
                  {countData?.data?.totalDoctors}
                </MuiTypography>
              )}
            </Box>
            <Box display="flex" justifyContent="end">
              <FaUserMd size={44} color="#E02726" />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={6} xl={8}>
          <Paper sx={PAPER_PROPS}>
            <Box width="100%">
              <AppointmentsList />
            </Box>
          </Paper>

          <Paper sx={{ ...PAPER_PROPS, my: "20px" }}>
            <Box width="100%">
              <UserList />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={6} xl={4}>
          <Paper
            sx={{ ...PAPER_PROPS, display: "block", marginBottom: "20px" }}
          >
            <AppointmenChart />
          </Paper>
          <Paper
            sx={{ ...PAPER_PROPS, display: "block", marginBottom: "20px" }}
          >
            <PatientChart />
          </Paper>
          <Paper
            sx={{ ...PAPER_PROPS, display: "block", marginBottom: "20px" }}
          >
            <WeeklyAppointments />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
