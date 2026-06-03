"use client";
import { useState } from "react";
import { Box, Button } from "@/components";
import MaterialReactTable from "material-react-table";
import styled from "styled-components";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MuiTypography from "@/components/core/Typography";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  useDeleteFamilyMedicalHistoryMutation,
  useGetAllSurgicalHistoryQuery,
} from "@/redux/slices/userProfile";
import { BeatLoader } from "react-spinners";
import Table from "@/components/core/Table";
import { DeleteModal } from "@/components/webComponent";
import SurgicalHistoryModal from "./addSurgicalHistoryModal";
import { useSession } from "next-auth/react";

const StyledMaterialReactTable = styled(MaterialReactTable)``;

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
export default function SurgicalHistory({ appointmentData, hideAction }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [surgicalHistoryId, setSurgicalHistoryId] = useState(null);
  const session = useSession();
  const GetAllSurgicalHistory = useGetAllSurgicalHistoryQuery({
    patientId:
      appointmentData?.data?.patientId || session?.data?.user?.user?.userId,
  });
  const handleOpenUserMenu = (data, event) => {
    event.stopPropagation();
    setAnchorElUser(event.currentTarget);
    setSurgicalHistoryId(data?.original?.surgicalHistoryId);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleEdit = (row) => {
    setOpen(true);
  };
  const [deleteFamilyMedicalHistory, { isLoading }] =
    useDeleteFamilyMedicalHistoryMutation();
  const deleteFamilyMedicalHistoryHandler = async () => {
    try {
      const response = await deleteFamilyMedicalHistory(
        familyHistoryId
      ).unwrap();
      if (response.succeeded) {
        dispatch(
          onSuccess({
            message: response?.message || "Success",
          })
        );
      }
      setDeleteModal(false);
      // onConfirm();
    } catch (error) {
      dispatch(
        onFailure({
          message: "Error deleting familyHistory",
        })
      );
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="center" my="15px">
        <div>{GetAllSurgicalHistory?.isLoading && <BeatLoader />}</div>
      </Box>
      {!hideAction && (
        <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button
            variant={`${
              GetAllSurgicalHistory?.data?.data?.length > 0 ? "" : "outlined"
            }`}
            height="45px"
            radius="12px"
            bg={`${
              GetAllSurgicalHistory?.data?.data?.length > 0 ? "#E02828" : ""
            }`}
            sx={{
              margin: `${
                GetAllSurgicalHistory?.data?.data?.length > 0
                  ? "15px "
                  : "15px auto"
              }`,
            }}
            startIcon={
              GetAllSurgicalHistory?.data?.data?.length > 0 ? "" : <AddIcon />
            }
            onClick={handleOpen}
          >
            Add Surgical History
          </Button>
        </Box>
      )}

      {GetAllSurgicalHistory?.isError && <p>{"Network Error"}</p>}
      {GetAllSurgicalHistory?.isSuccess && (
        <>
          {/* <StyledMaterialReactTable
            enableRowSelection={false}
            enableTopToolbar={false}
            enableColumnFilters={false}
            enableColumnActions={false}
            enablePagination={false}
            columns={columns}
            renderRowActions={({ row }) => (
              <IconButton
                disableRipple={true}
                size="large"
                // edge="end"
                aria-label="account of current user"
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
            data={GetAllSurgicalHistory?.data?.data || []}
            muiTablePaperProps={{
              sx: { boxShadow: "none", my: "10px" },
            }}
            muiTableProps={{
              sx: {
                boxShadow: "none",
              },
            }}
            muiTableHeadCellProps={{
              sx: {
                backgroundColor: "none",
                color: "#348AF4",
              },
            }}
            muiTableBodyCellProps={{
              sx: {
                borderBottomColor: "#F2F2F2",
              },
            }}
          /> */}
          <Table
            columns={columns}
            data={GetAllSurgicalHistory?.data?.data || []}
            enableRowSelection={false}
            enableRowActions={!hideAction ? true : false}
            renderRowActions={({ row }) => (
              <IconButton
                disableRipple={true}
                size="large"
                // edge="end"
                aria-label="account of current user"
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
            <MenuItem onClick={(row) => handleEdit(row)}>
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
        <SurgicalHistoryModal
          appointmentData={appointmentData}
          open={open}
          handleClose={handleClose}
          GetAllSurgicalHistory={GetAllSurgicalHistory}
          columns={columns}
          surgicalHistoryId={surgicalHistoryId}
        />
      )}
      {deleteModal && (
        <DeleteModal
          loading={isLoading}
          open={deleteModal}
          handleClose={() => setDeleteModal(false)}
          tittle="Delete Surgical History"
          onConfirm={() => console.log("")}
        />
      )}
    </>
  );
}

const columns = [
  {
    header: "Surgery",
    accessorKey: "surgeryType",
  },
  {
    header: "Surgery Year",
    accessorKey: "surgeryYear",
  },
  {
    header: "Surgery Reason",
    accessorKey: "surgeryReason",
  },
];

