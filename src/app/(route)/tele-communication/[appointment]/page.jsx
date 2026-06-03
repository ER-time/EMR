"use client";

import VideoAppointment from "@/components/webComponent/videoCall/index";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useSession } from "next-auth/react";

const TeleCommunication = () => {
  const session = useSession();
  const router =useRouter()
  const loggedInUser = session?.data?.user?.user;
  console.log("loggedInUser",loggedInUser);
  useEffect(() => {
    if (!loggedInUser) {
      router.push("/");
    }
  }, [loggedInUser, router]);
  return (
    <Box sx={{ minHeight: `calc(100vh - 150px)` }}>
      <VideoAppointment />
    </Box>

  );
};

export default TeleCommunication;
