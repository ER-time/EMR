import { MenuItem, Select } from "@mui/material";
import { Box } from "@/components";
import ReactApexChart from "react-apexcharts";

import MuiTypography from "@/components/core/Typography";
import { useDoctorGenderChartDataQuery } from "@/redux/slices/dashboard";
import { useEffect, useState } from "react";
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

export default function PatientChart() {
  const [genderData, setGenderData] = useState([45, 105]);
  const [selectedInterval, setSelectedInterval] = useState("year");

  const intervals = [
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
    { label: "This Year", value: "year" },
  ];
  const getTotalGenderData = useDoctorGenderChartDataQuery({
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


  const options = {
    chart: {
      width: 380,
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
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              },
            },
            // formatter: function (value) {
            //   return value + "%";
            // },
          },
          size: 80,
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
      formatter: function (value, { seriesIndex, w }) {
        return value + " " + w.globals.series[seriesIndex];
      },
    },
    responsive: [
      {
        breakpoint: 535,
        options: {
          chart: {
            width: 260,
            height: 260,
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
          Total Patients
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
        <ReactApexChart
          options={options}
          series={genderData}
          type="donut"
          width={420}
        />
      </Box>
    </>
  );
}
