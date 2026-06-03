"use client";
import { useState } from "react";
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
import { useGetAllMedicationQuery } from "@/redux/slices/userProfile";
import { useGetLookupByValueQuery } from "@/redux/slices/lookups";
import MedicationModal from "./addMadicationModal";
import { Loader1 } from "@/components/core/Loader/Loader";

const columns = [
  {
    header: "Medicine",
    accessorKey: "medicineId",
  },
  {
    header: "Dose",
    accessorKey: "doseTypeId",
  },
  {
    header: "Dose Frequency",
    accessorKey: "doseFrequencyTypeId",
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
  const handleOpen = () => setOpen(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const handleOpenUserMenu = (data, event) => {
    event.stopPropagation();
    setAnchorElUser(event.currentTarget);
    setMedicationId(data?.original?.medicationId);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleClose = () => setOpen(false);
  const getMedications = useGetAllMedicationQuery();
  const getAllLookup = useGetLookupByValueQuery();
  const handleEdit = (row) => {
    setOpen(true);
  };

  if (getMedications?.isLoading) {
    return <Loader1 />;
  }

  if (getMedications?.isError) {
    return (
      <MuiTypography color="#e02828" m="auto">
        {getMedications?.error?.data?.message || "Error"}
      </MuiTypography>
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

      {getMedications?.isError && <p>{"Network Error"}</p>}
      {getMedications?.isSuccess && (
        <>
          <Table
            columns={columns}
            data={getMedications?.data?.data || []}
            enableRowSelection={false}
            enableRowActions={true}
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
        <MedicationModal
          open={open}
          handleClose={handleClose}
          getMedications={getMedications}
          columns={columns}
          medicationId={medicationId}
          getAllLookup={getAllLookup}
        />
      )}
      {deleteModal && (
        <DeleteModal
          open={deleteModal}
          handleClose={() => setDeleteModal(false)}
          tittle="Delete Medication"
          onConfirm={() => console.log("")}
        />
      )}
    </div>
  );
}
