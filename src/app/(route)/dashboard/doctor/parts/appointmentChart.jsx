import { MenuItem, Select } from "@mui/material";
import ReactApexChart from "react-apexcharts";

import { Box } from "@/components";
import MuiTypography from "@/components/core/Typography";
import styled from "styled-components";
import { useDoctorPieChartDataQuery } from "@/redux/slices/dashboard";
import { useEffect, useState } from "react";

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

const StyledBox = styled(Box)`
  .apexcharts-datalabels.legend-mouseover-inactive {
    opacity: 1 !important;
  }
`;

export default function AppointmenChart() {
  const [selectedFilter, setSelectedFilter] = useState("year");

  const getPieChartData = useDoctorPieChartDataQuery({
    year: selectedFilter === "year",
    month: selectedFilter === "month",
    week: selectedFilter === "week",
    day: false,
  });

  const [chartData, setChartData] = useState([]);
  const [filteredArray, setFilteredArray] = useState([]);

  useEffect(() => {
    if (getPieChartData.isSuccess && getPieChartData.data) {
      const data = getPieChartData?.data?.data || [];
      setChartData(data);

      // Remove the last element from data and set filteredArray
      if (data.length > 0) {
        setFilteredArray(data.slice(0, -1));
      } else {
        setFilteredArray([]);
      }
    }
  }, [getPieChartData.isSuccess, getPieChartData.data, selectedFilter]);

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const options = {
    chart: {
      width: 380,
      type: "pie",
    },
    colors: ["#34C240", "#D64242", "#FF5E0E"],
    labels: [
      "Completed Appt",
      "Booked Appt.",
      "Missed Appt.",
      // "Upcoming Appt.",
      // "Pending Appt.",
    ],

    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            formatter: function (value) {
              return value + "%";
            },
            total: {
              show: true,
              label: "Total Appointments",
              color: "#999999",
              fontSize: "20px",
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              },
            },
          },
          size: 65,
        },
      },
    },

    responsive: [
      {
        breakpoint: 1700,
        options: {
          legend: {
            offsetY: 0,
            position: "bottom",
          },
        },
      },
      {
        breakpoint: 535,
        options: {
          chart: {
            width: 260,
            height: 340,
          },
          legend: {
            offsetY: 0,
            position: "bottom",
          },
        },
      },
      {
        breakpoint: 355,
        options: {
          chart: {
            width: 220,
            height: 300,
          },
          legend: {
            offsetY: 0,
            position: "bottom",
          },
        },
      },
    ],

    legend: {
      fontWeight: 500,
      fontSize: "14px",
      position: "bottom",

      labels: {
        colors: "#000",
      },
      markers: {
        strokeWidth: 0,
        strokeColor: "#fff",
        fillColors: undefined,
        radius: 100,
        customHTML: undefined,
        onClick: undefined,
        offsetX: 0,
        offsetY: 0,
      },

      textAnchor: "right",
      formatter: function (value, { seriesIndex, w }) {
        return value + " (" + w.globals.series[seriesIndex] + ")";
      },
    },
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
          value={selectedFilter}
          onChange={handleFilterChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          label=""
        >
          <MenuItem value="week">This Week</MenuItem>
          <MenuItem value="month">This Month</MenuItem>
          <MenuItem value="year">This Year</MenuItem>
        </StyledSelect>
      </Box>

      <StyledBox width="100%" display="flex" justifyContent="center" py="20px">
        <ReactApexChart
          options={options}
          series={filteredArray}
          type="donut"
          width={440}
        />
      </StyledBox>
    </>
  );
}
