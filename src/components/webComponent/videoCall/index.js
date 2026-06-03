import React, { useEffect, useRef, useState } from "react";
import VideoSectionSection from "./videoSection";
import { Grid } from "@mui/material";
import "./final.css";
import { useVonageTokenMutation } from "@/redux/slices/video";
import { useSession } from "next-auth/react";
import { Loader1 } from "@/components/core/Loader/Loader";
import BasicTabs from "@/components/core/Tabs";
import CustomTabPanel from "@/components/core/Tabs/tabPanel";
import MedicalHistory from "../medicalHistory";
import PatientAssessment from "../patientAssessment";
import { Box } from "@/components/core";
import {
  useGetSingleAppointmentQuery,
  useLazyGetSingleAppointmentQuery,
} from "@/redux/slices/appointments";
import { useParams, useRouter } from "next/navigation";
import ChatRoom from "./chatRoom";
import PatientProfileVideoSection from "../generalProfileVideoSection/profile";
import { SOCKET_URI, USER_ROLE } from "@/config";
import { useLazyGetAllConversationDetailsQuery, useLazyGetAllInboxesQuery } from "@/redux/slices/socketChat";
import { io } from "socket.io-client";
import useScreenWidth from "@/hooks/useScreenWidth";

export default function VideoConsultation(props) {
  const params = useParams();
  const [
    getSingleAppointment,
    { data: appointmentData, isLoading: appointmentLoading },
  ] = useLazyGetSingleAppointmentQuery(params?.appointment);
  console.log("appointmentData", appointmentData);
  const session = useSession();
  const router = useRouter();
  const [
    mutate,
    { data: tokenData, error: tokenError, isLoading: tokenLoading },
  ] = useVonageTokenMutation();

  // useEffect(() => {
  //   // debugger
  //   if (appointmentData?.data?.vonageSessionId) {
  //     const fetchToken = async () => {
  //       try {
  //         await mutate({ sessionId: appointmentData?.data?.vonageSessionId });
  //         console.log("Token fetched successfully");
  //       } catch (error) {
  //         console.error("Error fetching token:", error);
  //       }
  //     };
  //     fetchToken();
  //   } else {
  //     if (session?.data?.user?.user?.roleId === USER_ROLE?.doctor) {
  //       router.push("/doctor/appointments");
  //     } else {
  //       router.push("/patient/my-appointments");
  //     }
  //   }
  // }, [appointmentData?.data?.vonageSessionId, session]);

  useEffect(() => {
    // debugger
    let fetchAppointment = async () => {
      let response = await getSingleAppointment(params?.appointment);
      if (response?.data?.data?.vonageSessionId) {
        console.log("Trigger if Part");
        const fetchToken = async () => {
          try {
            await mutate({ sessionId: response?.data?.data?.vonageSessionId });
            console.log("Token fetched successfully");
          } catch (error) {
            console.error("Error fetching token:", error);
          }
        };
        fetchToken();
      } else {
        console.log("Trigger Else Part");
        if (session?.data?.user?.user?.roleId === USER_ROLE?.doctor) {
          router.push("/doctor/appointments");
        } else {
          router.push("/patient/my-appointments");
        }
      }
    };
    console.log("appointmentData", appointmentData);

    if (params?.appointment) {
      fetchAppointment();
    }
  }, [params?.appointment]);

  if (tokenLoading || appointmentLoading) {
    return <Loader1 />;
  }

  if (tokenData?.data?.token && appointmentData?.data?.vonageSessionId) {
    return (
      <VideoCallingSection
        appointmentData={appointmentData}
        tokenId={tokenData?.data?.token}
        sessionId={appointmentData?.data?.vonageSessionId}
        appointmentLoading={appointmentLoading}
      />
    );
  }
}

