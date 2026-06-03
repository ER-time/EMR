import {
  Box,
  Button,
  Modal,
  Typography,
  IconButton,
  MenuItem,
  Menu,
} from "@mui/material";
import styled from "styled-components";
import { useState } from "react";
import MuiTypography from "@/components/core/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import AddIcon from "@mui/icons-material/Add";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  useDeleteHistoryOfPresentIllnessMutation,
  useGetHistoryOfPresentIllnessQuery,
} from "@/redux/slices/userProfile";
import { DeleteModal } from "@/components/webComponent";
import Table from "@/components/core/Table";
import AddHopiModal from "./addHopiModal";
import { BeatLoader } from "react-spinners";
import CloseIcon from "@mui/icons-material/Close";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";
import moment from "moment";

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

const DetailModal = ({ open, handleClose, detailData }) => (
  <Modal open={open} onClose={handleClose}>
    <Box
      sx={{
        padding: 4,
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
        onClick={handleClose}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <Typography variant="h5" component="h2" sx={{ marginBottom: 2 }}>
        HOPI Details
      </Typography>
      {detailData && (
        <Box>
          <Typography variant="body1" component="p" sx={{ marginBottom: 1.5 }}>
            <strong>Timing On Set:</strong>{" "}
            {moment(detailData.timingOnset).format("MM-DD-YYYY")}
          </Typography>
          <Typography variant="body1" component="p" sx={{ marginBottom: 1.5 }}>
            <strong>Location:</strong> {detailData.location}
          </Typography>
          <Typography variant="body1" component="p" sx={{ marginBottom: 1.5 }}>
            <strong>Duration:</strong> {detailData.duration}
          </Typography>
          <Typography variant="body1" component="p" sx={{ marginBottom: 1.5 }}>
            <strong>Aggrevating Factors:</strong>{" "}
            {detailData.aggrevatingFactors}
          </Typography>
          <Typography variant="body1" component="p" sx={{ marginBottom: 1.5 }}>
            <strong>Relieving Factors:</strong> {detailData.relievingFactors}
          </Typography>
          <Typography variant="body1" component="p" sx={{ marginBottom: 1.5 }}>
            <strong>Treatments Tried:</strong> {detailData.treatmentsTried}
          </Typography>
          <Typography variant="body1" component="p" sx={{ marginBottom: 1.5 }}>
            <strong>Symptoms Associated:</strong>{" "}
            {detailData.symptomsAssociated}
          </Typography>
          <Typography variant="body1" component="p" sx={{ marginBottom: 1.5 }}>
            <strong>Severity:</strong> {detailData.severityName}
          </Typography>
        </Box>
      )}
    </Box>
  </Modal>
);

export default function HOPI({ appointmentData, hideActions, rowData }) {
  const [open, setOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();

  const historyOfPresentIllness = useGetHistoryOfPresentIllnessQuery({
    appointmentId: params?.appointment || rowData?.appointmentId || 1,
  });

  const handleOpen = () => {
    setDetailData(null);
    setOpen(true);
  };

  const handleOpenDetailModal = (data) => {
    setDetailData(data);
    setDetailModalOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleOpenUserMenu = (data, event) => {
    event.stopPropagation();
    setAnchorElUser(event.currentTarget);
    setDetailData(data?.original);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [deleteHistoryOfPresentIllness] =
    useDeleteHistoryOfPresentIllnessMutation();

  const handleConfirm = async () => {
    try {
      const response = await deleteHistoryOfPresentIllness(
        detailData?.illnessId
      ).unwrap();
      if (response.succeeded) {
        dispatch(onSuccess({ message: "Record Deleted Successfully" }));
      }
      setDetailData(null);
      setDeleteModal(false);
    } catch (error) {
      dispatch(onFailure({ message: "Error deleting record" }));
    }
  };

  const columns = [
    {
      header: "Timing On Set",
      accessorKey: "timingOnset",
      accessorFn: (row) => moment(row.timingOnset).format("MM-DD-YYYY"),
    },
    {
      header: "Location",
      accessorKey: "location",
    },
    {
      header: "Duration",
      accessorKey: "duration",
    },
    {
      header: "Aggrevating Factors",
      accessorKey: "aggrevatingFactors",
    },
    {
      header: "Relieving Factors",
      accessorKey: "relievingFactors",
    },
    {
      header: "Treatments Tried",
      accessorKey: "treatmentsTried",
    },
    {
      header: "Symptoms Associated",
      accessorKey: "symptomsAssociated",
    },
    {
      header: "Severity",
      accessorKey: "severityName",
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
          onClick={() => handleOpenDetailModal(row)}
        >
          View Detail
        </Button>
      ),
    },
  ].filter(Boolean);

  return (
    <>
      <Box display="flex" justifyContent="center" my="15px">
        <div>{historyOfPresentIllness?.isLoading && <BeatLoader />}</div>
      </Box>
      <Box
        display="flex"
        justifyContent={`${
          historyOfPresentIllness?.data?.data?.length > 0
            ? "flex-end"
            : "center"
        }`}
      >
        {!hideActions && (
          <Button
            height="45px"
            radius="12px"
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: "#E02828",
              " &:hover": {
                background: "#E02828",
              },
              margin: `${
                historyOfPresentIllness?.data?.data?.length > 0
                  ? "15px "
                  : "15px auto"
              }`,
            }}
            startIcon={
              historyOfPresentIllness?.data?.data?.length > 0 ? "" : <AddIcon />
            }
            onClick={handleOpen}
          >
            Add HOPI
          </Button>
        )}
      </Box>
      {historyOfPresentIllness?.isError && <p>{"Network Error"}</p>}
      {historyOfPresentIllness?.isSuccess && (
        <>
          <Table
            columns={columns}
            data={historyOfPresentIllness?.data?.data || []}
            enableRowSelection={false}
            enableRowActions={!hideActions}
            renderRowActions={({ row }) => (
              <IconButton
                disableRipple={true}
                size="large"
                aria-label="more"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={(event) => handleOpenUserMenu(row, event)}
                role="button"
                tabIndex="0"
                onKeyDown={(e) => {
                  e.stopPropagation();
                }}
                color="inherit"
              >
                <MoreVertIcon />
              </IconButton>
            )}
          />

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
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem onClick={() => handleOpenDetailModal(detailData)}>
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
            <MenuItem onClick={() => setOpen(true)}>
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
        </>
      )}
      {open && (
        <AddHopiModal
          appointmentData={appointmentData || []}
          open={open}
          handleClose={handleClose}
          historyOfPresentIllness={historyOfPresentIllness}
          columns={columns}
          illnessData={detailData}
        />
      )}
      {deleteModal && (
        <DeleteModal
          open={deleteModal}
          handleClose={() => setDeleteModal(false)}
          title="Delete HOPI"
          onConfirm={handleConfirm}
        />
      )}
      <DetailModal
        open={detailModalOpen}
        handleClose={() => setDetailModalOpen(false)}
        detailData={detailData}
      />
    </>
  );
}
