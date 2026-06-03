import { useState } from "react";
import Image from "next/image";
import { Avatar, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import styled from "styled-components";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";

import { Box } from "@/components";
import MuiTypography from "@/components/core/Typography";
import { usePathname, useSearchParams } from "next/navigation";
import { useGetSingleDoctorQuery } from "@/redux/slices/doctors";
import { useGetPatientPersonalQuery } from "@/redux/slices/patients";
import { extractDateTimeComponents } from "@/lib/utils";
import moment from "moment";
import { Loader1 } from "@/components/core/Loader/Loader";

const StyledMenu = styled(Menu)`
  box-shadow: 0px 4px 15px 0px rgba(0, 0, 0, 0.16);

  && {
    .MuiPaper-elevation {
      min-width: 216px;
      border-radius: 12px;
    }
    .MuiMenu-list li:hover {
      background: #fce9e9;
      color: #e02828;
    }
  }
`;

export default function ProfileDetails() {
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    event.stopPropagation();
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const pathname = usePathname();
  const url = pathname.split("/");
  const lastItem = url[url.length - 1];
  const searchParams = useSearchParams();
  const role = searchParams.get("userRole");
  const { data: doctorData, isLoading: isDoctorLoading } =
    useGetSingleDoctorQuery(lastItem);
  const { data: patientData, isLoading: isPatientLoading } =
    useGetPatientPersonalQuery(lastItem);
  return (
    <div>
      {role === "Doctor" && !isDoctorLoading && (
        <RenderDoctorProfile
          doctorData={doctorData}
          handleOpenUserMenu={handleOpenUserMenu}
          anchorElUser={anchorElUser}
          isDoctorLoading={isDoctorLoading}
          handleCloseUserMenu={handleCloseUserMenu}
        />
      )}
      {role === "Patient" && !isPatientLoading && (
        <RenderPatientProfile
          patientData={patientData}
          isPatientLoading={isPatientLoading}
          handleOpenUserMenu={handleOpenUserMenu}
          anchorElUser={anchorElUser}
          handleCloseUserMenu={handleCloseUserMenu}
        />
      )}
    </div>
  );
}
function RenderDoctorProfile({
  doctorData,
  handleOpenUserMenu,
  anchorElUser,
  handleCloseUserMenu,
  isDoctorLoading,
}) {
  const { date } = extractDateTimeComponents(doctorData?.data?.dob);
  console.log("date::::",doctorData?.data?.dob);
  // console.log("doctorData:::",doctorData);

  return (
    <div>
      {isDoctorLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            height: "250px",
            alignItems: "center",
          }}
        >
          <Loader1 />
        </Box>
      ) : (
        <Box position="relative">
          {/* <IconButton
        disableRipple={true}
        size="large"
        aria-label="account of current user"
        aria-haspopup="true"
        onClick={handleOpenUserMenu}
        role="button"
        tabIndex="0"
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        color="inherit"
        style={{ position: "absolute", right: "0px" }}
      >
        <MoreHorizSharpIcon />
      </IconButton> */}
          <img
            src={
              doctorData?.data?.profileImageURL !== null
                ? doctorData?.data?.profileImageURL
                : "/images/placeholderImage.png"
            }
            // loading="lazy"
            style={{
              width: "220px",
              height: "220px",
              objectFit: "cover",
              borderRadius: "100%",
              display: "block",
              margin: "auto",
              padding: "20px 0px ",
            }}
            alt="user-img"
          />
        </Box>
      )}
      <Box mb="20px">
        <MuiTypography
          variant="h4"
          component="h4"
          color="#333"
          fontWeight="700"
          textAlign="center"
        >
          {doctorData?.data?.doctor || "N/A"}
        </MuiTypography>
      </Box>
      <Divider />
      <Box p="20px">
        <Box my="10px">
          <MuiTypography
            variant="body1"
            component="h6"
            fontWeight="600"
            fontSize="16px"
          >
            Email
          </MuiTypography>
          <MuiTypography
            variant="subtitle1"
            component="p"
            fontWeight="400"
            color="#8B8B8B"
          >
            {doctorData?.data?.email || " N/A"}
          </MuiTypography>
        </Box>

        <Box my="10px">
          <MuiTypography
            variant="body1"
            component="h6"
            fontWeight="600"
            fontSize="16px"
          >
            Phone Number
          </MuiTypography>
          <MuiTypography
            variant="subtitle1"
            component="p"
            fontWeight="400"
            color="#8B8B8B"
          >
            {doctorData?.data?.phoneNumber || "N/A"}
          </MuiTypography>
        </Box>

        <Box my="10px">
          <MuiTypography
            variant="body1"
            component="h6"
            fontWeight="600"
            fontSize="16px"
          >
            DOB
          </MuiTypography>
          <MuiTypography
            variant="subtitle1"
            component="p"
            fontWeight="400"
            color="#8B8B8B"
          >
            {date === undefined ? "N/A" : moment(date).format("MM/DD/YYYY")}
          </MuiTypography>
        </Box>

        <Box my="10px">
          <MuiTypography
            variant="body1"
            component="h6"
            fontWeight="600"
            fontSize="16px"
          >
            Gender
          </MuiTypography>
          <MuiTypography
            variant="subtitle1"
            component="p"
            fontWeight="400"
            color="#8B8B8B"
          >
            {doctorData?.data?.gender || "N/A"}
          </MuiTypography>
        </Box>

        <Box my="10px">
          <MuiTypography
            variant="body1"
            component="h6"
            fontWeight="600"
            fontSize="16px"
          >
            Address
          </MuiTypography>
          <MuiTypography
            variant="subtitle1"
            component="p"
            fontWeight="400"
            color="#8B8B8B"
          >
            {doctorData?.data?.address || "N/A"}
          </MuiTypography>
        </Box>
      </Box>

      <StyledMenu
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={anchorElUser}
        onClose={handleCloseUserMenu}
      >
        <MenuItem>
          <VisibilityIcon sx={{ fontSize: "20px" }} />
          <MuiTypography
            variant="subtitle1"
            fontWeight="400"
            component="span"
            ml={0.5}
          >
            View
          </MuiTypography>
        </MenuItem>
        <MenuItem>
          <ModeEditIcon sx={{ fontSize: "20px" }} />
          <MuiTypography
            variant="subtitle1"
            fontWeight="400"
            component="span"
            ml={0.5}
          >
            Edit
          </MuiTypography>
        </MenuItem>
        <MenuItem>
          <DeleteIcon sx={{ fontSize: "20px" }} />
          <MuiTypography
            variant="subtitle1"
            fontWeight="400"
            component="span"
            ml={0.5}
          >
            Delete
          </MuiTypography>
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
function RenderPatientProfile({
  patientData,
  handleOpenUserMenu,
  anchorElUser,
  handleCloseUserMenu,
  isPatientLoading,
}) {
  return (
    <div>
      {isPatientLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            height: "250px",
            alignItems: "center",
          }}
        >
          <Loader1 />
        </Box>
      ) : (
        <Box position="relative">
          {/* <IconButton
        disableRipple={true}
        size="large"
        aria-label="account of current user"
        aria-haspopup="true"
        onClick={handleOpenUserMenu}
        role="button"
        tabIndex="0"
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        color="inherit"
        style={{ position: "absolute", right: "0px" }}
      >
        <MoreHorizSharpIcon />
      </IconButton> */}
          <img
            src={
              patientData?.data?.profileImageURL !== null
                ? patientData?.data?.profileImageURL
                : "/images/placeholderImage.png"
            }
            // loading="lazy"
            style={{
              width: 220,
              height: 220,
              objectFit: "cover",
              borderRadius: "100%",
              display: "block",
              margin: "auto",
              padding: "20px 0px ",
            }}
            alt="user-img"
          />
        </Box>
      )}
      <Box mb="20px">
        <MuiTypography
          variant="h4"
          component="h4"
          color="#333"
          fontWeight="700"
          textAlign="center"
        >
          {patientData?.data?.firstName}
        </MuiTypography>
      </Box>
      <Divider />
      <Box p="20px">
        <Box my="10px">
          <MuiTypography
            variant="body1"
            component="h6"
            fontWeight="600"
            fontSize="16px"
          >
            Email
          </MuiTypography>
          <MuiTypography
            variant="subtitle1"
            component="p"
            fontWeight="400"
            color="#8B8B8B"
          >
            {patientData?.data?.email || "N/A"}
          </MuiTypography>
        </Box>

        <Box my="10px">
          <MuiTypography
            variant="body1"
            component="h6"
            fontWeight="600"
            fontSize="16px"
          >
            Phone Number
          </MuiTypography>
          <MuiTypography
            variant="subtitle1"
            component="p"
            fontWeight="400"
            color="#8B8B8B"
          >
            {patientData?.data?.phoneNumber || "N/A"}
          </MuiTypography>
        </Box>

        <Box my="10px">
          <MuiTypography
            variant="body1"
            component="h6"
            fontWeight="600"
            fontSize="16px"
          >
            DOB
          </MuiTypography>
          <MuiTypography
            variant="subtitle1"
            component="p"
            fontWeight="400"
            color="#8B8B8B"
          >
            {patientData?.data?.dob || "N/A"}
          </MuiTypography>
        </Box>

        <Box my="10px">
          <MuiTypography
            variant="body1"
            component="h6"
            fontWeight="600"
            fontSize="16px"
          >
            Gender
          </MuiTypography>
          <MuiTypography
            variant="subtitle1"
            component="p"
            fontWeight="400"
            color="#8B8B8B"
          >
            {patientData?.data?.gender || "N/A"}
          </MuiTypography>
        </Box>

        <Box my="10px">
          <MuiTypography
            variant="body1"
            component="h6"
            fontWeight="600"
            fontSize="16px"
          >
            Address
          </MuiTypography>
          <MuiTypography
            variant="subtitle1"
            component="p"
            fontWeight="400"
            color="#8B8B8B"
          >
            {patientData?.data?.address || "N/A"}
          </MuiTypography>
        </Box>
      </Box>

      {/* <StyledMenu
      id="menu-appbar"
      anchorEl={anchorElUser}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={anchorElUser}
      onClose={handleCloseUserMenu}
    >
      <MenuItem>
        <VisibilityIcon sx={{ fontSize: "20px" }} />
        <MuiTypography
          variant="subtitle1"
          fontWeight="400"
          component="span"
          ml={0.5}
        >
          View
        </MuiTypography>
      </MenuItem>
      <MenuItem>
        <ModeEditIcon sx={{ fontSize: "20px" }} />
        <MuiTypography
          variant="subtitle1"
          fontWeight="400"
          component="span"
          ml={0.5}
        >
          Edit
        </MuiTypography>
      </MenuItem>
      <MenuItem>
        <DeleteIcon sx={{ fontSize: "20px" }} />
        <MuiTypography
          variant="subtitle1"
          fontWeight="400"
          component="span"
          ml={0.5}
        >
          Delete
        </MuiTypography>
      </MenuItem>
    </StyledMenu> */}
    </div>
  );
}
