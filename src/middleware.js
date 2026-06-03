import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { USER_ROLE } from "./config";

export default withAuth(
  function middleware(req) {
    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      req?.nextauth?.token?.user?.roleId !== USER_ROLE.admin
    ) {
      return NextResponse.rewrite(new URL("/", req.url));
    }

    if (
      req.nextUrl.pathname.startsWith("/doctor") &&
      req?.nextauth?.token?.user?.roleId !== USER_ROLE.doctor
    ) {
      return NextResponse.rewrite(new URL("/", req.url));
    }

    if (
      req.nextUrl.pathname.startsWith("/patient") &&
      req?.nextauth?.token?.user?.roleId !== USER_ROLE.patient
    ) {
      return NextResponse.rewrite(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard", "/doctor/:path*", "/patient/:path*", "/admin/:path*"],
};
