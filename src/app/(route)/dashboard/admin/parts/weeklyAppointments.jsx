import { MenuItem, Select } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import styled from "styled-components";
import { Box } from "@/components";
import MuiTypography from "@/components/core/Typography";
import { useGetAppointmentGraphQuery } from "@/redux/slices/dashboard";
import { useEffect, useState } from "react";

const INPUT_FIELD_STYLES = {
  sx: {
    margin: "0px 0px",
    height: "50px",
    "& fieldset": { border: "1px solid #E5E6E6" },
    width: "150px",
  },
};

const StyledBox = styled(Box)`
  && {
    .apexcharts-toolbar {
      display: none;
    }
  }
`;

export default function WeeklyAppointments() {
  const [chartData, setChartData] = useState([]);
  const getAppointmentGraph = useGetAppointmentGraphQuery({ statusId: 304 });

  useEffect(() => {
    if (getAppointmentGraph.isSuccess && getAppointmentGraph.data) {
      const data = getAppointmentGraph.data.data || [];
      const chartData = data.map((item) => item.count);
      setChartData(chartData);
    }
  }, [getAppointmentGraph.isSuccess, getAppointmentGraph.data]);

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
      categories: ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"],
    },
    yaxis: {
      title: {
        text: "",
      },
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
        breakpoint: 548,
        options: {
          chart: {
            width: 360,
            height: 300,
          },
        },
      },
      {
        breakpoint: 470,
        options: {
          chart: {
            width: 300,
            height: 300,
          },
        },
      },
      {
        breakpoint: 420,
        options: {
          chart: {
            width: 240,
            height: 280,
          },
        },
      },
      {
        breakpoint: 348,
        options: {
          chart: {
            width: 200,
            height: 260,
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
        justifyContent="space-between"
        p="15px"
      >
        <MuiTypography
          variant="body1"
          component="h6"
          color="#1A1A1A"
        fontWeight="600"
        >
          Weekly Appointments
        </MuiTypography>
{/* 
        <Select
          value={10}
          // onChange={handleChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          label=""
          fullWidth={true}
          sx={INPUT_FIELD_STYLES.sx}
        >
          <MenuItem value={10}>Doctor</MenuItem>
          <MenuItem value={20}>Patient</MenuItem>
        </Select> */}
      </Box>

      <StyledBox width="100%" display="flex" justifyContent="center" py="20px">
        <ReactApexChart
          options={options}
          series={[{ name: "Appointments", data: chartData }]}
          type="bar"
          width={400}
        />
      </StyledBox>
    </>
  );
}
