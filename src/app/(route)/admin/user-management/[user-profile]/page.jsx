"use client";

import React from "react";
import { Grid } from "@mui/material";

import { Box } from "@/components";
import BasicTabs from "@/components/core/Tabs";
import CustomTabPanel from "@/components/core/Tabs/tabPanel";
import Appointments from "./appointment";
import Invoice from "./invoice";
import ProfileDetails from "./profileDetails";

export default function UserProfile() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
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
          tabArray={[{ label: "Appointment" }, { label: "Invoice" }]}
        >
          <CustomTabPanel value={value} index={0}>
            <Appointments />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Invoice />
          </CustomTabPanel>
        </BasicTabs>
      </Grid>
    </Grid>
  );
}
