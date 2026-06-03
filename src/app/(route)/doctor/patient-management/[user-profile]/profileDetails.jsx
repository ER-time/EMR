import { useEffect, useState } from "react";
// import Image from "next/image";
import { Divider, Menu } from "@mui/material";
import styled from "styled-components";

import { Box } from "@/components";
import MuiTypography from "@/components/core/Typography";
import { usePathname } from "next/navigation";
import { useGetAllUsersMutation } from "@/redux/slices/user";
import { useSession } from "next-auth/react";
import { USER_ROLE } from "@/config";
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
  const [editPatientModalShow, setEditPatientModalShow] = useState(false);
  const [deletModalShow, setDeletModalShow] = useState(false);
  const session = useSession();
  const pathname = usePathname();
  const url = pathname.split("/");
  const lastItem = url[url.length - 1];
  const [
    getAllUsers,
    { data: allUsersData, isLoading, isError, isSuccess, error },
  ] = useGetAllUsersMutation();
  console.log("isLoading:::::", isLoading);
  useEffect(() => {
    const payload = {
      userId: lastItem,
      userRoleId: USER_ROLE?.patient,
    };
    getAllUsers(payload);
  }, [session]);

  const handleOpenUserMenu = (event) => {
    event.stopPropagation();
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const { date } = extractDateTimeComponents(allUsersData?.data?.[0]?.dob);
  console.log(
    "allUsersData.data?.[0]?.profileImageURL",
    allUsersData?.data?.[0]?.profileImageURL
  );
  const userFirstName =
    (allUsersData &&
      allUsersData.data &&
      allUsersData.data[0] &&
      allUsersData.data[0].firstName) ||
    "N/A";
  const userLastName =
    (allUsersData &&
      allUsersData.data &&
      allUsersData.data[0] &&
      allUsersData.data[0].lastName) ||
    "";
  const userFullName = `${userFirstName} ${userLastName}`;
  return (
    <div>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" ,height:'250px',alignItems:'center'}}>
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

          {allUsersData ? (
            <img
              src={
                allUsersData?.data?.[0]?.profileImageURL !== null
                  ? allUsersData?.data?.[0]?.profileImageURL
                  : "/images/placeholderImage.png"
              }
              width={220}
              height={220}
              style={{
                objectFit: "cover",
                borderRadius: "100%",
                display: "block",
                margin: "auto",
                padding: "20px 0px ",
              }}
              alt="user-img"
            />
          ) : null}
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
          {userFullName}
        </MuiTypography>
      </Box>
      <Divider />
      <Box p="20px">
        <Box my="10px">
          <MuiTypography variant="body1" component="h6" fontWeight="500">
            Email
          </MuiTypography>
          <MuiTypography
            variant="subtitle1"
            component="p"
            fontWeight="400"
            color="#8B8B8B"
          >
            {allUsersData?.data?.[0]?.email || "N/A"}
          </MuiTypography>
        </Box>

        <Box my="10px">
          <MuiTypography variant="body1" component="h6" fontWeight="500">
            Phone Number
          </MuiTypography>
          <MuiTypography
            variant="subtitle1"
            component="p"
            fontWeight="400"
            color="#8B8B8B"
          >
            {allUsersData?.data?.[0]?.phoneNo || "N/A"}
          </MuiTypography>
        </Box>

        <Box my="10px">
          <MuiTypography variant="body1" component="h6" fontWeight="500">
            DOB
          </MuiTypography>
          <MuiTypography
            variant="subtitle1"
            component="p"
            fontWeight="400"
            color="#8B8B8B"
          >
            {moment(date).format("MM/DD/YY") || "N/A"}
          </MuiTypography>
        </Box>

        <Box my="10px">
          <MuiTypography variant="body1" component="h6" fontWeight="500">
            Gender
          </MuiTypography>
          <MuiTypography
            variant="subtitle1"
            component="p"
            fontWeight="400"
            color="#8B8B8B"
          >
            {allUsersData?.data?.[0]?.gender || "N/A"}
          </MuiTypography>
        </Box>

        <Box my="10px">
          <MuiTypography variant="body1" component="h6" fontWeight="500">
            Address
          </MuiTypography>
          <MuiTypography
            variant="subtitle1"
            component="p"
            fontWeight="400"
            color="#8B8B8B"
          >
            {allUsersData?.data?.[0]?.address || "N/A"}
          </MuiTypography>
        </Box>

        {/* <Box my="10px">
          <MuiTypography variant="body1" component="h6" fontWeight="500">
            Reason
          </MuiTypography>
          <MuiTypography
            variant="subtitle1"
            component="p"
            fontWeight="400"
            color="#8B8B8B"
          >
            Sick
          </MuiTypography>
        </Box> */}

        {/* <Box my="10px">
          <MuiTypography variant="body1" component="h6" fontWeight="500">
            Center
          </MuiTypography>
          <MuiTypography
            variant="subtitle1"
            component="p"
            fontWeight="400"
            color="#8B8B8B"
          >
            {allUsersData?.data?.[0]?.center || "N/A"}
          </MuiTypography>
        </Box> */}

        {/* <Box my="10px">
          <MuiTypography variant="body1" component="h6" fontWeight="500">
            Feedback
          </MuiTypography>
          <MuiTypography
            variant="subtitle1"
            component="p"
            fontWeight="400"
            color="#8B8B8B"
          >
            Lorem ipsum dolor sit amet consectetur. Ultrices ultricies eget
            tempus venenatis facilisi diam justo.
          </MuiTypography>
        </Box> */}
      </Box>
      {/* 
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
        <MenuItem
          onClick={() => {
            handleCloseUserMenu();
            setEditPatientModalShow(true);
          }}
        >
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
        <MenuItem
          onClick={() => {
            handleCloseUserMenu();
            setDeletModalShow(true);
          }}
        >
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

      {editPatientModalShow && (
        <AddEditPatientModal
          open={editPatientModalShow}
          handleClose={() => setEditPatientModalShow(false)}
          tittle="Edit Patient"
        />
      )}

      {deletModalShow && (
        <DeleteModal
          open={deletModalShow}
          handleClose={() => setDeletModalShow(false)}
          onConfirm={() => setDeletModalShow(false)}
          tittle="Delete Patient"
        />
      )}
      </StyledMenu> */}
    </div>
  );
}
