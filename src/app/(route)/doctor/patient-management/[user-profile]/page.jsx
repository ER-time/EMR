"use client";

import { Box } from "@/components";
import CustomTabPanel from "@/components/core/Tabs/tabPanel";
import DashboardLayout from "@/components/layout";
import { Grid } from "@mui/material";
import React from "react";
import Appointments from "./appointment";
import Medications from "./medications";
import ProfileDetails from "./profileDetails";
import BasicTabs from "@/components/core/Tabs";
import MedicalHistory from "./medicalHistory/index";
import PatientAssessment from "./patientAssessment";
import ChatView from "./patientAssessment/chat";

export default function UserProfile() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    // <DashboardLayout>
    <Grid container spacing={3}>
      <Grid item xs={12} md={5} lg={4} xl={3}>
        <Box
          bgcolor="#fff"
          boxShadow="0px 0px 24px 0px rgba(0, 0, 0, 0.04)"
          width="100%"
          borderRadius="12px"
        >
          <ProfileDetails />
        </Box>
      </Grid>
      <Grid item xs={12} md={7} lg={8} xl={9}>
        <BasicTabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{ border: "none" }}
          indicatorColor=""
          tabArray={[
            { label: "Appointments" },
            { label: "Medications" },
            { label: "Medical History" },
            { label: "Patient Assessment" },
            { label: "Chat History" },
          ]}
        >
          <CustomTabPanel value={value} index={0}>
            <Appointments />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Medications />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <MedicalHistory />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <PatientAssessment hideActions={false}/>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={4}>
            <ChatView />
          </CustomTabPanel>
        </BasicTabs>
      </Grid>
    </Grid>
    // </DashboardLayout>
  );
}
