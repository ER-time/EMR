"use client";

import styled from "styled-components";
import { Chip, Grid, Typography } from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import { Box, Button } from "@/components";
import MuiTypography from "@/components/core/Typography";
import useScreenWidth from "@/hooks/useScreenWidth";
import { useRouter } from "next/navigation";
import {
  useGetAllLanguagesQuery,
  useGetAllSpecialitiesQuery,
  useGetLookupByValueQuery,
} from "@/redux/slices/lookups";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { LoaderPageWithoutBG } from "@/components/core/Loader/Loader";
import RequestQuestionsModal from "../../../book-appointments/parts/requestQuestions";
import { useCannotAffordMutation } from "@/redux/slices/chat";
import { useGetCannotAffordMutation } from "@/redux/slices/iCantAfford";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";

const StyledUserChatContainer = styled(Box)`
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
export default function ChatRoom({
  changeLayoutTypeHandler,
  layoutType,
  showMessanger,
  setShowMessanger,
  getDoctorsList,
  getCannotAffordData,
  getCannotAffordDataLoading,
}) {
  const screenWidth = useScreenWidth();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const session = useSession();
  const [getCannotAfford, { data, isLoading }] = useGetCannotAffordMutation();
  useEffect(() => {
    async function fetchCannotAfford() {
      try {
        const payload = { patientId: session?.data?.user?.user?.userId };
        const response = await getCannotAfford(payload);
        if (response?.data?.succeeded === true) {
          console.log("Record fetch successfully");
        } else {
          console.log("Record fetch successfully");
        }
      } catch (error) {
        console.log("Error Occur while fetching records");
      }
    }
    if (session) fetchCannotAfford();
  }, [session]);

  const [
    CannotAfford,
    { data: CannotAffordData, isLoading: CannotAffordLoading },
  ] = useCannotAffordMutation();

  const callApiHandler = async () => {
    const response = await CannotAfford({ query: "i cant afford" });
  };

  if (getDoctorsList?.totalCounts === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        No Record to show
      </div>
    );
  }
  return (
    <StyledUserChatContainer
      screenWidth={screenWidth}
      showMessanger={showMessanger}
      sx={{
        borderLeft: `${
          screenWidth < 992 && !showMessanger ? "1px solid #C3C3C3" : "none"
        }`,
        width: { xs: "100%", lg: "70%" },
      }}
      display="flex"
      flexWrap="wrap"
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
            {getDoctorsList?.totalCounts || "N/A"} results found
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
        <Box display="flex" justifyContent="center" my="2px">
          <div>{getDoctorsList?.isLoading && <BeatLoader />}</div>
        </Box>
        <Box
          sx={{ display: "flex", width: "100%", justifyContent: "end", mb: 5 }}
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
              }}
            >
              I can&apos;t Afford
            </Button>
          )}
        </Box>

        <FindDoctorCard
          doctorList={getDoctorsList?.data}
          data={getCannotAffordData}
        />
      </ScrollableBox>
      {open && (
        <RequestQuestionsModal
          open={open}
          CannotAffordLoading={CannotAffordLoading}
          handleClose={() => setOpen(false)}
          CannotAffordData={CannotAffordData}
        />
      )}
    </StyledUserChatContainer>
  );
}

const FindDoctorCard = ({ doctorList, data }) => {
  console.log("data::::", data);
  const router = useRouter();
  const [loadingMap, setLoadingMap] = useState({});
  const handleBookAppointmentClick = (doctorId) => {
    setLoadingMap((prevLoadingMap) => ({
      ...prevLoadingMap,
      [doctorId]: true,
    }));
    router.push(
      `/patient/book-appointments?doctorId=${doctorId}&&isAdminApproved=${
        data?.data === null ? false : data?.data?.[0]?.isAdminApproved
      }`
    );
  };
  return (
    <Grid container spacing={2}>
      {doctorList &&
        doctorList.map((doctor, index) => {
          const isLoading = loadingMap[doctor.userId];
          console.log("doctor::::",doctor);
          return (
            <Grid
              item
              key={index}
              xs={12}
              lg={4}
              xl={3}
              style={{ paddingTop: 0, paddingBottom: "16px" }}
            >
              <Box border="1px solid #E6E6E6" borderRadius="4px" p={2}>
                <Box display="flex" justifyContent="space-between">
                  <Typography
                    fontWeight="600"
                    color="#000"
                    variant="subtitle1"
                    component="label"
                  >
                    ${doctor?.doctorFee || "100"}
                  </Typography>
                 {/* <ArrowRightAltIcon sx={{ color: "#999999" }} />  */}
                </Box>
                <img
                  src={
                    doctor?.profileImageURL !== null
                      ? doctor?.profileImageURL
                      : "/images/placeholderImage.png"
                  }
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: "100%",
                    display: "block",
                    margin: "auto",
                  }}
                  alt="user-img"
                />
                <Box>
                  <Typography
                    variant="subtitle1"
                    component="h6"
                    color="#1A1A1A"
                    textAlign="center"
                    fontWeight="600"
                    my={1}
                  >
                    {doctor?.doctor}
                  </Typography>
                  <Box textAlign="center" my={1}>
                    <Chip
                      label={
                        doctor?.specializations?.length > 0
                          ? doctor?.specializations.map((specializations) => {
                              return specializations?.title || "N/A";
                            })
                          : "N/A"
                      }
                      sx={{
                        background: "#E7F1FE",
                        color: "#0B5DC1",
                        fontSize: "12px",
                        fontWeight: 400,
                        height: "24px",
                      }}
                    />
                  </Box>
                  <Button
                    bg="#FAEAEA"
                    sx={{
                      color: "#E02828",
                      fontSize: "12px",
                      fontWeight: "500",
                      display: "block",
                      margin: "15px auto 0px auto",
                    }}
                    onClick={() => handleBookAppointmentClick(doctor.userId)}
                  >
                    {isLoading ? (
                      <BeatLoader color="#fff" size="10px" />
                    ) : (
                      "Book an Appointment"
                    )}
                  </Button>
                </Box>
              </Box>
            </Grid>
          );
        })}
    </Grid>
  );
};
