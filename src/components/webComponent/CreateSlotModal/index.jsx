import React from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { GenericModal } from "@/components/core";
import PropTypes from "prop-types";
import SingleSlot from "./SingleSlot";
import RecurringSlot from "./RecurringSlot";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
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

export default function CreateSlotModal({ open, handleClose, tittle }) {
  const [value, setValue] = React.useState("one");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <GenericModal show={open} onHide={handleClose} tittle={tittle}>
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="tabs example"
          textColor="inherit"
          TabIndicatorProps={{
            style: { background: "#e02828" },
          }}
        >
          <Tab
            style={{ textTransform: "capitalize" }}
            value="one"
            label="Single Slot"
          />
          <Tab
            style={{ textTransform: "capitalize" }}
            value="two"
            label="Recurring Slot"
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={"one"}>
        <SingleSlot onHide={handleClose} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={"two"}>
        <RecurringSlot onHide={handleClose} />
      </CustomTabPanel>
    </GenericModal>
  );
}
