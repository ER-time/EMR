"use client";

import React, { useEffect, useState } from "react";
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  Menu,
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
import { useGetAllAppointmentsMutation } from "@/redux/slices/appointments";
import { APPOINTMENT_STATUSES } from "@/config";
import moment from "moment";

const StyledCalender = styled.div`
  .fc-h-event {
    border: none !important;
  }
  .fc-button-active {
    border: 1px solid #e02828 !important;
    color: #e02828 !important;
    text-transform: capitalize;
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

  .fc .fc-button-primary.fc-customSelectBox-button {
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    color: #333333;
    font-weight: 500;
    font-size: 14px;
    min-width: 150px;
    width: 100%;
  }

  .fc-scrollgrid-shrink span {
    text-transform: capitalize;
  }
  .fc-timegrid-slot-label-frame,
  .fc-scrollgrid-sync-inner {
    text-align: center;
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

// const events = [
//   {
//     title: "Appointment for health",
//     description: "10:00 AM - 11:00 AM",
//     text: "Completed",
//     start: "2024-05-01",
//     end: "2024-05-02",
//     backgroundColor: "#34C240",
//   },
//   {
//     title: "Appointment for health",
//     description: "10:00 AM - 11:00 AM",
//     text: "Upcoming",
//     start: "2024-05-01",
//     end: "2024-05-02",
//     backgroundColor: "#348AF4",
//   },
//   {
//     title: "Appointment for health",
//     description: "10:00 AM - 11:00 AM",
//     text: "Cancelled",
//     start: "2024-05-01",
//     end: "2024-05-02",
//     backgroundColor: "#D64242",
//   },
//   {
//     title: "Appointment for health",
//     description: "10:00 AM - 11:00 AM",
//     text: "Pending",
//     start: "2023-09-11",
//     end: "2023-09-12",
//     backgroundColor: "#FA9D47",
//   },
//   {
//     title: "Appointment for health",
//     description: "10:00 AM - 11:00 AM",
//     text: "Upcoming",
//     start: "2023-09-22",
//     end: "2023-09-23",
//     backgroundColor: "#348AF4",
//   },
//   {
//     title: "Appointment for health",
//     description: "10:00 AM - 11:00 AM",
//     text: "Missed",
//     start: "2023-09-26",
//     end: "2023-09-27",
//     backgroundColor: "#FF5E0E",
//   },
//   {
//     title: "Appointment for health",
//     description: "10:00 AM - 11:00 AM",
//     text: "Missed",
//     start: "2023-09-26",
//     end: "2023-09-27",
//     backgroundColor: "#FF5E0E",
//   },
//   {
//     title: "Appointment for health",
//     description: "10:00 AM - 11:00 AM",
//     text: "Missed",
//     start: "2023-09-26",
//     end: "2023-09-27",
//     backgroundColor: "#FF5E0E",
//   },
// ];

const eventContent = (info) => {
  // console.log("info:::", info.event.extendedProps);
  return (
    <div
      style={{
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
        sx={{ fontSize: "16px", mt: 1, fontWeight: "bold" }} // Add fontWeight: 'bold' here
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectBoxValue, setSelectBoxValue] = useState(null);
  const [
    getAllAppointments,
    { isLoading, isError, isSuccess, data: appointmentData, error },
  ] = useGetAllAppointmentsMutation();

  useEffect(() => {
    const fetchData = async () => {
      await getAllAppointments({
        pageNo: 1,
        pageSize: 10,
        statusId: selectBoxValue?.value || null,
      });
    };
    fetchData();
  }, [selectBoxValue]);
  const handleChange = (event) => {
    setSelectedOptions(event.target.value);
  };

  // Define the text and backgroundColor mapping for each status
  const statusMap = {
    Booked: { text: "Booked", backgroundColor: "#348AF4" },
    Missed: { text: "Missed", backgroundColor: "#FF5E0E" },
    // Add more mappings for other status if needed
  };

  // Filter and map the appointmentData array to generate events
  console.log("appointmentData?.data:::", appointmentData?.data);
  const events =
    appointmentData?.data.length > 0 &&
    appointmentData?.data?.map((appointment) => {
      const { startDateTime, endDateTime, status } = appointment;

      // Format start and end time using Moment.js
      const startTime = moment.utc(startDateTime).local().format("LT");
      const endTime = moment.utc(endDateTime).local().format("LT");

      return {
        title: "Appointment for health",
        description: `${startTime} - ${endTime}`,
        text: status,
        start: moment(startDateTime).format("YYYY-MM-DD"),
        end: moment(endDateTime).format("YYYY-MM-DD"),
      };
    });

  const options = [
    { label: "All Appointments", value: null },
    { label: "Missed", value: APPOINTMENT_STATUSES.MISSED },
    { label: "Completed", value: APPOINTMENT_STATUSES.COMPLETED },
    { label: "Booked", value: APPOINTMENT_STATUSES.BOOKED },
  ];

  const handleEventClick = (info) => {
    setEvent(info.event);
    setShowModal(true);
  };

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (option) => {
    setSelectBoxValue(option);
    setAnchorEl(null);
  };

  return (
    <Box
      bgcolor="#fff"
      boxShadow="none"
      width="100%"
      height="100%"
      borderRadius="12px"
      p={2}
    >
      <StyledCalender>
        <div className="appointment-calender-div">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              start: "dayGridMonth,timeGridWeek,timeGridDay",
              center: "prev,title,next",
              end: "customSelectBox",
            }}
            buttonText={{
              today: 'Today',
              month: 'Month',
              week: 'Week',
              day: 'Day'
            }}
            weekends={true}
            events={events}
            eventContent={eventContent}
            height={"80vh"}
            now={null}
            eventClick={handleEventClick}
            dayMaxEventRows={2}
            dayMaxEvent={true}
            customButtons={{
              customSelectBox: {
                text: selectBoxValue
                  ? selectBoxValue.label
                  : "All Appointments",
                click: handleDropdownClick, // Assign the click event handler
              },
            }}
          />

          {anchorEl && (
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              {options.map((option) => (
                <MenuItem
                  key={option.value}
                  onClick={() => handleMenuItemClick(option)}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Menu>
          )}
        </div>
      </StyledCalender>
    </Box>
  );
}

function TestCompo() {
  return <div>Test</div>;
}
