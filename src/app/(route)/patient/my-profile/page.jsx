"use client";
import { useEffect, useState } from "react";
import { Grid, Paper } from "@mui/material";
import styled from "styled-components";
import { RiUserFollowLine } from "react-icons/ri";
import { GiMedicinePills } from "react-icons/gi";
import { BsJournalMedical } from "react-icons/bs";
import { TbChecklist } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { Box } from "@/components/core";
import MuiTypography from "@/components/core/Typography";
import PatientAssessment from "@/components/webComponent/patientAssessmentProfileSection";
import MedicationTable from "@/components/webComponent/medication/table";
import PatientProfile from "@/components/webComponent/generalProfile/patientProfile";
import MedicalHistory from "@/components/webComponent/medicalHistoryProfileSection";

const StyledSidebar = styled(Box)`
  background: #ffffff;
  box-shadow: 0px 0px 24px 0px #0000000a;
  height: 100%;
`;

const StyledLink = styled.p`
  color: #333333;
  display: flex;
  align-items: center;
`;

const SideNavBar = styled.ul`
  height: 100%;
  padding: 10px;
  margin: 0px;
  li {
    display: flex;
    align-items: center;
    padding: 0px 15px;
    cursor: pointer;
  }

  li:hover,
  .active {
    background: #fce9e9;
  }

  && {
    .active p {
      color: #e02828 !important;
      font-weight: bold !important;
    }
  }
`;

const PAPER_PROPS = {
  display: "flex",
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
  backgroundColor: "#fff",
  boxShadow: "none",
  borderRadius: "8px",
};

const SIDE_BAR_MENU_DATA = [
  {
    id: 1,
    title: "General Information",
    icon: <RiUserFollowLine size={24} />,
  },
  {
    id: 2,
    title: "Medications",
    icon: <GiMedicinePills size={28} />,
  },
  {
    id: 3,
    title: "Medical History",
    icon: <BsJournalMedical size={24} />,
  },
];

export default function Patient() {
  const [value, setValue] = useState("General Information");
  const router = useRouter();

  useEffect(() => {
    handleClick(value);
  }, [value]);

  const handleClick = (title) => {
    const formattedValue = title.replace(/\s+/g, "-").toLowerCase();
    router.push(`?params=${formattedValue}`, undefined, { shallow: true });
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3} xl={3}>
          <Paper sx={{ ...PAPER_PROPS, height: "100%" }}>
            <StyledSidebar>
              <SideNavBar>
                {SIDE_BAR_MENU_DATA.map((sideBarMenuDataObject, index) => (
                  <li
                    key={index + 1}
                    className={
                      value === sideBarMenuDataObject.title ? "active" : ""
                    }
                    onClick={() => {
                      setValue(sideBarMenuDataObject.title);
                      handleClick(sideBarMenuDataObject.title);
                    }}
                  >
                    <StyledLink>
                      {sideBarMenuDataObject.icon}
                      <MuiTypography variant="body2" component="h4" ml="10px">
                        {sideBarMenuDataObject.title}
                      </MuiTypography>
                    </StyledLink>
                  </li>
                ))}
              </SideNavBar>
            </StyledSidebar>
          </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper sx={{ ...PAPER_PROPS, padding: "22px 38px 22px 26px" }}>
            {value === "General Information" && <PatientProfile />}
            {value === "Medications" && <MedicationTable />}
            {value === "Medical History" && <MedicalHistory />}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
