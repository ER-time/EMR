import styled from "styled-components";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Divider } from "@mui/material";
import Image from "next/image";
import { BsGrid } from "react-icons/bs";
import { PiUserList, PiUsersThreeDuotone } from "react-icons/pi";
import { FaStethoscope } from "react-icons/fa";
import { MdLocalHospital } from "react-icons/md";
import { RiAlarmWarningLine } from "react-icons/ri";
import BloodtypeOutlinedIcon from "@mui/icons-material/BloodtypeOutlined";
import InsertChartOutlinedOutlinedIcon from "@mui/icons-material/InsertChartOutlinedOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import MuiTypography from "../../core/Typography";
import { Box } from "../../core";
import { BiArrowToLeft, BiArrowToRight } from "react-icons/bi";
import { useState } from "react";
import { USER_ROLE } from "@/config";

const StyledSidebar = styled(Box)`
  background: #ffffff;
  box-shadow: 3px 0px 25px 0px #0000000d;
  min-height: 100vh;
`;

const SideNavBar = styled.ul`
  padding: 0px;
  li {
    height: 55px;
    color: #000;
    display: flex;
    align-items: center;

    padding: 0px 15px;
    margin: 10px 0px;
    cursor: pointer;
    border-radius: 10px;
  }
  .mobile-menu-style > a {
    justify-content: center;
  }
  li:hover,
  .active {
    background: #e02828;
    color: #fff;

    a {
      color: #fff;
      font-weight: 700;
    }
  }

  .mobile-menu-style {
    justify-content: center;
    transition: justify-content 0.2s ease-in-out 0s;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: initial;
  display: flex;
  align-items: center;
  width: 100%;
`;

