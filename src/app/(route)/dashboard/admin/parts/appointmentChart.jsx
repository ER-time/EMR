import { MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

import { Box } from "@/components";
import MuiTypography from "@/components/core/Typography";
import { useAdminPieChartDataQuery } from "@/redux/slices/dashboard";
import styled from "styled-components";

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
const AppointmenChart = () => {
  const [chartData, setChartData] = useState([30, 30, 30, 30]);
  const [selectedFilter, setSelectedFilter] = useState("week");

  const getPieChartData = useAdminPieChartDataQuery({
    year: selectedFilter === "year",
    month: selectedFilter === "month",
    week: selectedFilter === "week",
    day: false,
  });

  useEffect(() => {
    if (getPieChartData.isSuccess && getPieChartData.data) {
      const data = getPieChartData.data.data || [0, 0, 0, 0];
      setChartData(data);
    }
  }, [getPieChartData.isSuccess, getPieChartData.data, selectedFilter]);

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const options = {
    chart: {
      width: 400,
      type: "pie",
    },
    labels: [
      "Missed Appt.",
      "Upcoming Appt.",
      "Booked Appt.",
      "Completed Appt.",
    ],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Appointments",
              color: "#999999",
              fontSize: "20px",
              formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0),
            },
            formatter: function (value) {
              return value + "%";
            },
          },
          size: 70,
        },
      },
    },
    noData: {
      text: "No data available",
      align: "center",
      verticalAlign: "middle",
      offsetX: 0,
      offsetY: 0,
      style: {
        color: "#999",
        fontSize: "16px",
        fontFamily: "Helvetica, Arial, sans-serif",
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
        breakpoint: 569,
        options: {
          chart: {
            width: 300,
            height: 320,
          },
        },
      },
      {
        breakpoint: 478,
        options: {
          chart: {
            width: 260,
            height: 320,
          },
        },
      },
      {
        breakpoint: 356,
        options: {
          chart: {
            width: 200,
            height: 300,
          },
        },
      },
    ],
    legend: {
      fontWeight: 500,
      fontSize: "14px",
      position: "right",
      offsetY: 30,
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
        return value;
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
          Appointments
        </MuiTypography>

        <StyledSelect
          value={selectedFilter}
          onChange={handleFilterChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          label=""
          // fullWidth={true}
          // sx={INPUT_FIELD_STYLES.sx}
        >
          <MenuItem value="week">This Week</MenuItem>
          <MenuItem value="month">This Month</MenuItem>
          <MenuItem value="year">This Year</MenuItem>
        </StyledSelect>
      </Box>

      <Box width="100%" display="flex" justifyContent="center" py="20px">
        <ReactApexChart
          options={options}
          series={chartData}
          type="donut"
          width={440}
        />
      </Box>
    </>
  );
};

export default AppointmenChart;
