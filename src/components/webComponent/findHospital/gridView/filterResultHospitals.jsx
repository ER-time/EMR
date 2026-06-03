"use client";

import styled from "styled-components";
import { Chip, Grid } from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import Image from "next/image";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import SnowshoeingIcon from '@mui/icons-material/Snowshoeing';
import LocationOnIcon from "@mui/icons-material/LocationOn";

import { Box, Button } from "@/components";
import MuiTypography from "@/components/core/Typography";
import useScreenWidth from "@/hooks/useScreenWidth";
import { getDistanceFromLatLng } from "@/lib/utils";

const StyledHospitalContainer = styled(Box)`
  display: ${(props) =>
    props.screenWidth < 992
      ? props.showMessanger === false
        ? "none"
        : "flex"
      : "flex"};
`;
const ScrollableBox = styled(Box)`
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    width: 0;
    display: none;
  }
`;


export default function FilteredHospital({
  currentLocation,
  hospitalsList,
  changeLayoutTypeHandler,
  layoutType,
  showMessanger,
  setShowMessanger,
}) {
  const screenWidth = useScreenWidth();

  return (
    <StyledHospitalContainer
      screenWidth={screenWidth}
      showMessanger={showMessanger}
      sx={{
        borderLeft: `${
          screenWidth < 992 && !showMessanger ? "1px solid #C3C3C3" : "none"
        }`,
      }}
      display="flex"
      justifyContent="space-between"
      flexDirection="column"
      px={2}
    >
      <Box
        sx={{ borderBottom: "1px solid #E6E6E6" }}
        py={1}
        alignItems="center"
        display="flex"
      >
        {screenWidth < 992 && (
          <FilterAltIcon
            onClick={() => setShowMessanger(false)}
            sx={{ cursor: "pointer" }}
          />
        )}
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="center"
          sx={{ ml: 1 }}
        >
          <MuiTypography variant="body2" component="h6" fontWeight="400">
            {hospitalsList.length} results found
          </MuiTypography>
          <Box width="auto" display="flex" alignItems="center">
            <Box
              backgroundColor={`${
                layoutType === "GRID" ? "#348AF4" : "#E7F1FE"
              }`}
              width="36px"
              height="36px"
              mr={1}
              borderRadius="5px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              onClick={() => changeLayoutTypeHandler("GRID")}
            >
              <GridViewIcon
                sx={{
                  cursor: "pointer",
                  color: layoutType === "GRID" ? "#fff" : "#348AF4",
                  fontSize: "25px",
                }}
              />
            </Box>
            <Box
              backgroundColor={`${
                layoutType === "LIST" ? "#348AF4" : "#E7F1FE"
              }`}
              width="36px"
              height="36px"
              borderRadius="5px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              onClick={() => changeLayoutTypeHandler("LIST")}
            >
              <FormatListBulletedIcon
                sx={{
                  cursor: "pointer",
                  color: layoutType === "LIST" ? "#fff" : "#348AF4",
                  fontSize: "30px",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <ScrollableBox
        sx={{ flex: 1 }}
        p={2}
        backgroundColor="#fff"
        id="chatmodule"
        style={{ height: `calc(100vh - 349px)`, overflow: "auto" }}
      >
        <Grid container spacing={1}>
          {hospitalsList && hospitalsList?.length > 0
            ? hospitalsList.map((hospitalItem, index) => (
                <Grid key={index} item xs={12} lg={4} xl={3}>
                  <FindHospitalCard
                    key={index + 1}
                    data={hospitalItem}
                    currentLocation={currentLocation}
                  />
                </Grid>
              ))
            : "No Hospital Found"}
        </Grid>
      </ScrollableBox>
    </StyledHospitalContainer>
  );
}

const FindHospitalCard = ({ data, currentLocation }) => {
  return (
    <Box
      border="1px solid #E6E6E6"
      borderRadius="4px"
      px={1}
      py={2}
      height="100%"
    >
      {/* <Box display="flex" justifyContent="end">
        <ArrowRightAltIcon sx={{ color: "#999999" }} />
      </Box> */}
      <Image
        src={"/images/hospitalimage.png"}
        width={100}
        height={100}
        loading="lazy"
        style={{
          objectFit: "none",
          borderRadius: "100%",
          display: "block",
          margin: "auto",
        }}
        alt="user-img"
      />
      <Box>
        <MuiTypography
          variant="subtitle1"
          component="h6"
          color="#1A1A1A"
          textAlign="center"
          my={0.5}
          fontWeight="600"
        >
          {data?.name || ""}
        </MuiTypography>
      
        <Box textAlign="center" my={0.5}>
          <Chip
            label={data?.distance}
            sx={{
              background: "#E7F1FE",
              color: "#0B5DC1",
              fontSize: "12px",
              fontWeight: 400,
              height: "24px",
            }}
          />
        </Box>
        <Box display="flex" my={1}>
          <LocalPhoneIcon sx={{ fontSize: "15px" }} />
          <MuiTypography
            variant="body2"
            component="p"
            fontWeight="400"
            color="#4D4D4D"
            ml={1}
          >
            {data?.contact_number||"N/A"}
          </MuiTypography>
        </Box>
        <Box display="flex" my={1}>
          <SnowshoeingIcon sx={{ fontSize: "15px" }} />
          <MuiTypography
            variant="body2"
            component="p"
            fontWeight="400"
            color="#4D4D4D"
            ml={1}
          >
            {data?.estimated_travel_time||"N/A"}
          </MuiTypography>
        </Box>
        <Box display="flex" my={1}>
          <LocationOnIcon sx={{ fontSize: "15px" }} />
          <MuiTypography
            variant="body2"
            component="p"
            fontWeight="400"
            color="#4D4D4D"
            ml={1}
          >
            {data?.address || ""}
          </MuiTypography>
        </Box>
      </Box>
    </Box>
  );
};
