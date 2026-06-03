"use client";

import { Grid, Paper } from "@mui/material";
import dynamic from "next/dynamic";

import CalendarView from "./parts/calendar";
const TabsData = dynamic(() => import("./parts/tabsData/tabsData"), {
  ssr: false,
});
const FirstAidChart = dynamic(() => import("./parts/firstAidChart"), {
  ssr: false,
});
const TotalAppointments = dynamic(() => import("./parts/totalAppointments"), {
  ssr: false,
});

export default function PatientDashboard() {
  const PAPER_PROPS = {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0px 0px 24px 0px #0000000A",
    display: "block",

  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={7} xl={8}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12} xl={6}>
              <Paper sx={{ ...PAPER_PROPS, height: "100%" }}>
                <TotalAppointments />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={12} xl={6}>
              <Paper sx={{ ...PAPER_PROPS, height: "100%" }}>
                <FirstAidChart />
              </Paper>
            </Grid>
            <Grid item xs={12} md={12}>
              <TabsData />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} lg={5} xl={4}>
          <Paper
            sx={{
              ...PAPER_PROPS,
              padding: "22px 38px 22px 26px",
            }}
          >
            <CalendarView />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
