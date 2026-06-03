import ReactApexChart from "react-apexcharts";
import styled from "styled-components";
import { MenuItem, Select } from "@mui/material";
import moment from "moment";

import { Box } from "@/components";
import MuiTypography from "@/components/core/Typography";
import { useTotalAppointmentsQuery } from "@/redux/slices/dashboard";
import { useEffect, useState } from "react";

const StyledBox = styled(Box)`
  && {
    .apexcharts-toolbar {
      display: none;
    }
  }
`;

const StyledSelect = styled(Select)`
  margin: 0px 0px;
  height: 50px;
  width: 150px;
  & fieldset {
    border: 1px solid #e5e6e6;
  }
  @media (max-width: 478px) {
    width: 100%;
  }
`;

export default function TotalAppointments() {
  const [chartData, setChartData] = useState([]);
  const [selectedInterval, setSelectedInterval] = useState("week");

  const intervals = [
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
    { label: "Last Year", value: "year" },
  ];

  const getAllAppointment = useTotalAppointmentsQuery({
    year: selectedInterval === "year",
    month: selectedInterval === "month",
    week: selectedInterval === "week",
    day: false,
  });

  useEffect(() => {
    if (getAllAppointment.isSuccess && getAllAppointment.data) {
      const data = getAllAppointment?.data?.data || [];
      const counts = data?.map((item) => item.count);
      setChartData(counts);
    }
  }, [getAllAppointment.isSuccess, getAllAppointment.data, selectedInterval]);

  const handleIntervalChange = (event) => {
    setSelectedInterval(event.target.value);
  };

  const formatXAxisLabels = (date, index) => {
    switch (selectedInterval) {
      case "week":
        return moment(date).format("ddd"); // Format as day of the week (e.g., Mon, Tue)
      case "month":
        return index % 7 === 0 ? moment(date).format("D") : ""; // Display day of the month for every 5th label
      case "year":
        return moment(date).format("MMM"); // Format as month name (e.g., Jan, Feb)
      default:
        return "";
    }
  };

  const options = {
    chart: {
      type: "bar",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#E02828"],
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: getAllAppointment.data
        ? getAllAppointment?.data?.data?.map((item, index) =>
            formatXAxisLabels(item.date, index)
          )
        : [],
      labels: {
        rotate: 0, // Ensures the labels are not tilted
        style: {
          fontSize: "12px",
        },
        offsetY: 5, // Adjust the vertical positioning if necessary
      },
    },
    yaxis: {
      min: 0,
      max: 80,
      tickAmount: 4,
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
    responsive: [
      {
        breakpoint: 1710,
        options: {
          chart: {
            width: 420,
            height: 320,
          },
        },
      },
      {
        breakpoint: 1536,
        options: {
          chart: {
            width: 600,
            height: 320,
          },
        },
      },
      {
        breakpoint: 1360,
        options: {
          chart: {
            width: 500,
            height: 320,
          },
        },
      },
      {
        breakpoint: 1200,
        options: {
          chart: {
            width: 380,
            height: 320,
          },
        },
      },
      {
        breakpoint: 1092,
        options: {
          chart: {
            width: 320,
            height: 300,
          },
        },
      },
      {
        breakpoint: 900,
        options: {
          chart: {
            width: 600,
            height: 300,
          },
        },
      },
      {
        breakpoint: 725,
        options: {
          chart: {
            width: 440,
            height: 300,
          },
        },
      },
      {
        breakpoint: 568,
        options: {
          chart: {
            width: 360,
            height: 250,
          },
        },
      },
      {
        breakpoint: 492,
        options: {
          chart: {
            width: 310,
            height: 240,
          },
        },
      },
      {
        breakpoint: 420,
        options: {
          chart: {
            width: 260,
            height: 240,
          },
        },
      },
      {
        breakpoint: 370,
        options: {
          chart: {
            width: 210,
            height: 240,
          },
        },
      },
    ],
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        flexWrap="wrap"
        justifyContent="space-between"
        p="15px"
      >
        <MuiTypography
          variant="body1"
          component="h6"
          color="#1A1A1A"
          fontWeight="600"
        >
          Total Appointments
        </MuiTypography>

        <StyledSelect
          value={selectedInterval}
          onChange={handleIntervalChange}
          displayEmpty
          inputProps={{ "aria-label": "Select Interval" }}
          // fullWidth={true}
        >
          {intervals.map((interval) => (
            <MenuItem key={interval.value} value={interval.value}>
              {interval.label}
            </MenuItem>
          ))}
        </StyledSelect>
      </Box>

      <StyledBox width="100%" display="flex" justifyContent="center" py="20px">
        <ReactApexChart
          options={options}
          series={[{ name: "Appointments", data: chartData }]}
          type="bar"
          width={300}
          height={300}
        />
      </StyledBox>
    </>
  );
}
