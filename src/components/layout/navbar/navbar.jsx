import React from "react";
import styled from "styled-components";

import MuiTypography from "../../core/Typography";
import { Box } from "../../core";
import ProfileContainer from "./profileContainer";
import { Breadcrumbs } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useGetAllSpecialitiesQuery } from "@/redux/slices/lookups";

export function GenericBreadcrumb() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get("params");

  const url = pathname.split("/");
  let breadcrumbText = "";

  // Check if the last item is a number (ID)
  const lastItem = url[url.length - 1];
  const isLastItemNumber = !isNaN(lastItem);

  if (isLastItemNumber && url.length > 1) {
    // If last item is a number and there are more than one item in the URL path
    breadcrumbText = url[url.length - 2];
  } else {
    // If last item is not a number or there is only one item in the URL path
    breadcrumbText = lastItem;
  }

  return (
    <Breadcrumbs separator=">">
      <MuiTypography
        variant="h5"
        component="h5"
        fontWeight="600"
        color="#1A1A1A"
      >
        {breadcrumbText
          .replace(/-/g, " ")
          .replace(/(\w)(\w*)/g, function (g, g1, g2) {
            return g1.toUpperCase() + g2.toLowerCase();
          })}
      </MuiTypography>
      {search && (
        <MuiTypography variant="h5" component="h5" fontWeight="500">
          {search
            .replace(/-/g, " ")
            .replace(/(\w)(\w*)/g, function (g, g1, g2) {
              return g1.toUpperCase() + g2.toLowerCase();
            })}
        </MuiTypography>
      )}
    </Breadcrumbs>
  );
}

const StyledNavbar = styled.div`
  background: #ffffff;
  box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.07);
  min-height: 84px;
  padding: 0px 10px;
  .dashboard-tab {
    flex: 1;
  }

  @media (min-width: 1600px) {
    .tab-container {
      display: block !important;
    }

    .tab-container-responsive {
      display: none !important;
    }
  }
`;

const Navbar = () => {
  const getAllSpecialities = useGetAllSpecialitiesQuery();
  return (
    <StyledNavbar>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "inherit" }}
      >
        <Box
          display="flex"
          alignItems="center"
          className="screen-tittle-container"
          sx={{ display: { xs: "none", sm: "block" }, margin: "auto" }}
        >
          <GenericBreadcrumb />
        </Box>
        <ProfileContainer />
      </Box>
    </StyledNavbar>
  );
};

export default Navbar;
