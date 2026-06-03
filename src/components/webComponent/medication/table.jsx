"use client";
import { useEffect, useState } from "react";
import { IconButton, MenuItem, Menu } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import styled from "styled-components";
import { Box, Button } from "@/components";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import MuiTypography from "@/components/core/Typography";
import Table from "@/components/core/Table";
import DeleteIcon from "@mui/icons-material/Delete";
import { DeleteModal } from "@/components/webComponent";
import {
  useDeleteMedicationMutation,
  useGetAllMedicationQuery,
} from "@/redux/slices/userProfile";

import MedicationModal from "./addMedicationModal";
import { Loader1 } from "@/components/core/Loader/Loader";
import { useSession } from "next-auth/react";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";
import { useDispatch } from "react-redux";
import { useGetAllDropdownsQuery } from "@/redux/slices/user";

const columns = [
  {
    header: "Medicine",
    accessorKey: "medicineName",
  },
  {
    header: "Dose",
    accessorKey: "dose",
  },
  {
    header: "Dose Frequency",
    accessorKey: "doseFrequency",
  },
  {
    header: "Reason",
    accessorKey: "reason",
  },
];

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

export default function MedicationTable() {
  const [open, setOpen] = useState(false);
  const [medicationId, setMedicationId] = useState(null);
  console.log("medicationId", medicationId);
  const handleOpen = () => {
    setOpen(true);
    setMedicationId("");
  };
  const [deleteModal, setDeleteModal] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const dispatch = useDispatch();
  const [deleteMedication, { data, isLoading }] = useDeleteMedicationMutation();
  const handleDeleteMedication = async () => {
    try {
      const response = await deleteMedication(
        medicationId?.medicationId
      ).unwrap();
      if (response.succeeded) {
        dispatch(
          onSuccess({
            message: "Record Deleted Successfully" || "Success",
          })
        );
      }
      setMedicationId(null);
      setDeleteModal(false);
      // onConfirm();
    } catch (error) {
      dispatch(
        onFailure({
          message: "Error deleting Medication",
        })
      );
    }
  };

  const handleOpenUserMenu = (data, event, cell) => {
    event.stopPropagation();
    setAnchorElUser(event.currentTarget);
    setMedicationId(cell?.row?.original);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleClose = () => setOpen(false);
  const session = useSession();
  const userData = session?.data?.user?.user;
  const payload = {
    pageNo: 1,
    pageSize: 10,
    patientId: userData?.userId,
  };
  const getMedications = useGetAllMedicationQuery(payload);
  const getAllLookup = useGetAllDropdownsQuery();
  useEffect(() => {
    const fetchMedications = async () => {
      const payload = {
        pageNo: 1,
        pageSize: 10,
        patientId: userData?.userId,
      };
      try {
        await getMedications.refetch(payload);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchMedications();
  }, [userData]);

  const handleEdit = (row) => {
    setOpen(true);
  };

  if (getMedications?.isLoading) {
    return (
      <Box>
        <Loader1 />
      </Box>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      <Box display="flex" justifyContent="flex-end" my="15px">
        <Button
          variant="contain"
          bg="#E02828"
          color="#fff"
          height="45px"
          radius="12px"
          onClick={handleOpen}
        >
          Add Medication
        </Button>
      </Box>

      {getMedications?.isError && (
        <MuiTypography color="#e02828" m="auto">
          {getMedications?.error?.data?.message || "Error"}
        </MuiTypography>
      )}
      {getMedications?.isSuccess && (
        <>
          <Table
            columns={columns}
            data={getMedications?.data?.data || []}
            enableRowSelection={false}
            enableRowActions={true}
            renderRowActions={({ cell, row }) => (
              <IconButton
                disableRipple={true}
                size="large"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={(event) => handleOpenUserMenu(row, event, cell)}
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
                Update
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
        <MedicationModal
          open={open}
          handleClose={handleClose}
          getMedications={getMedications}
          columns={columns}
          medicationRowData={medicationId}
          getAllLookup={getAllLookup}
        />
      )}
      {deleteModal && (
        <DeleteModal
          open={deleteModal}
          handleClose={() => setDeleteModal(false)}
          tittle="Delete Medication"
          onConfirm={handleDeleteMedication}
          loading={isLoading}
        />
      )}
    </div>
  );
}
