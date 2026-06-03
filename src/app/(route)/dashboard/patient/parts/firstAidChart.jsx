import styled from "styled-components";
import ReactApexChart from "react-apexcharts";
import { MenuItem, Select } from "@mui/material";

import { Box } from "@/components";
import MuiTypography from "@/components/core/Typography";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

const StyledSelect = styled(Select)`
  margin: 0px 0px;
  height: 50px;
  width: 150px;
  & fieldset {
    border: 1px solid #e5e6e6;
  }
  @media (max-width: 417px) {
    width: 100%;
  }
`;

const StyledBox = styled(Box)`
  && {
    .apexcharts-toolbar,
    .apexcharts-legend {
      display: none;
    }
  }
`;

export default function FirstAidChart() {
  const [filter, setFilter] = useState("week");
  const [graphData, setGraphData] = useState(null);
  const session = useSession();

  useEffect(() => {
    const getFirstAidData = async () => {
      try {
        let user_id = session.data?.user?.user?.userId;

        const response = await axios.get(
          `https://medical-aibe.xeventechnologies.com/api/session-graph?user_id=${user_id}&filter=${filter}`
        );
        setGraphData(response?.data?.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (filter) getFirstAidData();
  }, [filter]);
  console.log("graphDataL:::::", graphData);
  const series = [
    {
      name: "Physician",
      data:
        filter === "month"
          ? graphData?.gp_response_count.filter((_, index) => index % 3 === 0)
          : graphData?.gp_response_count || [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: "Psychiatrist",
      data:
        filter === "month"
          ? graphData?.psych_response_count.filter(
              (_, index) => index % 3 === 0
            )
          : graphData?.psych_response_count || [11, 32, 45, 32, 34, 52, 41],
    },
  ];

  const options = {
    chart: {
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#FA9638", "#E02828"],
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories:
        graphData?.labels?.length > 3
          ? graphData?.labels
              .filter((_, index) => {
                if (filter === "month") {
                  return index % 3 === 0; // For 'month', show every 3rd label
                } else {
                  return true; // For 'week' or 'year', don't filter
                }
              })
              .map((label) => {
                if (filter === "week" && typeof label === "string") {
                  return label?.slice(0, 3); // For 'week', slice string labels to 3 chars
                } else {
                  return label?.toString(); // For 'month' and 'year', convert numbers to strings
                }
              })
          : graphData?.labels || [
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
              "Sun",
            ],
    },

    responsive: [
      {
        breakpoint: 1670,
        options: {
          chart: {
            width: 380,
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

  const menuHandler = (e) => {
    setFilter(e.target.value);
    console.log("data===>", e.target.value);
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
          Get First Aid
        </MuiTypography>

        <StyledSelect
          value={filter}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          labe=""
          onChange={menuHandler}
          // fullWidth={true}
        >
          <MenuItem value={"week"}>This Week</MenuItem>
          <MenuItem value={"month"}>This Month</MenuItem>
          <MenuItem value={"year"}>This Year</MenuItem>
        </StyledSelect>
      </Box>

      <StyledBox width="100%" display="flex" justifyContent="center" py="20px">
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={320}
          width={440}
        />
      </StyledBox>
    </>
  );
}
