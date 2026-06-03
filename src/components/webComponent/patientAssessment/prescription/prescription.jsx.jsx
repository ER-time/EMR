import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Menu,
  Modal,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  useDeletePrescriptionMutation,
  useGetAllPrecriptionQuery,
} from "@/redux/slices/userProfile";
import { DeleteModal } from "@/components/webComponent";
import Table from "@/components/core/Table";
import AddPrescriptionModal from "./AddPrescriptionModal";
import { BeatLoader } from "react-spinners";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";

// Styled Components
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

// DetailModal Component
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
        Prescription Details
      </Typography>
      {detailData && (
        <Box>
          <Typography variant="body1" component="p" sx={{ marginBottom: 1.5 }}>
            <strong>Patient:</strong> {detailData.patient}
          </Typography>
          <Typography variant="body1" component="p" sx={{ marginBottom: 1.5 }}>
            <strong>Dosage:</strong> {detailData.dosage}
          </Typography>
          <Typography variant="body1" component="p" sx={{ marginBottom: 1.5 }}>
            <strong>Frequency:</strong> {detailData.frequency}
          </Typography>
          <Typography variant="body1" component="p" sx={{ marginBottom: 1.5 }}>
            <strong>Medicine:</strong> {detailData.medicine}
          </Typography>
          <Typography variant="body1" component="p" sx={{ marginBottom: 1.5 }}>
            <strong>Start Time:</strong>{" "}
            {moment(detailData.prescriptionStartTime).format("MM/DD/YY")}
          </Typography>
          <Typography variant="body1" component="p">
            <strong>End Time:</strong>{" "}
            {moment(detailData.prescriptionEndTime).format("MM/DD/YY")}
          </Typography>
        </Box>
      )}
    </Box>
  </Modal>
);

