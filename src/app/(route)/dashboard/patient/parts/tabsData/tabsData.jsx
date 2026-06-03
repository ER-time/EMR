import * as React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import { Grid, Paper } from "@mui/material";

import { Box } from "@/components";
import BasicTabs from "@/components/core/Tabs";
import Appointments from "./appointments";
import Medications from "./medications";
import styled from "styled-components";

const ScrollablePaper = styled(Paper)`
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    width: 0;
    display: none;
  }
`;

const PAPER_PROPS = {
  display: "flex",
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
  backgroundColor: "#fff",
  height: "430px",
  overflow: "auto",
  boxShadow: "0px 1px 0px 0px #0000000A",
  borderRadius: "0px 12px 12px 12px",
};

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ width: "100%", height: "100%" }}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function TabsData() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <BasicTabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
        indicatorColor=""
        tabArray={[
          { label: "Appointment" },
          { label: "Medications" },
          // { label: "Medical History" },
          // { label: "Patient Assessment" },
          // { label: "Chat History" },
        ]}
      >
        <ScrollablePaper sx={{ ...PAPER_PROPS }}>
          <CustomTabPanel value={value} index={0}>
            <Appointments />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Medications />
          </CustomTabPanel>
          {/* <CustomTabPanel value={value} index={2}>
            <MedicalHistory />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <PatientAssessment />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={4}>
            <ChatView />
          </CustomTabPanel> */}
        </ScrollablePaper>
      </BasicTabs>
    </>
  );
}
