"use client";

import { Box, Grid, Paper } from "@mui/material";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

import { Button } from "@/components";
import MuiTypography from "@/components/core/Typography";
import { useEffect, useState } from "react";
import DatePicker from "@/components/core/DatePicker";
import { useGetDoctorSlotsQuery } from "@/redux/slices/sloting";
import { useSession } from "next-auth/react";
import moment from "moment";
import dayjs from "dayjs";
import CreateSlotModal from "@/components/webComponent/CreateSlotModal/index";

const PAPER_PROPS = {
  backgroundColor: "#fff",
  boxShadow: "0px 0px 24px 0px #0000000A",
};

export default function BookAppointments() {
  const [createSlotModalShow, setCreateSlotModalShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");
  const [selectedRadioButton, setSelectedRadioButton] = useState("Available");

  const session = useSession();
  const doctorId = session?.data?.user?.user?.userId;
  const dayOfWeek = moment(selectedDate).format("dddd");

  const { data: doctorSlots, isLoading } = useGetDoctorSlotsQuery(
    {
      doctorId: doctorId,
      date: moment(selectedDate).format("YYYY-MM-DD"),
      // date: "2024-04-24T12:18:23.544Z",
    },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    const today = moment(selectedDate);
    const formattedDate = today.format("YYYY-MM-DD");
    setFormattedDate(formattedDate);
  }, []);

  const handleRadioButtonChange = (value) => {
    setSelectedRadioButton(value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(moment(new Date(date)).format("YYYY-MM-DD"));
  };

  const filteredSlots = doctorSlots?.data?.filter((slotItem) => {
    if (selectedRadioButton === "Available") {
      return slotItem.status === "Available";
    } else if (selectedRadioButton === "Booked") {
      return slotItem.status === "Booked";
    }
    return true;
  });

  return (
    <div>
      <Button
        sx={{
          mr: 1,
          fontSize: "18px",
          display: "block",
          ml: "auto",
          mb: "10px",
        }}
        variant="contain"
        bg="#E02828"
        color="#FFFFFF"
        height="52px"
        radius="12px"
        width="164px"
        onClick={() => setCreateSlotModalShow(true)}
      >
        Create Slots
      </Button>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
          <Paper sx={{ ...PAPER_PROPS, padding: "22px 38px 22px 26px" }}>
            {isLoading === true ? (
              <Box display="flex" justifyContent="center">
                Loading...
              </Box>
            ) : (
              <>
                <Box
                  width="100%"
                  display="flex"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  my={2}
                >
                  <DatePicker
                    defaultValue={dayjs(new Date())}
                    selected={selectedDate}
                    onChange={handleDateChange}
                  />

                  <MuiTypography
                    sx={{ mt: 2, mb: 1 }}
                    variant="h5"
                    component="h5"
                    fontWeight="500"
                    color="#000"
                  >
                    {`${dayOfWeek} ${moment(selectedDate).format(
                      "YYYY-MM-DD"
                    )}`}
                  </MuiTypography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      cursor:'pointer'
                    }}
                  >
                    <MuiTypography
                      sx={{
                        mt: 2,
                        mb: 1,
                        mr: 2,
                        cursor: "pointer",
                      }}
                      variant="p"
                      component="p"
                      fontWeight="500"
                      color="#3E3E3E"
                      display="flex"
                      alignItems="center"
                      onClick={() => handleRadioButtonChange("Booked")}
                    >
                      <RadioButtonCheckedIcon
                        sx={{
                          color:
                            selectedRadioButton === "Booked"
                              ? "#E02828"
                              : "#F2F3F2",
                          marginRight: "10px",
                        }}
                      />
                      {selectedRadioButton === "Booked"
                        ? "Booked slots"
                        : "Booked slots"}
                    </MuiTypography>
                    <MuiTypography
                      sx={{ mt: 2, mb: 1, cursor: "pointer" }}
                      variant="p"
                      component="p"
                      fontWeight="500"
                      color="#3E3E3E"
                      display="flex"
                      alignItems="center"
                      onClick={() => handleRadioButtonChange("Available")}
                    >
                      <RadioButtonCheckedIcon
                        sx={{
                          color:
                            selectedRadioButton === "Available"
                              ? "#E02828"
                              : "#F2F3F2",
                          marginRight: "10px",
                        }}
                      />
                      {selectedRadioButton === "Available"
                        ? "Available slots"
                        : "Available slots"}
                    </MuiTypography>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  {filteredSlots?.length > 0 ? (
                    filteredSlots?.map((slotItem) => {
                      // Convert start time from UTC to local time
                      const slotStartTimeLocal = moment
                        .utc(slotItem?.startDateTime)
                        .local()
                        .format("hh:mm A");

                      // Convert end time from UTC to local time
                      const slotEndTimeLocal = moment
                        .utc(slotItem?.endDateTime)
                        .local()
                        .format("hh:mm A");

                      return (
                        <Grid
                          key={slotItem.id}
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={3}
                        >
                          <Button
                            key={slotItem.doctorId}
                            variant="contain"
                            bg={`${
                              slotItem.status === "Booked"
                                ? "#F2F2F2"
                                : "#FCE9E9"
                            }`}
                            color={`${
                              slotItem.status === "Booked"
                                ? "#4A4F4D"
                                : "#2E3130"
                            }`}
                            height="54px"
                            radius="3px"
                            width="100%"
                            sx={{ fontWeight: "500" }}
                          >
                            {`${slotStartTimeLocal} - ${slotEndTimeLocal}`}
                          </Button>
                        </Grid>
                      );
                    })
                  ) : (
                    <MuiTypography
                      style={{
                        display: "block",
                        textAlign: "center",
                        margin: "30px auto",
                      }}
                    >
                      No Slots Available
                    </MuiTypography>
                  )}
                </Grid>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* {createSlotModalShow && (
        <CreateSlotsModal
          open={createSlotModalShow}
          handleClose={() => setCreateSlotModalShow(false)}
          tittle="Time Slot Creation"
        />
      )} */}
      {/* {createSlotModalShow && (
        <CreateSlotsModal
          open={createSlotModalShow}
          handleClose={() => setCreateSlotModalShow(false)}
          tittle="Time Slot Creation"
        />
      )} */}
      {createSlotModalShow && (
        <CreateSlotModal
          open={createSlotModalShow}
          handleClose={() => setCreateSlotModalShow(false)}
          tittle="Time Slot Creation"
        />
      )}
    </div>
  );
}
