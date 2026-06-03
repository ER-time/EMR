"use client";
import { useState } from "react";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import {
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Slider,
  Typography,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import Image from "next/image";
import styled from "styled-components";

import { Box, Button } from "@/components";
import MuiTypography from "@/components/core/Typography";
import GridViewIcon from "@mui/icons-material/GridView";
import InputField from "@/components/core/Input";
import { useRouter } from "next/navigation";
import { useGetAllDoctorMutation } from "@/redux/slices/doctors";
import { useEffect } from "react";
import {
  useGetAllLanguagesQuery,
  useGetAllSpecialitiesQuery,
  useGetLookupByValueQuery,
} from "@/redux/slices/lookups";
import { BeatLoader } from "react-spinners";
import RequestQuestionsModal from "../../../book-appointments/parts/requestQuestions";
import { useCannotAffordMutation } from "@/redux/slices/chat";
import { onFailure } from "@/redux/features/apiStatusSlice";
import { useDispatch } from "react-redux";

const minDistance = 10;

const StyledBox = styled(Box)`
  @media (max-width: 662px) {
    width: 100% !important;
    & > button {
      width: 100%;
    }
  }
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

const FindDoctorListView = ({
  layoutType,
  changeLayoutTypeHandler,
  getCannotAffordData,
  getCannotAffordDataLoading,
}) => {
  const PAPER_PROPS = {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0px 4px 15px 0px #00000029",
    p: 2,
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
  const [specialty, setSpecialty] = useState(null);
  const [searchDoctor, setSearchDoctor] = useState(null);
  const [languageId, setLanguageId] = useState(null);
  const [genderID, setGenderID] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [value1, setValue1] = useState([20, 37]);
  const [error, setError] = useState(null);
  const [reset, setReset] = useState(null);
  const [open, setOpen] = useState(false);
  const [showSelectedImage, setSelectedImage] = useState(null);
  console.log("showSelectedImage::::", showSelectedImage);
  const [getAllDoctor, { data: getDoctorsList }] = useGetAllDoctorMutation();
  const getAllSpecialitie = useGetAllSpecialitiesQuery();
  const getAllLanguages = useGetAllLanguagesQuery();
  const getAllLookup = useGetLookupByValueQuery("Gender");
  const dispatch = useDispatch();

  const [
    CannotAfford,
    { data: CannotAffordData, isLoading: CannotAffordLoading },
  ] = useCannotAffordMutation();

  const callApiHandler = async () => {
    const response = await CannotAfford({ query: "i cant afford" });
  };

  const handleChangeLanguage = (event) => {
    setLanguageId(event.target.value);
  };

  useEffect(() => {
    try {
      let finalPayload = {
        pageNo: pageNo,
        pageSize: 80,
      };
      getAllDoctor(finalPayload).unwrap();
    } catch (err) {
      console.log("err", err);
    }
  }, [reset]);

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

  const handleSelectChange = (event) => {
    setSpecialty(event.target.value);
  };

  const handleChangeGender = (event) => {
    setGenderID(event.target.value);
  };

  const applyFiltersHandler = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        pageNo: pageNo,
        pageSize: 80,
        search: searchDoctor,
        specializationId: specialty,
        genderId: genderID,
        languageId: languageId,
      };
      await getAllDoctor(payload).unwrap();
    } catch (error) {
      setError(error.message || "An error occurred while fetching data");
    }

    setIsLoading(false);
  };

  const clearFiltersHandler = () => {
    setSpecialty(null);
    setSearchDoctor("");
    setLanguageId(null);
    setGenderID(null);
    setPageNo(1);
    setReset(!reset);
  };
  return (
    <Paper sx={{ ...PAPER_PROPS }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <MuiTypography variant="body2" component="h6" fontWeight="400">
            {getDoctorsList?.totalCounts || "N/A"} results found
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
        alignItems="center"
        flexWrap="wrap"
        justifyContent="space-between"
      >
        <Box width="auto" display="flex" flexWrap="wrap">
          <div style={{ minWidth: "300px", padding: "10px" }}>
            <MuiTypography
              variant="subtitle1"
              fontWeight="600"
              color="#1A1A1A"
              mb={0.5}
            >
              Search
            </MuiTypography>
            <InputField
              id="search"
              value={searchDoctor}
              onChange={(e) => setSearchDoctor(e.target.value)}
              placeholder="Search by hospital name"
              {...INPUT_FIELD_PROPS_SEARCH}
              sx={INPUT_FIELD_STYLES_SEARCH.sx}
              variant="standard"
              endAdornment={
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              }
            />
          </div>

          <FormControl sx={{ minWidth: 300, padding: "10px" }}>
            <MuiTypography
              variant="subtitle1"
              fontWeight="600"
              color="#1A1A1A"
              mb={0.5}
            >
              Speciality
            </MuiTypography>

            <Select
              value={specialty}
              onChange={handleSelectChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              fullWidth
              sx={INPUT_FIELD_STYLES.sx}
              MenuProps={{
                style: {
                  maxHeight: 350,
                },
              }}
            >
              {getAllSpecialitie?.data?.data?.map((item, index) => {
                return (
                  <MenuItem value={item?.specializationId} key={index}>
                    {item?.title}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          {/* <div
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
              Language
            </MuiTypography>
            <Select
              value={languageId || ""}
              onChange={handleChangeLanguage}
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
          </div> */}
        </Box>

        {/* <div
          style={{
            padding: "10px",
            maxWidth: "150px",
            width: "100%",
          }}
        >
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
        </div> */}
        {/* 
        <div
          style={{
            padding: "10px",
            maxWidth: "150px",
            width: "100%",
          }}
        >
          <MuiTypography
            variant="subtitle1"
            fontWeight="600"
            color="#1A1A1A"
            mb={0.5}
          >
            Gender
          </MuiTypography>
          <Select
            value={genderID}
            onChange={handleChangeGender}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            labe=""
            fullWidth={true}
            sx={INPUT_FIELD_STYLES.sx}
          >
            {getAllLookup?.data?.data
              ?.filter((item) => item?.type === "Gender")
              ?.map((gender, index) => {
                return (
                  <MenuItem key={index} value={gender?.lookupId}>
                    {gender?.value}
                  </MenuItem>
                );
              })}
          </Select>
        </div> */}

        {/* <div
          style={{
            padding: "10px",
            maxWidth: "150px",
            width: "100%",
          }}
        >
          <MuiTypography
            variant="subtitle1"
            fontWeight="600"
            color="#1A1A1A"
            mb={0.5}
          >
            Fee Range
          </MuiTypography>
          <Slider
            // defaultValue={[50, 70]}
            // value={value}
            aria-label="Default"
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `$ ${value}`}
            sx={{
              color: "#E02828",
            }}
            // getAriaLabel={() => 'Minimum distance'}
            value={value1}
            onChange={handleChange1}
            disableSwap
          />
        </div> */}
        <Box
          width="auto"
          display="flex"
          flexWrap="wrap"
          justifyConten="space-between"
        >
          <Box mr={1} width="auto">
            <Button
              onClick={applyFiltersHandler}
              variant="contain"
              bg="#E02828"
              color="#fff"
              height="45px"
              width="130px"
              radius="12px"
            >
              {isLoading ? <BeatLoader color="#fff" size="10px" /> : "Filter"}
            </Button>
          </Box>

          <Box width="auto">
            <Button
              onClick={clearFiltersHandler}
              variant="contain"
              bg="#E02828"
              color="#fff"
              height="45px"
              width="130px"
              radius="12px"
            >
              Clear Filter
            </Button>
          </Box>
        </Box>
      </Box>
      <Box my={2}>
        <Grid container spacing={1}>
          {showSelectedImage && getDoctorsList?.totalCounts !== 0 && (
            <Grid item xs={12} lg={4} xl={4}>
              <Box
                width="100%"
                height="400px"
                sx={{
                  position: "relative",
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <img
                  src={
                    showSelectedImage?.profileImageURL ||
                    "/images/placeholderImage.png"
                  }
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover",
                    borderRadius: "10px 10px 0 0",
                  }}
                  alt="user-img"
                />
                <Box p={2}>
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    color="#333"
                    gutterBottom
                  >
                    {showSelectedImage?.doctor || "Doctor's Name"}
                  </Typography>
                  <Typography variant="body1" color="#666" gutterBottom>
                    <strong>Email:</strong> {showSelectedImage?.email || "N/A"}
                  </Typography>
                  <Typography variant="body1" color="#666" gutterBottom>
                    <strong>Address:</strong>{" "}
                    {showSelectedImage?.address || "N/A"}
                  </Typography>
                </Box>
              </Box>

              {/* <Button
            bg="#E02828"
            sx={{
              color: "#fff",
              fontSize: "12px",
              fontWeight: "500",
              width: "100%",
              margin: "10px 0px ",
              maxWidth: "230px",
            }}
          >
            Find Hospital
          </Button> */}
            </Grid>
          )}

          <Grid
            item
            xs={12}
            lg={showSelectedImage ? 8 : 12}
            xl={showSelectedImage ? 8 : 12}
          >
            {getDoctorsList?.totalCounts === 0 && (
              <Grid item xs={12}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    marginTop: "140px",
                  }}
                >
                  No Record to show
                </div>
              </Grid>
            )}

            <ScrollableBox style={{ height: "600px", overflow: "auto" }} px={2}>
              <Box display="flex" justifyContent="center" my="0px">
                <div>{getDoctorsList?.isLoading && <BeatLoader />}</div>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "end",
                  mb: 1,
                }}
              >
                {getCannotAffordData?.data?.[0]?.isAdminApproved === false &&
                getCannotAffordData?.data?.[0]?.isCount === true ? (
                  <Button
                    sx={{ mr: 1, fontSize: "18px" }}
                    variant="contain"
                    bg="#E02828"
                    color="#FFFFFF"
                    height="52px"
                    radius="12px"
                    width="164px"
                    // false true
                    onClick={() => {
                      setOpen(true);
                      callApiHandler();
                    }}
                  >
                    I can&apos;t Afford
                  </Button>
                ) : getCannotAffordData?.data === null ? (
                  <Button
                    sx={{ mr: 1, fontSize: "18px" }}
                    variant="contain"
                    bg="#E02828"
                    color="#FFFFFF"
                    height="52px"
                    radius="12px"
                    width="164px"
                    // disabled={true}
                    onClick={() => {
                      setOpen(true);
                      callApiHandler();
                    }}
                  >
                    I can&apos;t Afford
                  </Button>
                ) : (
                  <Button
                    sx={{ mr: 1, fontSize: "18px" }}
                    variant="contain"
                    bg="grey"
                    color="#FFFFFF"
                    height="52px"
                    radius="12px"
                    width="164px"
                    disabled={false}
                    onClick={() => {
                      dispatch(
                        onFailure({
                          message:
                            "You request has been already sent to Admin for Approval ",
                        })
                      );
                      // setOpen(true);
                      // callApiHandler();
                    }}
                  >
                    I can&apos;t Afford
                  </Button>
                )}
              </Box>
              <DoctorCard
                getCannotAffordData={getCannotAffordData}
                setSelectedImage={setSelectedImage}
                showSelectedImage={showSelectedImage}
                doctorList={getDoctorsList?.data}
              />
            </ScrollableBox>
          </Grid>
        </Grid>
      </Box>
      {open && (
        <RequestQuestionsModal
          open={open}
          CannotAffordLoading={CannotAffordLoading}
          handleClose={() => setOpen(false)}
          CannotAffordData={CannotAffordData}
        />
      )}
    </Paper>
  );
};
export default FindDoctorListView;
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

const DoctorCard = ({
  doctorList,
  setSelectedImage,
  getCannotAffordData,
  showSelectedImage,
}) => {
  const router = useRouter();

  const showSelectedId = (data) => {
    setSelectedImage(data);
  };

  return (
    <>
      {doctorList &&
        doctorList?.map((doctor, index) => {
          const isSelected = showSelectedImage?.userId === doctor.userId;
          return (
            <StyledCard
              border="2px solid#E5E6E6"
              borderRadius="8px"
              px={1}
              py={1}
              selectedInbox={isSelected}
              key={index}
              onClick={() => showSelectedId(doctor)}
            >
              <Box
                width="auto"
                display="flex"
                flexWrap="wrap"
                justifyContent="space-between"
                mx={1}
                alignItems="center"
              >
                <Box
                  width="auto"
                  display="flex"
                  alignItems="center"
                  onClick={() => showSelectedId(doctor)}
                >
                  <img
                    src={
                      doctor?.profileImageURL || "/images/placeholderImage.png"
                    }
                    style={{
                      width: 70,
                      height: 70,
                      objectFit: "cover",
                      borderRadius: "100%",
                      display: "block",
                      margin: "auto",
                      marginRight: "8px",
                    }}
                    alt="user-img"
                  />
                  <Box>
                    <MuiTypography
                      variant="body1"
                      fontWeight="600"
                      component="h6"
                      color="#1A1A1A"
                    >
                      {doctor?.doctor}
                    </MuiTypography>
                    <MuiTypography
                      variant="body2"
                      fontWeight="400"
                      component="p"
                      color="#4D4D4D"
                      sx={{ lineHeight: "14px" }}
                    >
                      {" "}
                      {doctor?.specializations?.length > 0
                        ? doctor?.specializations.map((specializations) => {
                            return specializations?.title || "N/A";
                          })
                        : "N/A"}
                    </MuiTypography>
                    <MuiTypography
                      fontWeight="400"
                      color="#000"
                      variant="subtitle1"
                      component="label"
                    >
                      {doctor?.address}
                    </MuiTypography>
                  </Box>
                </Box>
                <StyledBox width="auto">
                  <Button
                    bg="#FAEAEA"
                    sx={{
                      color: "#E02828",
                      fontSize: "12px",
                      fontWeight: "500",
                      minWidth: "160px",
                      width: "100%",
                    }}
                    onClick={() =>
                      router.push(
                        `/patient/book-appointments?doctorId=${doctor.userId}&isAdminApproved=${getCannotAffordData?.data?.[0]?.isAdminApproved}`
                      )
                    }
                  >
                    Book an Appointment
                  </Button>
                  {/* <MuiTypography
                    fontWeight="600"
                    color="#000"
                    variant="subtitle1"
                    component="p"
                    textAlign="end"
                  >
                    ${doctor?.doctorFee || "100"}
                  </MuiTypography> */}
                </StyledBox>
              </Box>
            </StyledCard>
          );
        })}
    </>
  );
};
