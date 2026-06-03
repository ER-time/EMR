import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import MuiTypography from "@/components/core/Typography";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import styled from "styled-components";
import { BeatLoader } from "react-spinners";
import Table from "@/components/core/Table";
import AddSoapNotesModal from "./addSoapNotesModal";
import { DeleteModal } from "../..";
import { useParams } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import {
  useDeleteSoapNotesMutation,
  useGetAllSoapNotesQuery,
} from "@/redux/slices/userProfile";
import { useDispatch } from "react-redux";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";

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

const TruncatedText = styled(MuiTypography)`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default function SOAPNotes({ hideActions, rowData }) {
  const [open, setOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [soapNoteId, setSoapNoteId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const params = useParams();

  const [deleteSoapNotes, { isLoading: deleteSoapNotesLoading }] =
    useDeleteSoapNotesMutation();

  const getAllSoapNotes = useGetAllSoapNotesQuery({
    appointmentId: params?.appointment || rowData?.appointmentId || 1,
  });

  const handleShowDetail = (row) => {
    setDetailData(row);
    setDetailModalOpen(true);
  };

  const handleEdit = (cell) => {
    setOpen(true);
    setAnchorElUser(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
    setSoapNoteId(null);
  };

  const handleOpenUserMenu = (event, cell) => {
    setSoapNoteId(cell?.row?.original);
    event.stopPropagation();
    setAnchorElUser(event.currentTarget);
  };

  const handleConfirm = async () => {
    try {
      const response = await deleteSoapNotes(soapNoteId?.soapNoteId).unwrap();
      if (response.succeeded) {
        dispatch(onSuccess({ message: "Record Deleted Successfully" }));
      }
      setSoapNoteId(null);
      setDeleteModal(false);
    } catch (error) {
      dispatch(onFailure({ message: "Error deleting allergies" }));
    }
  };

  const columns = [
    {
      header: "Subjective",
      accessorKey: "subjective",
      accessorFn: (row) => <TruncatedText>{row?.subjective}</TruncatedText>,
    },
    {
      header: "Objective",
      accessorKey: "objective",
      accessorFn: (row) => <TruncatedText>{row?.objective}</TruncatedText>,
    },
    {
      header: "Assessment",
      accessorKey: "assessment",
      accessorFn: (row) => <TruncatedText>{row?.assessment}</TruncatedText>,
    },
    {
      header: "Plan",
      accessorKey: "plan",
      accessorFn: (row) => <TruncatedText>{row?.plan}</TruncatedText>,
    },
    hideActions && {
      header: "Action",
      accessorFn: (row) => (
        <Button
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: "#E02828",
            " &:hover": {
              background: "#E02828",
            },
          }}
          onClick={() => handleShowDetail(row)}
        >
          View Detail
        </Button>
      ),
    },
  ].filter(Boolean);
  const handleOpenDetailModal = (data) => {
    console.log("data:::",data);
    setDetailData(data);
    setDetailModalOpen(true);
    setAnchorElUser(null);
  };

  return (
    <>
      <Box display="flex" justifyContent="center">
        <div>{getAllSoapNotes?.isLoading && <BeatLoader />}</div>
      </Box>
      <Box display="flex" justifyContent="center">
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
            height="45px"
            radius="12px"
            variant="contained"
            color="primary"
            sx={{
              margin: `${
                getAllSoapNotes?.data?.data?.length > 0 ? "15px " : "15px auto"
              }`,
              backgroundColor: "#E02828",
              " &:hover": {
                background: "#E02828",
              },
            }}
            startIcon={
              getAllSoapNotes?.data?.data?.length > 0 ? "" : <AddIcon />
            }
            onClick={() => {
              setSoapNoteId(null);
              setOpen(true);
            }}
          >
            Add SOAP Notes
          </Button>
        )}
      </Box>

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
          <Table
            columns={columns}
            data={getAllSoapNotes?.data?.data || []}
            enableRowSelection={false}
            enableRowActions={hideActions ? false : true}
            renderRowActions={({ row, cell }) => (
              <>
                <IconButton
                  disableRipple={true}
                  size="large"
                  // edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  onClick={(event) => {
                    handleOpenUserMenu(event, cell);
                  }}
                  role="button"
                  tabIndex="0"
                  onKeyDown={(e) => {
                    e.stopPropagation();
                  }}
                  color="inherit"
                >
                  <MoreVertIcon />
                </IconButton>
                {!hideActions && (
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
                    <MenuItem onClick={() => handleOpenDetailModal(cell?.row?.original)}>
                      <VisibilityIcon sx={{ fontSize: "20px" }} />
                      <Typography
                        variant="subtitle1"
                        fontWeight="400"
                        component="span"
                        ml={0.5}
                      >
                        View
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={() => handleEdit(cell)}>
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
                )}
              </>
            )}
          />
        )}
      </Box>

      {open && (
        <AddSoapNotesModal
          title="Add Soap Notes"
          soapNoteId={soapNoteId}
          open={open}
          handleClose={() => setOpen(false)}
        />
      )}

      {detailModalOpen && (
        <Modal open={detailModalOpen} onClose={() => setDetailModalOpen(false)}>
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: 2,
              width: "60%",
              maxHeight: "90vh",
              overflowY: "auto",
              margin: "auto",
              marginBlock: "5%",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              position: "relative",
            }}
          >
            <IconButton
              onClick={() => setDetailModalOpen(false)}
              sx={{ position: "absolute", top: 16, right: 26, zIndex: 999 }}
            >
              <CloseIcon />
            </IconButton>
            <Box
              sx={{
                padding: 4,
                borderBottom: "1px solid #ccc",
                backgroundColor: "#fff",
                zIndex: 1,
              }}
            >
              <MuiTypography variant="h5" component="h2">
                SOAP Notes Details
              </MuiTypography>
            </Box>
            <Box
              sx={{
                padding: 4,
                overflowY: "auto",
                backgroundColor: "#f9f9f9",
                flex: 1, // Ensures the content box takes up remaining space
              }}
            >
              {detailData && (
                <>
                  <MuiTypography
                    variant="body1"
                    component="p"
                    sx={{ marginBottom: 1.5 }}
                  >
                    <strong>Subjective:</strong> {detailData.subjective}
                  </MuiTypography>
                  <MuiTypography
                    variant="body1"
                    component="p"
                    sx={{ marginBottom: 1.5 }}
                  >
                    <strong>Objective:</strong> {detailData.objective}
                  </MuiTypography>
                  <MuiTypography
                    variant="body1"
                    component="p"
                    sx={{ marginBottom: 1.5 }}
                  >
                    <strong>Assessment:</strong> {detailData.assessment}
                  </MuiTypography>
                  <MuiTypography
                    variant="body1"
                    component="p"
                    sx={{ marginBottom: 2 }}
                  >
                    <strong>Plan:</strong> {detailData.plan}
                  </MuiTypography>
                </>
              )}
            </Box>
          </Box>
        </Modal>
      )}

      {deleteModal && (
        <DeleteModal
          open={deleteModal}
          handleClose={() => setDeleteModal(false)}
          title="Delete Soap Notes"
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
