import React, { useState } from "react";
import styled from "styled-components";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronrRightIcon from "@mui/icons-material/ChevronRight";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Box } from "@/components";
import useScreenWidth from "@/hooks/useScreenWidth";
import MuiTypography from "@/components/core/Typography";

const StyledContainer = styled.div`
  && {
    .week-days-row {
      display: flex;
      justify-content: space-between;
      margin: 50px 10px;
      width: auto !important;
    }

    .day-cell {
      text-align: center;
      flex: 1;
      padding: 10px;
      border-radius: 10px;
    }

    .day-cell.active {
      background-color: #f9d2d2;
      width: 40px;
    }

    .day-weekday {
      color: grey;
      font-size: 14px;
    }
    .day-number {
      color: #000;
      margin: 5px 0px;
      font-size: 18px;
      font-weight: bold;
    }

    .day-cell.active .day-weekday,
    .day-cell.active .day-number {
      color: #e02828;
    }
    .previous-button {
      left: -15px;
    }
    .next-button,
    .previous-button {
      cursor: pointer;
      font-size: 30px;
      position: absolute;
      top: 50%;
      -webkit-transform: translateY(-50%);
      transform: translateY(-50%);
      border: none;
      background: none;
    }
    .next-button {
      right: -15px;
    }
    .previous-button.disabled {
      pointer-events: none;
      opacity: 0.5;
    }
  }
`;

