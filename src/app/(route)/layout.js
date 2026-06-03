"use client";

import { LoaderPageWithoutBG } from "@/components/core/Loader/Loader";
import dynamic from "next/dynamic";

const DashboardLayout = dynamic(() => import("@/components/layout"), {
  ssr: false,

  loading: () => <LoaderPageWithoutBG />,
});
export default function SharedLayout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
