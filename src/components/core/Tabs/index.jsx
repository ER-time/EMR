import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import styled from "styled-components";

const StyledTabs = styled(Tabs)`
  .MuiTab-root {
    background: #eaeaea;
    text-transform: capitalize;
    border-bottom: none;
    border-radius: 5px 5px 0px 0px;
    margin-right: 10px;
    font-size: 16px;
    font-weight: 400;
  }
  && {
    .Mui-selected {
      color: #e02828;
      font-size: 18px;
      background: #fff;
      font-weight: 700;
    }
  }
`;

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({ children, value, tabArray, onChange }) {
  return (
    <Box sx={{ width: "100%" }}>
      <StyledTabs
        value={value}
        onChange={onChange}
        aria-label="basic tabs example"
        sx={{ border: "none" }}
        indicatorColor=""
      >
        {tabArray.map((item, index) => (
          <Tab label={item.label} {...a11yProps(index)} key={index} />
        ))}
      </StyledTabs>

      {children}
    </Box>
  );
}