export default function SlidingCalendar({
  activeDate,
  setActiveDate,
}) {
  const [startDate, setStartDate] = useState(new Date());
  const screenWidth = useScreenWidth();


  const selectedDay = (val) => {
    console.log(val);
  };


  const goToPreviousWeek = () => {
    const prevWeekStartDate = new Date(startDate);
    prevWeekStartDate.setDate(startDate.getDate() - 6);
    setStartDate(prevWeekStartDate);
  };

  const goToNextWeek = () => {
    const nextWeekStartDate = new Date(startDate);
    nextWeekStartDate.setDate(startDate.getDate() + 6);
    setStartDate(nextWeekStartDate);
  };
  // const isDateClickable = (date) => {
  //   return getPatientAppointments?.some((appointment) => {
  //     const appointmentDate = new Date(appointment.startDate);
  //     return appointmentDate.toDateString() === date.toDateString();
  //   });
  // };

  const handleDateClick = (date) => {
    setActiveDate(date);
  };

  // let getPatientAppointments = [
  //   {
  //     gender: "Female",
  //     appointmentId: 101,
  //     description: "Consultation",
  //     startDate: "21 Sep 2023",
  //     endDate: "21 Sep 2023",
  //     startTime: "Sep 21 2023 10:45AM",
  //     endTime: "Sep 21 2023 11:00AM",
  //     patientName: "UMEE FARWA",
  //     patientPin: "BIH0123360",
  //     doctorPin: "BIH100002",
  //     doctor: "Dr. Kamran Babar Ali",
  //     status: "Confirmed",
  //     departmentName: "CARDIOLOGY",
  //   },
  //   {
  //     gender: "Female",
  //     appointmentId: 99,
  //     description: "Consultation",
  //     startDate: "18 Sep 2023",
  //     endDate: "18 Sep 2023",
  //     startTime: "Sep 18 2023 12:45PM",
  //     endTime: "Sep 18 2023  1:00PM",
  //     patientName: "UMEE FARWA",
  //     patientPin: "BIH0123360",
  //     doctorPin: "BIH100002",
  //     doctor: "Dr. Kamran Babar Ali",
  //     status: "Pending",
  //     departmentName: "CARDIOLOGY",
  //   },
  //   {
  //     gender: "Female",
  //     appointmentId: 84,
  //     description: "Consultation",
  //     startDate: "06 Sep 2023",
  //     endDate: "06 Sep 2023",
  //     startTime: "Sep  6 2023 11:00AM",
  //     endTime: "Sep  6 2023 11:20AM",
  //     patientName: "UMEE FARWA",
  //     patientPin: "BIH0123360",
  //     doctorPin: "BIH100265",
  //     doctor: "Dr. Soban Shahid",
  //     status: "Confirmed",
  //     departmentName: "RADIOLOGY",
  //   },
  //   {
  //     gender: "Female",
  //     appointmentId: 83,
  //     description: "Consultation",
  //     startDate: "07 Sep 2023",
  //     endDate: "07 Sep 2023",
  //     startTime: "Sep  7 2023 10:30AM",
  //     endTime: "Sep  7 2023 10:45AM",
  //     patientName: "UMEE FARWA",
  //     patientPin: "BIH0123360",
  //     doctorPin: "BIH100594",
  //     doctor: "Dr. Zahid Siddique Shad",
  //     status: "Confirmed",
  //     departmentName: "INTENSIVE CARE UNIT - ICU",
  //   },
  //   {
  //     gender: "Female",
  //     appointmentId: 82,
  //     description: "Consultation",
  //     startDate: "30 Aug 2023",
  //     endDate: "30 Aug 2023",
  //     startTime: "Aug 30 2023 10:15AM",
  //     endTime: "Aug 30 2023 10:30AM",
  //     patientName: "UMEE FARWA",
  //     patientPin: "BIH0123360",
  //     doctorPin: "BIH100222",
  //     doctor: "Dr. Bilal Asghar",
  //     status: "Confirmed",
  //     departmentName: "FAMILY MEDICINE",
  //   },
  //   {
  //     gender: "Female",
  //     appointmentId: 81,
  //     description: "Consultation",
  //     startDate: "30 Aug 2023",
  //     endDate: "30 Aug 2023",
  //     startTime: "Aug 30 2023 10:00AM",
  //     endTime: "Aug 30 2023 10:15AM",
  //     patientName: "UMEE FARWA",
  //     patientPin: "BIH0123360",
  //     doctorPin: "BIH100222",
  //     doctor: "Dr. Bilal Asghar",
  //     status: "Confirmed",
  //     departmentName: "FAMILY MEDICINE",
  //   },
  //   {
  //     gender: "Female",
  //     appointmentId: 80,
  //     description: "Consultation",
  //     startDate: "30 Aug 2023",
  //     endDate: "30 Aug 2023",
  //     startTime: "Aug 30 2023 10:30AM",
  //     endTime: "Aug 30 2023 10:45AM",
  //     patientName: "UMEE FARWA",
  //     patientPin: "BIH0123360",
  //     doctorPin: "BIH100222",
  //     doctor: "Dr. Bilal Asghar",
  //     status: "Confirmed",
  //     departmentName: "FAMILY MEDICINE",
  //   },
  //   {
  //     gender: "Female",
  //     appointmentId: 78,
  //     description: "Consultation",
  //     startDate: "01 Sep 2023",
  //     endDate: "01 Sep 2023",
  //     startTime: "Sep  1 2023 10:20AM",
  //     endTime: "Sep  1 2023 10:40AM",
  //     patientName: "UMEE FARWA",
  //     patientPin: "BIH0123360",
  //     doctorPin: "BIH100165",
  //     doctor: "Dr. Saba Aslam",
  //     status: "Confirmed",
  //     departmentName: "RADIOLOGY",
  //   },
  //   {
  //     gender: "Female",
  //     appointmentId: 77,
  //     description: "Followup",
  //     startDate: "01 Sep 2023",
  //     endDate: "01 Sep 2023",
  //     startTime: "Sep  1 2023 10:00AM",
  //     endTime: "Sep  1 2023 10:20AM",
  //     patientName: "UMEE FARWA",
  //     patientPin: "BIH0123360",
  //     doctorPin: "BIH100165",
  //     doctor: "Dr. Saba Aslam",
  //     status: "Confirmed",
  //     departmentName: "RADIOLOGY",
  //   },
  //   {
  //     gender: "Female",
  //     appointmentId: 76,
  //     description: "Consultation",
  //     startDate: "29 Aug 2023",
  //     endDate: "29 Aug 2023",
  //     startTime: "Aug 29 2023  6:00PM",
  //     endTime: "Aug 29 2023  6:15PM",
  //     patientName: "UMEE FARWA",
  //     patientPin: "BIH0123360",
  //     doctorPin: "BIH100277",
  //     doctor: "Dr. Junaid Akhtar",
  //     status: "Confirmed",
  //     departmentName: "CARDIOLOGY",
  //   },
  //   {
  //     gender: "Female",
  //     appointmentId: 75,
  //     description: "Consultation",
  //     startDate: "29 Aug 2023",
  //     endDate: "29 Aug 2023",
  //     startTime: "Aug 29 2023  8:45PM",
  //     endTime: "Aug 29 2023  9:00PM",
  //     patientName: "UMEE FARWA",
  //     patientPin: "BIH0123360",
  //     doctorPin: "BIH100356",
  //     doctor: "Dr. Shazia Khanam",
  //     status: "Confirmed",
  //     departmentName: "ANESTHESIA",
  //   },
  //   {
  //     gender: "Female",
  //     appointmentId: 74,
  //     description: "Consultation",
  //     startDate: "30 Aug 2023",
  //     endDate: "30 Aug 2023",
  //     startTime: "Aug 30 2023  9:45AM",
  //     endTime: "Aug 30 2023 10:00AM",
  //     patientName: "UMEE FARWA",
  //     patientPin: "BIH0123360",
  //     doctorPin: "BIH100277",
  //     doctor: "Dr. Junaid Akhtar",
  //     status: "Confirmed",
  //     departmentName: "CARDIOLOGY",
  //   },
  // ];

  let dateData = [
    "2023-12-04T00:00:00",
    "2023-12-05T00:00:00",
    "2023-12-06T00:00:00",
    "2023-12-11T00:00:00",
    "2023-12-12T00:00:00",
    "2023-12-13T00:00:00",
    "2023-12-18T00:00:00",
    "2023-12-19T00:00:00",
    "2023-12-20T00:00:00",
    "2023-12-25T00:00:00",
    "2023-12-26T00:00:00",
    "2023-12-27T00:00:00",
  ];
  return (
    <StyledContainer>
       <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="10px"
      >
        <MuiTypography
          variant="h6"
          component="h6"
          color="#1A1A1A"
          fontWeight="600"
        >
          My Appointments
        </MuiTypography>

        {/* <Select
          value={`${activeDate.getMonth()}-${activeDate.getFullYear()}`}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          labe=""
          fullWidth={true}
          sx={INPUT_FIELD_STYLES.sx}
          onChange={handleChange}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select> */}
      </Box>
      <div className="week-view-calendar">
        <div style={{ position: "relative" }}>
          <ChevronLeftIcon
            onClick={goToPreviousWeek}
            className={`previous-button`}
          />

          <Box className="week-days-row">
            {Array.from(
              { length: screenWidth < 575 ? 1 : screenWidth < 668 ? 3 : 7 },
              (_, i) => {
                const day = new Date(startDate);
                day.setDate(startDate.getDate() + i);
                const isCurrentDate =
                  day.toDateString() === activeDate.toDateString();
                // const isClickable = isDateClickable(day);

                const hasAppointment = dateData?.some((appointment) => {
                  {
                    /* debugger; */
                  }
                  const appointmentDate = new Date(appointment);
                  return appointmentDate.toDateString() === day.toDateString();
                });

                return (
                  <div
                    key={i}
                    className={`day-cell cursor-pointer ${
                      isCurrentDate ? "active" : ""
                    }`}
                    onClick={(e) => {
                      // if (isClickable) {
                      handleDateClick(day);
                      // handleFilter(moment(day).format("ll"));
                      // }
                    }}
                  >
                    <div className="day-weekday">
                      {day.toLocaleDateString("en-US", {
                        month: "short",
                      })}
                    </div>
                    {day.toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                    <div
                      className={`day-number ${
                        isCurrentDate && hasAppointment && isCurrentDate
                          ? "active"
                          : ""
                      }`}
                    >
                      {day.getDate()}
                    </div>
                    <div className="day-weekday"></div>
                    {hasAppointment && (
                      <FiberManualRecordIcon
                        sx={{
                          color: "red",
                          fontSize: "10px",
                        }}
                      />
                    )}
                  </div>
                );
              }
            )}
          </Box>

          <ChevronrRightIcon className="next-button" onClick={goToNextWeek} />
        </div>
      </div>
    </StyledContainer>
  );
}
