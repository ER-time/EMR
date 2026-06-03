"use client";

import { Grid, Paper } from "@mui/material";
import dynamic from "next/dynamic";

import CalendarView from "./parts/calendar";
import ChatList from "./parts/chatList";

const AppointmenChart = dynamic(() => import("./parts/appointmentChart"), {
  ssr: false,
});
const PatientChart = dynamic(() => import("./parts/patientsChart"), {
  ssr: false,
});
const WeeklyAppointments = dynamic(() => import("./parts/weeklyAppointments"), {
  ssr: false,
});

export default function DoctorDashboard() {
  const PAPER_PROPS = {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0px 0px 24px 0px #0000000A",
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={7} xl={8}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12} xl={6}>
              <Paper sx={{ ...PAPER_PROPS, display: "block", height: "100%" }}>
                <PatientChart />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={12} xl={6}>
              <Paper sx={{ ...PAPER_PROPS, display: "block", height: "100%" }}>
                <WeeklyAppointments />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={12} xl={6}>
              <Paper sx={{ ...PAPER_PROPS, display: "block", height: "100%" }}>
                <AppointmenChart />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={12} xl={6}>
              <Paper sx={{ ...PAPER_PROPS, display: "block", height: "100%" }}>
                <ChatList />
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={12} lg={5} xl={4}>
          <Paper
            sx={{
              ...PAPER_PROPS,
              display: "block",
              padding: "22px 38px 22px 26px",
              boxShadow: "1px 3px 8px 4px #6AA9370D",

            }}
          >
            <CalendarView />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
