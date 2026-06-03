"use client";

import { useState } from "react";
import { Search } from "@mui/icons-material";
import {
  Autocomplete,
  InputAdornment,
  MenuItem,
  Select,
  Slider,
  TextField,
} from "@mui/material";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button } from "@/components";
import InputField from "@/components/core/Input";
import MuiTypography from "@/components/core/Typography";
import useScreenWidth from "@/hooks/useScreenWidth";
import {
  useGetAllLanguagesQuery,
  useGetAllSpecialitiesQuery,
  useGetLookupByValueQuery,
} from "@/redux/slices/lookups";
import { BeatLoader } from "react-spinners";

const StyledUserContainer = styled(Box)`
  display: ${(props) =>
    props.screenWidth < 992
      ? props.showMessanger === true
        ? "none"
        : "block"
      : "block"};
`;

export default function ChatList({
  showMessanger,
  setShowMessanger,
  setSelectedSpecialtiesID,
  selectedSpecialtiesId,
  setSearchDoctor,
  searchDoctor,
  setLanguageId,
  languageId,
  applyFiltersHandler,
  setReset,
  reset,
  isLoading,
}) {
  const screenWidth = useScreenWidth();
  const [gender, setGender] = useState(null);
  const INPUT_FIELD_PROPS_SEARCH = {
    label: "",
    fullWidth: true,
    variant: "standard",
  };
  console.log("isLoading===>", isLoading);
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
  const getAllSpecialitie = useGetAllSpecialitiesQuery();
  const getAllLanguages = useGetAllLanguagesQuery();
  const getAllLookup = useGetLookupByValueQuery();

  const onSearchHandler = (e) => {
    setSearchDoctor(e.target.value);
  };

  const clearFiltersHandler = () => {
    setSelectedSpecialtiesID(null);
    setSearchDoctor("");
    setLanguageId(null);
    setReset(!reset);
  };
  return (
    <StyledUserContainer
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
            {isLoading ? <BeatLoader color="#fff" size="10px" /> : "Filter"}
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
          height: `calc(100vh - ${screenWidth < 992 ? "188px" : "108px"})`,
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
          <InputField
            value={searchDoctor}
            onChange={onSearchHandler}
            id="search"
            placeholder="Search by doctor name"
            {...INPUT_FIELD_PROPS_SEARCH}
            sx={INPUT_FIELD_STYLES_SEARCH.sx}
            variant="standard"
            endAdornment={
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            }
          />
        </Box>

        <Box p={2}>
          <MuiTypography
            variant="subtitle1"
            fontWeight="600"
            color="#1A1A1A"
            mb={0.5}
          >
            Specialty
          </MuiTypography>
          <Autocomplete
            fullWidth={true}
            inputProps={{ "aria-label": "Without label" }}
            displayEmpty
            sx={INPUT_FIELD_STYLES.sx}
            onChange={(event, value) => {
              setSelectedSpecialtiesID(value ? value.specializationId : null);
            }}
            options={getAllSpecialitie?.data?.data || []}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>

        {/* <Box p={2}>
          <MuiTypography
            variant="subtitle1"
            fontWeight="600"
            color="#1A1A1A"
            mb={0.5}
          >
            Language
          </MuiTypography>
          <Select
            value={languageId}
            onChange={(event) => {
              setLanguageId(event.target.value);
            }}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            labe=""
            fullWidth={true}
            sx={INPUT_FIELD_STYLES.sx}
          >
            {getAllLanguages?.data?.data?.map((item, index) => {
              return (
                <MenuItem value={item?.languageId} key={index}>
                  {item?.title}
                </MenuItem>
              );
            })}
          </Select>
        </Box> */}

        {/* <Box p={2}>
          <MuiTypography
            variant="subtitle1"
            fontWeight="600"
            color="#1A1A1A"
            mb={0.5}
          >
            Experience
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
            <MenuItem value={10}>1+ Years</MenuItem>
            <MenuItem value={20}>2+ Years</MenuItem>
            <MenuItem value={30}>3+ Years</MenuItem>
          </Select>
        </Box> */}

        {/* <Box p={2}>
          <MuiTypography
            variant="subtitle1"
            fontWeight="600"
            color="#1A1A1A"
            mb={0.5}
          >
            Gender
          </MuiTypography>
          <Box>
            {getAllLookup?.data?.data
              ?.filter((item) => item?.type === "Gender")
              ?.map((gender, index) => {
                return (
                  <Button
                    key={index}
                    variant="contain"
                    bg="#fff"
                    color={`${gender === null ? "#E02828" : "#979797"}`}
                    sx={{
                      border: `1px solid ${
                        gender === null ? "#E02828" : "#E2E5ED"
                      }`,
                      mr: 1,
                    }}
                    onClick={() => setGender(null)}
                  >
                    {gender?.value}
                  </Button>
                );
              })}
          </Box>
        </Box> */}

        {/* <Box p={2}>
          <MuiTypography
            variant="subtitle1"
            fontWeight="600"
            color="#1A1A1A"
            mb={0.5}
          >
            Fee Range
          </MuiTypography>
          <Slider
            defaultValue={50}
            aria-label="Default"
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `$ ${value}`}
            sx={{
              color: "#E02828",
            }}
          />
        </Box> */}

        {/* <Box p={2} display="flex" justifyConten="space-between">
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
              placeholder="$ 100.00"
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
              placeholder="$ 100.00"
              {...INPUT_FIELD_PROPS_SEARCH}
              sx={INPUT_FIELD_STYLES_SEARCH.sx}
              variant="standard"
            />
          </Box>
        </Box> */}
        <Box
          p={2}
          display="flex"
          flexWrap="wrap"
          justifyContent="space-between"
          width="100%"
          background="yellow"
          alignItems="center"
        
        >
          <Box
            sx={{
              width: { xs: "100%", lg: "auto" },
              marginRight: { xs: 0, lg: 1 ,},
              marginTop: {xl:1},
              // marginBottom: { xs: "20px", lg: 2 },
            }}
          >
            <Button
              onClick={applyFiltersHandler}
              variant="contain"
              bg="#E02828"
              color="#fff"
              height="45px"
              radius="12px"
              sx={{
                width: { xs: "100%", lg: "175px" },
              }}
            >
              {isLoading ? <BeatLoader color="#fff" size="10px" /> : "Filter"}
            </Button>
          </Box>

          <Box
            sx={{
              width: { xs: "100%", lg: "auto" },
              // marginLeft: { xs: 0, lg: 1 },
              marginTop: {xl:1},
              display: "flex",
              // justifyContent:"center",
            }}
          >
            <Button
              onClick={clearFiltersHandler}
              variant="contain"
              bg="#E02828"
              color="#fff"
              height="45px"
              radius="12px"
              sx={{
                width: { xs: "100%", lg: "175px" },
              }}
            >
              Clear Filter
            </Button>
          </Box>
        </Box>
      </Box>
    </StyledUserContainer>
  );
}
