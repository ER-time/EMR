"use client";

import React, { useState } from "react";
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import styled from "styled-components";

import { Box } from "@/components";
import MuiTypography from "@/components/core/Typography";

const StyledCalender = styled.div`
  .fc-h-event {
    border: none !important;
  }
  .fc-button-active {
    border: 1px solid #e02828 !important;
    color: #e02828 !important;
  }
  .fc .fc-button-primary {
    background-color: transparent !important;
    color: #b0b5b3;
    border: none;
    border-radius: 5px !important;
    box-shadow: none !important;
  }
  .fc-theme-standard th {
    background-color: #f2f2f2;
    border: none;
    padding: 10px 0px;
  }

  .appointment-calender-div a {
    color: #2e3130 !important;
  }

  .fc-button-group .fc-button-primary {
    margin-right: 8px !important;
  }
  .fc .fc-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  .fc .fc-button-group {
    position: relative;
    display: inline-flex;
    vertical-align: middle;
    margin-top: 3px;
  }
  .fc .fc-daygrid-day-frame {
    position: relative;
    min-height: 75%;
    height: 150px;
    text-align: center !important;
    overflow: auto !important;
  }
  .fc .fc-more-popover .fc-popover-body {
    min-width: 220px;
    padding: 10px;
    min-height: 79px !important;
    max-height: 284px !important;
    height: 100% !important;
    overflow: auto !important;
  }
  .appointment-event {
    padding: 4px !important;
    cursor: pointer !important;
  }
  .fc .fc-daygrid-more-link {
    text-decoration: none !important;
  }
  .appointment-calender-div a {
    color: #0d6efd;
    text-decoration: none !important;
  }
  .fc-header-toolbar .fc-toolbar-chunk div {
    display: flex;
    align-items: center;
  }
  @media (max-width: 1252px) {
    .fc .fc-toolbar.fc-header-toolbar {
      margin-bottom: 4.5rem;
    }
  }
  @media (max-width: 658px) {
    .fc .fc-toolbar.fc-header-toolbar {
      justify-content: center;
    }
  }
`;

const StyledFormControl = styled(FormControl)`
  && {
    position: absolute;
    right: 46px;
  }
  @media (max-width: 1252px) {
    left: 290px;
    top: 180px;
  }
  @media (max-width: 992px) {
    left: 130px;
    top: 180px;
  }
  @media (max-width: 658px) {
    top: 220px;
  }
`;

const events = [
  // {
  //   title: "Appointment for health",
  //   description: "10:00AM - 11:00AM",
  //   text: "Completed",
  //   start: "2023-09-01",
  //   end: "2023-09-02",
  //   backgroundColor: "#34C240",
  // },
  // {
  //   title: "Appointment for health",
  //   description: "10:00AM - 11:00AM",
  //   text: "Upcoming",
  //   start: "2023-09-03",
  //   end: "2023-09-04",
  //   backgroundColor: "#348AF4",
  // },
  // {
  //   title: "Appointment for health",
  //   description: "10:00AM - 11:00AM",
  //   text: "Cancelled",
  //   start: "2023-09-07",
  //   end: "2023-09-08",
  //   backgroundColor: "#D64242",
  // },
  // {
  //   title: "Appointment for health",
  //   description: "10:00AM - 11:00AM",
  //   text: "Pending",
  //   start: "2023-09-11",
  //   end: "2023-09-12",
  //   backgroundColor: "#FA9D47",
  // },
  // {
  //   title: "Appointment for health",
  //   description: "10:00AM - 11:00AM",
  //   text: "Upcoming",
  //   start: "2023-09-22",
  //   end: "2023-09-23",
  //   backgroundColor: "#348AF4",
  // },
  // {
  //   title: "Appointment for health",
  //   description: "10:00AM - 11:00AM",
  //   text: "Missed",
  //   start: "2023-09-26",
  //   end: "2023-09-27",
  //   backgroundColor: "#FF5E0E",
  // },
  // {
  //   title: "Appointment for health",
  //   description: "10:00AM - 11:00AM",
  //   text: "Missed",
  //   start: "2023-09-26",
  //   end: "2023-09-27",
  //   backgroundColor: "#FF5E0E",
  // },
  // {
  //   title: "Appointment for health",
  //   description: "10:00AM - 11:00AM",
  //   text: "Missed",
  //   start: "2023-09-26",
  //   end: "2023-09-27",
  //   backgroundColor: "#FF5E0E",
  // },
];

const eventContent = (info) => {
  return (
    <div
      style={{
        backgroundColor: info.backgroundColor,
        textAlign: "left",
        padding: "10px 10px",
        borderRadius: "20px",
      }}
    >
      <MuiTypography variant="subtitle1" component="h6">
        Appointment type
      </MuiTypography>
      <MuiTypography
        variant="body1"
        component="p"
        sx={{ fontSize: "12px" }}
        fontWeight="500"
      >
        {info.event.extendedProps.description}
      </MuiTypography>

      <MuiTypography
        variant="body1"
        component="p"
        sx={{ fontSize: "12px", mt: 1 }}
        fontWeight="500"
      >
        {info.event.extendedProps.text}
      </MuiTypography>
    </div>
  );
};

const INPUT_FIELD_STYLES_SEARCH = {
  sx: {
    margin: "10px 0px",
    width: "220px",
    height: "42px",
  },
};

export default function CalendarView() {
  const [event, setEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOptions, setSelectedOptions] = React.useState([]);

  const handleChange = (event) => {
    setSelectedOptions(event.target.value);
  };

  const options = [
    { label: "Missed", value: "missed" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Pending", value: "pending" },
  ];

  const handleEventClick = (info) => {
    setEvent(info.event);
    setShowModal(true);
  };

  return (
    <Box
      bgcolor="#fff"
      boxShadow="0px 0px 24px 0px rgba(0, 0, 0, 0.04)"
      width="100%"
      height="100%"
      borderRadius="12px"
      p={2}
    >
      <StyledCalender>
        <div className="appointment-calender-div">
          <StyledFormControl>
            <InputLabel id="demo-simple-select-label">
              All Appointments
            </InputLabel>
            <Select
              sx={INPUT_FIELD_STYLES_SEARCH.sx}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              multiple
              value={selectedOptions}
              onChange={handleChange}
              label="All Appointments "
              renderValue={(selected) => selected.join(", ")}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Checkbox checked={selectedOptions.includes(option.value)} />
                  <ListItemText primary={option.label} />
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>

          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              start: "dayGridMonth,timeGridWeek,timeGridDay",
              center: "prev,title,next",
              end: "",
            }}
            weekends={true}
            events={events}
            eventContent={eventContent}
            height={"80vh"}
            now={null}
            eventClick={handleEventClick}
            dayMaxEventRows={2}
            dayMaxEvent={true}
          />
        </div>
      </StyledCalender>
    </Box>
  );
}
