"use client";

import { useSession } from "next-auth/react";

import AdminDashboard from "./admin";
import DoctorDashboard from "./doctor";
import PatientDashboard from "./patient";
import { USER_ROLE } from "@/config";

export default function DahboardDummy() {
  const session = useSession();
  let userData = session?.data?.user?.user;
  console.log("session");
  return (
    <>
      {userData?.roleId === USER_ROLE.admin && <AdminDashboard />}
      {userData?.roleId === USER_ROLE.doctor && <DoctorDashboard />}
      {userData?.roleId === USER_ROLE.patient && <PatientDashboard />}
    </>
  );
}
