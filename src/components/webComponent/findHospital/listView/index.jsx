import { useEffect, useState } from "react";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import {
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Slider,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import Image from "next/image";
import styled from "styled-components";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { Box, Button } from "@/components";
import MuiTypography from "@/components/core/Typography";
import GridViewIcon from "@mui/icons-material/GridView";
import InputField from "@/components/core/Input";
import GoogleMapReact from "google-map-react";
import axios from "axios";
import { Loader1 } from "@/components/core/Loader/Loader";
import Marker from "./marker";
import { SearchBox } from "../readySearchBox";
import SnowshoeingIcon from "@mui/icons-material/Snowshoeing";

const minDistance = 10;

const ScrollableBox = styled(Box)`
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    width: 0;
    display: none;
  }
  background: ${(props) =>
    props.selectedInbox ? "rgba(224, 40, 40, 0.274)" : "transparent"};
`;

const PAPER_PROPS = {
  flexDirection: "row",
  justifyContent: "space-between",
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "0px 4px 15px 0px #00000029",
  p: 4,
};

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

export default function FindHospitalListView({
  location,
  layoutType,
  changeLayoutTypeHandler,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [hospitalsList, setHospitalsList] = useState([]);
  const [selectHospital, setSelectHospital] = useState(null);

  const [value, setValue] = useState([20, 80]);

  useEffect(() => {
    setIsLoading(true);
    if (location) {
      axios
        .post(
          "https://medical-aibe.xeventechnologies.com/get_nearby_hospitals",
          {
            lattitude: location?.lattitude,
            longitude: location?.longitude,
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
    } else {
      setIsLoading(false);
    }
  }, [location]);

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

  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  };

  const AnyReactComponent = ({ text }) => <div>{text}</div>;

  return (
    <Paper sx={{ ...PAPER_PROPS }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <MuiTypography variant="body2" component="h6" fontWeight="400">
            {hospitalsList?.length} results found
          </MuiTypography>
        </Box>
        <Box display="flex" alignItems="center" sx={{ flex: 1 }}>
          <Box
            backgroundColor={`${layoutType === "GRID" ? "#348AF4" : "#E7F1FE"}`}
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
            backgroundColor={`${layoutType === "LIST" ? "#348AF4" : "#E7F1FE"}`}
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

      <Box
        width="auto"
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
      >
        {/* style={{ minWidth: "400px", padding: "10px" }} */}
        <Box style={{ maxWidth: "400px" }}>
          <MuiTypography
            variant="subtitle1"
            fontWeight="600"
            color="#1A1A1A"
            mb={0.5}
          >
            Search
          </MuiTypography>

          <SearchBox
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
                    console.log("error>>>>>> i am trigger", error);
                  });
              }
              // form.setValue("address", address);
              // form.setValue("latitude", lat);
              // form.setValue("longitude", lng);
            }}
            // defaultValue={form.getValues("address")}
            // {...field}
          />
        </Box>
        {/* <Box width="auto" display="flex" flexWrap="wrap" justifyContent="end">
          <div
            style={{
              padding: "10px",
              minWidth: "150px",
              // width: "100%",
            }}
          >
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
          </div>

          <div
            style={{
              padding: "10px",
              minWidth: "150px",
              // width: "100%",
            }}
          >
            <MuiTypography
              variant="subtitle1"
              fontWeight="600"
              color="#1A1A1A"
              mb={0.5}
            >
              Distance
            </MuiTypography>
            <Slider
              // defaultValue={[50, 70]}
              // value={value}
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
          </div>

          <div style={{ minWidth: "150px", padding: "10px" }}>
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
              {...INPUT_FIELD_PROPS_SEARCH}
              sx={INPUT_FIELD_STYLES_SEARCH.sx}
              variant="standard"
            />
          </div>

          <div style={{ minWidth: "150px", padding: "10px" }}>
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
              placeholder="50 Miles"
              {...INPUT_FIELD_PROPS_SEARCH}
              sx={INPUT_FIELD_STYLES_SEARCH.sx}
              variant="standard"
            />
          </div>
        </Box> */}
      </Box>

      <Box my={2}>
        <Grid container spacing={1}>
          {selectHospital && selectHospital && (
            <Grid item xs={12} lg={4} xl={4}>
              <Box width="100%" height="500px" sx={{ position: "relative" }}>
                <GoogleMapReact
                  bootstrapURLKeys={{ key: "" }}
                  defaultCenter={defaultProps.center}
                  defaultZoom={defaultProps.zoom}
                  center={{
                    lat: selectHospital?.latitude || defaultProps.center.lat,
                    lng: selectHospital?.longitude || defaultProps.center.lng,
                  }}
                >
                  <Marker
                    lat={selectHospital?.latitude || defaultProps.center.lat}
                    lng={selectHospital?.longitude || defaultProps.center.lng}
                    text="My Marker"
                  />
                </GoogleMapReact>
              </Box>
            </Grid>
          )}
          <Grid
            item
            xs={12}
            lg={selectHospital ? 8 : 12}
            xl={selectHospital ? 8 : 12}
          >
            <ScrollableBox style={{ height: "600px", overflow: "auto" }}>
              {isLoading ? (
                <Box p="30px">
                  <Loader1 />
                </Box>
              ) : (
                <>
                  {hospitalsList && hospitalsList?.length > 0
                    ? hospitalsList.map((hospitalItem, index) => (
                        <HospitalCard
                          setSelectHospital={setSelectHospital}
                          key={index + 1}
                          data={hospitalItem}
                          currentLocation={location}
                          selectHospital={selectHospital}
                        />
                      ))
                    : "No Hospital Found"}
                </>
              )}
            </ScrollableBox>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

const StyledCard = styled(Box)`
  cursor: pointer;
  margin-bottom: 15px;
  && {
    :hover {
      border-color: #e02828;
      background: #fce9e9;
      button {
        background: #e02828 !important;
        color: #fff !important;
      }
    }
  }
  background: ${(props) =>
    props.selectedInbox ? "rgba(224, 40, 40, 0.274)" : "transparent"};
`;

const StyledBox = styled(Box)`
  @media (max-width: 780px) {
    width: 100% !important;
    & > button {
      width: 100%;
    }
  }
`;

const HospitalCard = ({ data, setSelectHospital, selectHospital }) => {
  const isSelected = selectHospital?.latitude === data.latitude;
  return (
    <StyledCard
      border="2px solid#E5E6E6"
      borderRadius="8px"
      px={1}
      py={1}
      onClick={() =>
        setSelectHospital({
          latitude: data?.latitude,
          longitude: data?.longitude,
        })
      }
      selectedInbox={isSelected}
    >
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
      >
        {/* <Box sx={{ flex: 1 }}> */}
        <Box
          display="flex"
          // flexWrap="wrap"
          // justifyContent="center"
          alignItems="center"
          width="auto"
        >
          <Image
            src={"/images/hospitalimage.png"}
            width={70}
            height={70}
            loading="lazy"
            style={{
              objectFit: "cover",
              borderRadius: "10px",
              display: "block",
              // margin: "auto",
              marginRight: "8px",
              // flex: 1,
            }}
            alt="user-img"
          />
          <Box width="auto">
            <MuiTypography
              variant="body1"
              fontWeight="500"
              component="h6"
              color="#1A1A1A"
            >
              {data?.name || ""}
            </MuiTypography>
            <MuiTypography
              variant="body2"
              fontWeight="400"
              component="p"
              color="#4D4D4D"
              sx={{ lineHeight: "14px" }}
            >
              {data?.address || ""}
            </MuiTypography>
            {/* <MuiTypography
              fontWeight="400"
              color="#000"
              variant="subtitle1"
              component="label"
            >
              8080 Railroad St.
            </MuiTypography> */}
          </Box>
        </Box>
        {/* </Box> */}

        <StyledBox sx={{ width: "auto" }}>
          {/* <Button
            bg="#FAEAEA"
            sx={{
              color: "#E02828",
              fontSize: "12px",
              fontWeight: "500",
              minWidth: "160px",
              width: "auto",
            }}
          >
            Select Hospital
          </Button> */}
          <MuiTypography
            variant="subtitle1"
            component="p"
            textAlign="end"
            color="#4D4D4D"
            sx={{ fontSize: "12px", mt: 1 }}
          >
            <span
              style={{
                fontWeight: "700",
                color: "#000",
              }}
            >
              {data?.distance}
            </span>
          </MuiTypography>
          <Box display="flex" my={1}>
            <LocalPhoneIcon sx={{ fontSize: "15px" }} />
            <MuiTypography
              variant="body2"
              component="p"
              fontWeight="400"
              color="#4D4D4D"
              ml={1}
            >
              {data?.contact_number || "N/A"}
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
              {data?.estimated_travel_time || "N/A"}
            </MuiTypography>
          </Box>
        </StyledBox>
      </Box>
    </StyledCard>
  );
};