// Main Prescription Component
export default function Prescription({
  appointmentData,
  hideActions,
  appointmentIdProp, // Renamed prop to avoid confusion with useParams
}) {
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const dispatch = useDispatch();

  // Fetching all prescriptions based on appointment ID
  const { data, isLoading, isError, isSuccess } = useGetAllPrecriptionQuery({
    appointmentId: params?.appointment || appointmentIdProp?.appointmentId || 1,
  });

  const [deletePrescription] = useDeletePrescriptionMutation();

  // Handlers for opening and closing modals
  const handleOpen = () => {
    setDetailData(null);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleOpenUserMenu = (data, event) => {
    event.stopPropagation();
    setDetailData(data.original);
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => setAnchorElUser(null);

  // Handler for confirming deletion
  const handleConfirm = async () => {
    try {
      const response = await deletePrescription(
        detailData?.prescriptionId
      ).unwrap();
      if (response.succeeded) {
        dispatch(onSuccess({ message: "Prescription deleted successfully." }));
      }
      setDetailData(null);
      setDeleteModal(false);
    } catch (error) {
      dispatch(onFailure({ message: "Error deleting prescription." }));
    }
  };

  // Handler for opening detail modal
  const handleOpenDetailModal = (data) => {
    setDetailData(data);
    setDetailModalOpen(true);
    setAnchorElUser(null);
  };

  // Define table columns
  const columns = [
    {
      header: "Patient",
      accessorKey: "patient",
    },
    {
      header: "Dosage",
      accessorKey: "dosage",
    },
    {
      header: "Frequency",
      accessorKey: "frequency",
    },
    {
      header: "Medicine",
      accessorKey: "medicine",
    },
    {
      header: "Start Time",
      accessorKey: "prescriptionStartTime",
      accessorFn: (row) => moment(row.prescriptionStartTime).format("MM/DD/YY"),
    },
    {
      header: "End Time",
      accessorKey: "prescriptionEndTime",
      accessorFn: (row) => moment(row.prescriptionEndTime).format("MM/DD/YY"),
    },
    hideActions && {
      header: "Action",
      accessorFn: (row) => (
        <Button
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: "#E02828",
            "&:hover": {
              background: "#E02828",
            },
          }}
          onClick={() => handleOpenDetailModal(row)}
        >
          View Details
        </Button>
      ),
    },
  ].filter(Boolean); // Filter out false values when hideActions is true

  const handleEdit = (row) => {
    setOpen(true);
    setAnchorElUser(null);
  };

  return (
    <>
      {/* Loading Indicator */}
      <Box display="flex" justifyContent="center" my="15px">
        {isLoading && <BeatLoader />}
      </Box>

      {/* Add Prescription Button */}
      <Box
        display="flex"
        justifyContent={data?.data?.length > 0 ? "flex-end" : "center"}
      >
        {!hideActions && (
          <Button
            variant={data?.data?.length > 0 ? "contained" : "outlined"}
            height="45px"
            radius="12px"
            sx={{
              backgroundColor: data?.data?.length > 0 ? "#E02828" : "#E02828",
              color: data?.data?.length > 0 ? "#fff" : "#fff",
              margin: data?.data?.length > 0 ? "15px" : "15px auto",
              "&:hover": {
                backgroundColor:
                  data?.data?.length > 0 ? "#C02020" : "#E02828",
              },
            }}
            startIcon={data?.data?.length > 0 ? <AddIcon /> : <AddIcon />}
            onClick={handleOpen}
          >
            {data?.data?.length > 0 ? "Add Prescription" : "Add Prescription"}
          </Button>
        )}
      </Box>

      {/* Error Message */}
      {isError && <Typography color="error">Network Error</Typography>}

      {/* Prescriptions Table */}
      {isSuccess && (
        <>
          <Table
            columns={columns}
            data={data?.data || []}
            enableRowSelection={false}
            enableRowActions={!hideActions}
            renderRowActions={({ row, cell }) => (
              <>
                <IconButton
                  disableRipple
                  size="large"
                  aria-label="more"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={(event) => handleOpenUserMenu(row, event)}
                  color="inherit"
                >
                  <MoreVertIcon />
                </IconButton>
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
                    <Typography
                      variant="subtitle1"
                      fontWeight="400"
                      component="span"
                      ml={0.5}
                    >
                      Edit
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setDeleteModal(true);
                      setAnchorElUser(null);
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: "20px" }} />
                    <Typography
                      variant="subtitle1"
                      fontWeight="400"
                      component="span"
                      ml={0.5}
                    >
                      Delete
                    </Typography>
                  </MenuItem>
                </StyledMenu>
              </>
            )}
          />
        </>
      )}

      {/* Action Menu */}
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
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem onClick={() => handleOpenDetailModal(detailData)}>
          <VisibilityIcon sx={{ fontSize: "20px" }} />
          <Typography variant="subtitle1" fontWeight="400" component="span" ml={0.5}>
            View
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => setOpen(true)}>
          <ModeEditIcon sx={{ fontSize: "20px" }} />
          <Typography variant="subtitle1" fontWeight="400" component="span" ml={0.5}>
            Edit
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setDeleteModal(true);
            setAnchorElUser(null);
          }}
        >
          <DeleteIcon sx={{ fontSize: "20px" }} />
          <Typography variant="subtitle1" fontWeight="400" component="span" ml={0.5}>
            Delete
          </Typography>
        </MenuItem>
      </StyledMenu> */}
      {/* Action Menu */}

      {/* Add Prescription Modal */}
      {open && (
        <AddPrescriptionModal
          appointmentData={appointmentData || []}
          open={open}
          handleClose={handleClose}
          rowData={detailData}
          title={"Add Prescription"}
          // Optionally pass additional props if needed
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <DeleteModal
          open={deleteModal}
          handleClose={() => setDeleteModal(false)}
          tittle="Delete Prescription"
          onConfirm={handleConfirm}
        />
      )}

      {/* Detail Modal */}
      <DetailModal
        open={detailModalOpen}
        handleClose={() => setDetailModalOpen(false)}
        detailData={detailData}
      />
    </>
  );
}
