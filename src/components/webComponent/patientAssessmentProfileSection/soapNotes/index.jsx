import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import MuiTypography from "@/components/core/Typography";
import { Box, Button } from "@/components";
import AddSoapNotesModal from "./addSoapNotesModal";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useGetAllSoapNotesQuery } from "@/redux/slices/userProfile";
import styled from "styled-components";
import { MenuItem, Menu } from "@mui/material";
import { BeatLoader } from "react-spinners";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

const StyledBox = styled(Box)`
  border: 1px solid rgba(25, 118, 210, 0.5);
  border-radius: 10px;
  margin-bottom: 5px;
`;
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
export default function SOAPNotes({ hideActions }) {
  const [open, setOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [soapNoteId, setsoapNoteId] = useState(null);
  const session = useSession();
  const params = useParams();
  const userData = session?.data?.user?.user;
  const handleEdit = (row) => {
    setOpen(true);
    // setsoapNoteId(row?.soapNoteId);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleOpenUserMenu = (data, event) => {
    setsoapNoteId(data?.soapNoteId);

    event.stopPropagation();
    setAnchorElUser(event.currentTarget);
  };
  const getAllSoapNotes = useGetAllSoapNotesQuery({
    patientId: userData?.userId,
  });
  return (
    <>
      <Box display="flex" justifyContent="center" my="15px">
        <div>{getAllSoapNotes?.isLoading && <BeatLoader />}</div>
      </Box>
      <Box display="flex" justifyContent="center" my="15px">
        <div>{getAllSoapNotes?.isError && <p>Network Error</p>}</div>
      </Box>
      <Box
        display="flex"
        justifyContent={`${
          getAllSoapNotes?.data?.data?.length > 0 ? "flex-end" : "center"
        }`}
      >
        {!hideActions && (
          <Button
            variant={`${
              getAllSoapNotes?.data?.data?.length > 0 ? "" : "outlined"
            }`}
            height="45px"
            radius="12px"
            bg={`${getAllSoapNotes?.data?.data?.length > 0 ? "#E02828" : ""}`}
            sx={{
              margin: `${
                getAllSoapNotes?.data?.data?.length > 0 ? "15px " : "15px auto"
              }`,
            }}
            startIcon={
              getAllSoapNotes?.data?.data?.length > 0 ? "" : <AddIcon />
            }
            onClick={() => setOpen(true)}
          >
            Add SOAP Notes
          </Button>
        )}
      </Box>
      {/* <Box display="flex" justifyContent="center">
        <Button
          variant="outlined"
          height="45px"
          radius="12px"
          sx={{ margin: "15px auto" }}
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add SOAP Notes
        </Button>
      </Box> */}
      <Box sx={{ height: "100%", overflow: "auto" }}>
        {getAllSoapNotes?.data?.data?.length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              marginBottom: "20px",
            }}
          >
            No Record to show
          </div>
        ) : (
          getAllSoapNotes?.data?.data?.map((item, index) => (
            <StyledBox
              key={index}
              sx={{ p: "10px", mb: "10px" }}
              borderWidth={"2px"}
            >
              <div>
                <div>
                  <Box display="flex" justifyContent="flex-end">
                    {/* <IconButton
                    disableRipple={true}
                    size="large"
                    // edge="end"
                    aria-label="account of current user"
                    aria-haspopup="true"
                    onClick={(event) => handleOpenUserMenu(item, event)}
                    role="button"
                    tabIndex="0"
                    onKeyDown={(e) => {
                      e.stopPropagation();
                    }}
                    color="inherit"
                  >
                    <MoreVertIcon />
                  </IconButton> */}
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
                          setAnchorElUser(null);
                        }}
                      >
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
                      <MenuItem onClick={() => handleEdit(item)}>
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
                          setDeleteModal(true);
                          setAnchorElUser(null);
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
                  </Box>
                  <MuiTypography
                    variant="h6"
                    component="h6"
                    fontWeight="600"
                    fontSize="16px"
                    color="#348AF4"
                  >
                    {"Subjective"}
                  </MuiTypography>
                  <MuiTypography
                    variant="h6"
                    component="p"
                    fontWeight="400"
                    fontSize="14px"
                    color="#666666"
                  >
                    {item?.subjective}
                  </MuiTypography>
                </div>
                <div>
                  <MuiTypography
                    variant="h6"
                    component="h6"
                    fontWeight="600"
                    fontSize="16px"
                    color="#348AF4"
                  >
                    {"Objective"}
                  </MuiTypography>
                  <MuiTypography
                    variant="h6"
                    component="p"
                    fontWeight="400"
                    fontSize="14px"
                    color="#666666"
                  >
                    {item?.objective}
                  </MuiTypography>
                </div>
                <div>
                  <MuiTypography
                    variant="h6"
                    component="h6"
                    fontWeight="600"
                    fontSize="16px"
                    color="#348AF4"
                  >
                    {"Assessment"}
                  </MuiTypography>
                  <MuiTypography
                    variant="h6"
                    component="p"
                    fontWeight="400"
                    fontSize="14px"
                    color="#666666"
                  >
                    {item?.assessment}
                  </MuiTypography>
                </div>
                <div>
                  <MuiTypography
                    variant="h6"
                    component="h6"
                    fontWeight="600"
                    fontSize="16px"
                    color="#348AF4"
                  >
                    {"Plan"}
                  </MuiTypography>
                  <MuiTypography
                    variant="h6"
                    component="p"
                    fontWeight="400"
                    fontSize="14px"
                    color="#666666"
                  >
                    {item?.plan}
                  </MuiTypography>
                </div>
              </div>
            </StyledBox>
          ))
        )}
      </Box>
      {open && (
        <AddSoapNotesModal
          soapNoteId={soapNoteId}
          open={open}
          handleClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
