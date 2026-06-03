"use client";

import { Search } from "@mui/icons-material";
import { InputAdornment, MenuItem, Select, Slider } from "@mui/material";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";

import { Box, Button } from "@/components";
import InputField from "@/components/core/Input";
import MuiTypography from "@/components/core/Typography";
import useScreenWidth from "@/hooks/useScreenWidth";
import { useState } from "react";
import { SearchBox } from "../readySearchBox";
import axios from "axios";

const minDistance = 10;

const StyledFilterContainer = styled(Box)`
  display: ${(props) =>
    props.screenWidth < 992
      ? props.showMessanger === true
        ? "none"
        : "block"
      : "block"};
`;

export default function GridViewFilterList({
  showMessanger,
  setShowMessanger,
  setHospitalsList,
  setIsLoading,
}) {
  const screenWidth = useScreenWidth();

  const INPUT_FIELD_PROPS_SEARCH = {
    label: "",
    fullWidth: true,
    variant: "standard",
  };

  const INPUT_FIELD_STYLES_SEARCH = {
    sx: {
      width: "100%",
      height: "40px",
      padding: 0,

      "& fieldset": { border: "1px solid #CCCCCC" },
    },
  };

  const INPUT_FIELD_STYLES = {
    sx: {
      margin: "0px 0px",
      height: "40px",
      "& fieldset": { border: "1px solid #E2E5ED" },
    },
  };

  const [value1, setValue1] = useState([20, 37]);

  const handleChange1 = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
    } else {
      setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
    }
  };
  return (
    <StyledFilterContainer
      screenWidth={screenWidth}
      showMessanger={showMessanger}
      sx={{
        borderRight: `${
          screenWidth < 992 && !showMessanger ? "none" : "1px solid #C3C3C3"
        }`,
      }}
      maxWidth={`${screenWidth < 992 && !showMessanger ? "100%" : "400px"}`}
    >
      {screenWidth < 992 && (
        <Box
          p={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <MuiTypography variant="h6" component="h6">
            Filter
          </MuiTypography>
          <CloseIcon
            sx={{ cursor: "pointer", color: "#000" }}
            onClick={() => setShowMessanger(true)}
          />
        </Box>
      )}
      <Box
        style={{
          overflow: "auto",
          height: `calc(100vh - ${screenWidth < 992 ? "188px" : "148px"})`,
        }}
      >
        <Box p={2}>
          <MuiTypography
            variant="subtitle1"
            fontWeight="600"
            color="#1A1A1A"
            mb={0.5}
          >
            Search
          </MuiTypography>
          <SearchBox
            style={{
              margin: "10px 10px",
              height: "140px",
              "& fieldset": { border: "1px solid #E2E5ED" },
            }}
            onSelectAddress={(address, lat, lng) => {
              if (lat && lng) {
                axios
                  .post(
                    "https://medical-aibe.xeventechnologies.com/get_nearby_hospitals",
                    {
                      lattitude: lat,
                      longitude: lng,
                    }
                  )
                  .then((response) => {
                    let hospitalsList = response?.data?.data?.[0]?.Response
                      ? response.data.data[0].Response.map((hospital) => ({
                          ...hospital,
                        }))
                      : [];
                    setHospitalsList(hospitalsList);
                    setIsLoading(false);
                  })
                  .catch((error) => {
                    setIsLoading(false);
                    console.log("error>>>>>>", error);
                  });
              }
            }}
            // defaultValue={"Search Hospitals"}
            // {...field}
          />
        </Box>

        {/* <Box p={2}>
        <MuiTypography
          variant="subtitle1"
          fontWeight="600"
          color="#1A1A1A"
          mb={0.5}
        >
          City
        </MuiTypography>
        <Select
          value={10}
          // onChange={handleChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          labe=""
          fullWidth={true}
          sx={INPUT_FIELD_STYLES.sx}
        >
          <MenuItem value={10}>Liverpool</MenuItem>
          <MenuItem value={20}>Coventry</MenuItem>
          <MenuItem value={30}>Leicester</MenuItem>
        </Select>
      </Box>

      <Box p={2}>
        <MuiTypography
          variant="subtitle1"
          fontWeight="600"
          color="#1A1A1A"
          mb={0.5}
        >
          Distance
        </MuiTypography>
        <Slider
          defaultValue={50}
          aria-label="Default"
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value} Miles`}
          sx={{
            color: "#E02828",
          }}
          value={value1}
          onChange={handleChange1}
          disableSwap
        />
      </Box>

      <Box p={2} display="flex" justifyConten="space-between">
        <Box mr={1}>
          <MuiTypography
            variant="subtitle1"
            fontWeight="600"
            color="#1A1A1A"
            mb={0.5}
          >
            Min
          </MuiTypography>
          <InputField
            id="email"
            placeholder="0 Miles"
            text="number"
            {...INPUT_FIELD_PROPS_SEARCH}
            sx={INPUT_FIELD_STYLES_SEARCH.sx}
            variant="standard"
          />
        </Box>

        <Box ml={1}>
          <MuiTypography
            variant="subtitle1"
            fontWeight="600"
            color="#1A1A1A"
            mb={0.5}
          >
            Max
          </MuiTypography>
          <InputField
            id="email"
            text="number"
            placeholder="50 Miles"
            {...INPUT_FIELD_PROPS_SEARCH}
            sx={INPUT_FIELD_STYLES_SEARCH.sx}
            variant="standard"
          />
        </Box>
      </Box> */}
        {/* <Box display="flex" justifyContent="center">
        <Button
          bg="#E02828"
          sx={{
            color: "#fff",
            fontSize: "12px",
            fontWeight: "500",
            width: "100%",
            maxWidth: "330px",
            padding: "10px",
          }}
        >
          Find Hospital
        </Button>
      </Box> */}
      </Box>
    </StyledFilterContainer>
  );
}
