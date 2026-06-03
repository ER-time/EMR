import { MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

import { Box } from "@/components";
import MuiTypography from "@/components/core/Typography";
import { useTotalGenderChartDataQuery } from "@/redux/slices/dashboard";
import styled from "styled-components";

const StyledSelect = styled(Select)`
  margin: 0px 0px;
  height: 50px;
  width: 200px;
  & fieldset {
    border: 1px solid #e5e6e6;
  }
  @media (max-width: 478px) {
    width: 100%;
  }
`;
const options = {
  chart: {
    width: 500, // Set the desired width
    height: 500, // Set the desired height
    type: "pie",
  },
  colors: ["#348AF4", "#E02828"],
  labels: ["Female", "Male"],
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          total: {
            show: true,
            label: "Total Patients",
            color: "#999999",
            fontSize: "20px",
            formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0),
          },
          formatter: (value) => value + "%",
        },
        size: 65,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    fontWeight: 500,
    fontSize: "16px",
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
    textAnchor: "bottom",
    formatter: (value, { seriesIndex, w }) => value + " " + w.globals.series[seriesIndex],
  },
  responsive: [
    {
      breakpoint: 420,
      options: {
        chart: {
          width: 460,
          height: 460,
        },
      },
    },
    {
      breakpoint: 355,
      options: {
        chart: {
          width: 420,
          height: 460,
        },
      },
    },
  ],
};

const intervals = [
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" },
];

const PatientChart = () => {
  const [genderData, setGenderData] = useState([0, 0]);
  const [selectedInterval, setSelectedInterval] = useState("week");

  const getTotalGenderData = useTotalGenderChartDataQuery({
    year: selectedInterval === "year",
    month: selectedInterval === "month",
    week: selectedInterval === "week",
    day: false,
  });

  useEffect(() => {
    if (getTotalGenderData.isSuccess && getTotalGenderData.data) {
      const data = getTotalGenderData.data.data || [0, 0];
      setGenderData(data);
    }
  }, [getTotalGenderData.isSuccess, getTotalGenderData.data]);

  const handleIntervalChange = (event) => {
    setSelectedInterval(event.target.value);
  };

  return (
    <>
      <Box display="flex" alignItems="center" flexWrap="wrap" justifyContent="space-between" p="15px">
        <MuiTypography variant="body1" component="h6" color="#1A1A1A" fontWeight="600">
          Patients
        </MuiTypography>

        <StyledSelect
          value={selectedInterval}
          onChange={handleIntervalChange}
          displayEmpty
          inputProps={{ "aria-label": "Select Interval" }}
          // fullWidth={true}
          // sx={INPUT_FIELD_STYLES.sx}
        >
          {intervals.map((interval) => (
            <MenuItem key={interval.value} value={interval.value}>
              {interval.label}
            </MenuItem>
          ))}
        </StyledSelect>
      </Box>

      <Box width="100%" display="flex" justifyContent="center" py="20px">
        <ReactApexChart options={options} series={genderData} type="donut" width={340} />
      </Box>
    </>
  );
};

export default PatientChart;
