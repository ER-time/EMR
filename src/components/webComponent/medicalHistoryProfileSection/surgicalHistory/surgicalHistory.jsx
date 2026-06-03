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
  useDeleteSurgicalMedicalHistoryMutation,
  useGetAllSurgicalHistoryQuery,
} from "@/redux/slices/userProfile";
import { BeatLoader } from "react-spinners";
import Table from "@/components/core/Table";
import { DeleteModal } from "@/components/webComponent";
import SurgicalHistoryModal from "./addSurgicalHistoryModal";
import { useSession } from "next-auth/react";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";
import { useDispatch } from "react-redux";

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
export default function SurgicalHistory() {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [surgicalHistoryId, setSurgicalHistoryId] = useState(null);
  const handleOpen = () => {
    setSurgicalHistoryId(null)
    setOpen(true)};
  const session =useSession()
  const dispatch =useDispatch();
  const GetAllSurgicalHistory = useGetAllSurgicalHistoryQuery({
    patientId:  session?.data?.user?.user?.userId,
  });
  const handleOpenUserMenu = (data, event,cell) => {
    event.stopPropagation();
    setAnchorElUser(event.currentTarget);
    setSurgicalHistoryId(cell?.row?.original);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

 

  const handleEdit = (row) => {
    setOpen(true);
  };
  const [deleteSurgicalMedicalHistory, { isLoading }] =
  useDeleteSurgicalMedicalHistoryMutation();
  const deleteSurgicalHistory = async () => {
    try {
      const response = await deleteSurgicalMedicalHistory(
        surgicalHistoryId?.surgicalHistoryId
      ).unwrap();
      if (response.succeeded) {
        dispatch(
          onSuccess({
            message:"Record Deleted Successfully"|| "Success",
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

      {GetAllSurgicalHistory?.isError && <p>{"Network Error"}</p>}
      {GetAllSurgicalHistory?.isSuccess && (
        <>
          <Table
            columns={columns}
            data={GetAllSurgicalHistory?.data?.data || []}
            enableRowSelection={false}
            enableRowActions={true}
            renderRowActions={({ row,cell }) => (
              <IconButton
                disableRipple={true}
                size="large"
                // edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={(event) => handleOpenUserMenu(row, event,cell)}
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
            {/* <MenuItem
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
            </MenuItem> */}
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
          open={open}
          handleClose={handleClose}
          GetAllSurgicalHistory={GetAllSurgicalHistory}
          columns={columns}
          surgicalHistoryData={surgicalHistoryId}
        />
      )}
      {deleteModal && (
        <DeleteModal
          loading={isLoading}
          open={deleteModal}
          handleClose={() => setDeleteModal(false)}
          tittle="Delete Surgical History"
          onConfirm={deleteSurgicalHistory}
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