const Sidebar = ({ width, toggleWidth, shouldRenderButton }) => {
  const [toggleValue, setToggleValue] = useState(shouldRenderButton);

  const session = useSession();
  const loggedInUser = session?.data?.user?.user;
  const pathname = usePathname();

  const handleToggleIcon = () => {
    setToggleValue(!toggleValue);
    toggleWidth();
  };
  const selectedRoute = (route) => {
    if (route === pathname) {
      return true;
    } else {
      return false;
    }
  };

  const ADMIN_SIDEBAR_OPTIONS = [
    {
      id: 1,
      title: "Dashboard",
      icon: <BsGrid size={20} />,
      route: "/dashboard",
    },
    {
      id: 2,
      title: "User Management",
      icon: <PiUserList size={24} />,
      route: "/admin/user-management",
    },
    {
      id: 3,
      title: "Invoice",
      icon: <InsertChartOutlinedOutlinedIcon />,
      route: "/admin/invoice",
    },
    {
      id: 4,
      title: "Appointments",
      icon: <PiUserList size={24} />,
      route: "/admin/appointments",
    },
    {
      id: 5,
      title: "Donations",
      icon: <BloodtypeOutlinedIcon />,
      route: "/admin/donations",
    },
    {
      id: 6,
      title: "Free Patients",
      icon: <PiUsersThreeDuotone size={24} />,
      route: "/admin/free-patients",
    },
    // {
    //   id: 7,
    //   title: "Departments",
    //   icon: <PiUserList size={24} />,
    //   route: "/admin/departments",
    // },
  ];
  
  const DOCTOR_SIDEBAR_OPTIONS = [
    {
      id: 1,
      title: "Dashboard",
      icon: <BsGrid size={20} />,
      route: "/dashboard",
    },
    {
      id: 2,
      title: "Patient Management",
      icon: <PiUserList size={24} />,
      route: "/doctor/patient-management",
    },
    {
      id: 5,
      title: "Appointments",
      icon: <CalendarTodayOutlinedIcon size={24} />,
      route: "/doctor/appointments",
    },
    {
      id: 5,
      title: "Invoice",
      icon: <InsertChartOutlinedOutlinedIcon />,
      route: "/doctor/invoice",
    },
    {
      id: 6,
      title: "Slots",
      icon: <CalendarTodayOutlinedIcon size={24} />,
      route: "/doctor/slots-management",
    },
    {
      id: 7,
      title: "Chat",
      icon: <ChatOutlinedIcon />,
      route: "/doctor/messanger",
    },
  ];

  const PATIENT_SIDEBAR_SHORT_OPTIONS = [
    {
      id: 1,
      title: "Get First Aid",
      icon: <RiAlarmWarningLine size={26} />,
      route: "/patient/get-first-aid",
    },
    {
      id: 2,
      title: "Find a Hospital",
      icon: <MdLocalHospital size={24} />,
      route: "/patient/find-a-hospital",
    },
    {
      id: 5,
      title: "Find a Doctor",
      icon: <FaStethoscope size={18} style={{ marginLeft: "5px" }} />,
      route: "/patient/find-a-doctor",
    },
  ];

  const PATIENT_SIDEBAR_OPTIONS = [
    {
      id: 1,
      title: "Dashboard",
      icon: <BsGrid size={20} />,
      route: "/dashboard",
    },
    {
      id: 2,
      title: "My Appointments",
      icon: <PiUserList size={24} />,
      route: "/patient/my-appointments",
    },
    // {
    //   id: 5,
    //   title: "Book an Appointments",
    //   icon: <PersonAddAltIcon />,
    //   route: "/patient/book-appointments",
    // },
    // {
    //   id: 6,
    //   title: "Prescriptions",
    //   icon: <PersonAddAltIcon />,
    //   route: "/patient/prescriptions",
    // },
    {
      id: 5,
      title: "Invoice",
      icon: <InsertChartOutlinedOutlinedIcon />,
      route: "/patient/invoice",
    },
    {
      id: 7,
      title: "Chat",
      icon: <ChatOutlinedIcon />,
      route: "/patient/messanger",
    },
  ];

  const getSidebarMenu = () => {
    let menu =
      loggedInUser?.roleId === USER_ROLE.admin
        ? ADMIN_SIDEBAR_OPTIONS
        : loggedInUser?.roleId === USER_ROLE.doctor
        ? DOCTOR_SIDEBAR_OPTIONS
        : loggedInUser?.roleId === USER_ROLE.patient
        ? PATIENT_SIDEBAR_OPTIONS
        : [];
    return menu;
  };
  return (
    <StyledSidebar
      style={{
        width: `${width}px`,
        transition: "width 0.5s",
        position: "fixed",
      }}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <div style={{ width: "100%", height: "100vh" }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-around"
          style={{
            height: "84px",
            position: "relative",
          }}
        >
          {width > 90 && (
            <div
              style={{ position: "relative", height: "100px", width: "100px" }}
            >
              <Image
                src={"/images/medical-ai-full-logo-dashboard.png"}
                loading="eager"
                layout="fill"
                objectFit="contain"
                style={{
                  objectFit: "contain",
                }}
                alt="user-img"
              />
            </div>
          )}

          {toggleValue ? (
            <BiArrowToRight
              className="collaps-icon"
              onClick={handleToggleIcon}
              sx={{ cursor: "pointer" }}
              size={22}
            />
          ) : (
            <BiArrowToLeft
              className="collaps-icon"
              onClick={handleToggleIcon}
              sx={{ cursor: "pointer" }}
              size={22}
            />
          )}
        </Box>
        <div>
          <SideNavBar>
            {loggedInUser?.roleId === USER_ROLE.patient &&
              PATIENT_SIDEBAR_SHORT_OPTIONS.map(
                (sideBarShortLinkDataObject, index) => (
                  <li
                    key={index + 1}
                    className={`${width === 90 ? "mobile-menu-style" : ""} ${
                      selectedRoute(sideBarShortLinkDataObject.route)
                        ? "active"
                        : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    style={{
                      margin: "0px 10px",
                    }}
                  >
                    <StyledLink href={sideBarShortLinkDataObject.route}>
                      {sideBarShortLinkDataObject.icon}
                      {width !== 90 && (
                        <MuiTypography
                          variant="body2"
                          component="span"
                          ml="10px"
                        >
                          {sideBarShortLinkDataObject.title}
                        </MuiTypography>
                      )}
                    </StyledLink>
                  </li>
                )
              )}

            {loggedInUser?.roleId === USER_ROLE.patient && (
              <Divider sx={{ my: 3 }} />
            )}

            {getSidebarMenu().map((sideBarMenuDataObject, index) => (
              <li
                key={index + 1}
                className={`${width === 90 ? "mobile-menu-style" : ""} ${
                  selectedRoute(sideBarMenuDataObject.route) ? "active" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                style={{
                  margin: "0px 10px",
                }}
              >
                <StyledLink href={sideBarMenuDataObject.route}>
                  {sideBarMenuDataObject.icon}
                  {width !== 90 && (
                    <MuiTypography variant="body2" component="span" ml="10px">
                      {sideBarMenuDataObject.title}
                    </MuiTypography>
                  )}
                </StyledLink>
              </li>
            ))}
          </SideNavBar>
        </div>
      </div>
    </StyledSidebar>
  );
};

export default Sidebar;
