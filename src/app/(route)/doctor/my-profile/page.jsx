"use client";
import React from "react";
import { useSession } from "next-auth/react";
import DoctorProfileUpdate from "@/components/webComponent/updateDoctorProfile";
import { USER_ROLE } from "@/config";

const MyProfile = () => {
  const session = useSession();

  if (session?.data?.user?.user?.roleId === USER_ROLE.doctor) {
    return <DoctorProfileUpdate />;
  } else {
    return <DoctorProfileUpdate />;
  }
};

export default MyProfile;