function VideoCallingSection({
  tokenId,
  sessionId,
  appointmentData,
  appointmentLoading,
}) {
  const [showMessanger, setShowMessanger] = useState(false);
  const [value, setValue] = useState(0);
  const chatContainerRef = useRef(null);
  const session = useSession();
  const params = useParams();

  //
  const screenWidth = useScreenWidth();

  const [messages, setMessages] = useState([]);
  const [selectedInbox, setSelectedInbox] = useState(appointmentData&& appointmentData?.data);
  const socket = io(SOCKET_URI);


  const [
    GetAllConversationDetails,
    {
      data: GetAllConversationDetailsData,
      isLoading: GetAllConversationDetailsLoading,
    },
  ] = useLazyGetAllConversationDetailsQuery();
  useEffect(() => {
    if (session) {
      GetAllConversationDetails({ inboxId: selectedInbox?.inboxId ||1 });
    }
  }, [session, selectedInbox, GetAllConversationDetails]);

  useEffect(() => {
    if (GetAllConversationDetailsData?.data) {
      setMessages(GetAllConversationDetailsData.data);
    }
  }, [GetAllConversationDetailsLoading]);

  //
  const userData = session?.data?.user?.user;

  useEffect(() => {
    scrollToBottom();
  }, []);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  let tabArray = [];

  if (userData?.role === "Patient") {
    tabArray = [{ label: "Chat" }];
  } else {
    tabArray = [
      { label: "Make Notes" },
      { label: "Patient Info" },
      { label: "History" },
      { label: "Chat" },
    ];
  }

  if (appointmentLoading) {
    return <Loader1 />;
  }

  return (
    <Box>
      <Grid
        container
        spacing={0}
        className="calling-section-style"
        style={{ minHeight: `calc(100vh - 150px)` }}
      >
        <Grid item xs={12} md={8} lg={8} className="calling-section-style">
          <VideoSectionSection tokenId={tokenId} sessionId={sessionId} />
        </Grid>
        <Grid item xs={12} md={4} lg={4} sx={{ background: "white" }}>
          <BasicTabs
            value={value}
            onChange={(event, newValue) => setValue(newValue)}
            aria-label="basic tabs example"
            sx={{ border: "none", background: "white" }}
            indicatorColor=""
            tabArray={tabArray}
          >
            <Box
              style={{
                height: "calc(100vh - 220px)",
                overflowY: "auto",
              }}
            >
              {userData?.role === "Doctor" && (
                <>
                  <CustomTabPanel value={value} index={0}>
                    <PatientAssessment appointmentData={appointmentData} hideActions={false}/>
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={1}>
                    <Box sx={{ p: 1 }}>
                      <PatientProfileVideoSection
                        appointmentData={appointmentData}
                      />
                    </Box>
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={2}>
                    <MedicalHistory appointmentData={appointmentData} />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={3}>
                    <ChatRoom
                      socket={socket}
                      showMessanger={showMessanger}
                      setShowMessanger={setShowMessanger}
                      selectedInbox={selectedInbox}
                      GetAllConversationDetails={GetAllConversationDetails}
                      GetAllConversationDetailsLoading={
                        GetAllConversationDetailsLoading
                      }
                      GetAllConversationDetailsData={
                        GetAllConversationDetailsData
                      }
                      setMessages={setMessages}
                      messages={messages}
                    />
                  </CustomTabPanel>
                </>
              )}
              {userData?.role === "Patient" && (
                <CustomTabPanel value={value} index={0}>
                  <ChatRoom
                    socket={socket}
                    showMessanger={showMessanger}
                    setShowMessanger={setShowMessanger}
                    selectedInbox={selectedInbox}
                    GetAllConversationDetails={GetAllConversationDetails}
                    GetAllConversationDetailsLoading={
                      GetAllConversationDetailsLoading
                    }
                    GetAllConversationDetailsData={
                      GetAllConversationDetailsData
                    }
                    setMessages={setMessages}
                    messages={messages}
                  />
                </CustomTabPanel>
              )}
            </Box>
          </BasicTabs>
        </Grid>
      </Grid>
    </Box>
  );
}
