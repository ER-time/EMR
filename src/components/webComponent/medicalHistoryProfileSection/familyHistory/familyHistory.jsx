import { Box, Button, GenericModal } from "@/components";
import styled from "styled-components";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { MenuItem, Menu, IconButton } from "@mui/material";
import MuiTypography from "@/components/core/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import {
  useDeleteFamilyMedicalHistoryMutation,
  useGetAllFamilyHistoryQuery,
} from "@/redux/slices/userProfile";
import { BeatLoader } from "react-spinners";
import { getSession } from "next-auth/react";
import Table from "@/components/core/Table";
import { DeleteModal } from "@/components/webComponent";
import AddFamilyHistoryModal from "./addFamilyHistoryModal";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";
import { useDispatch } from "react-redux";

const INPUT_LABEL_PROPS = {
  variant: "subtitle1",
  component: "label",
  fontWeight: "500",
  spacing: "0.1px",
};

const INPUT_FIELD_PROPS = {
  label: "",
  fullWidth: true,
  variant: "standard",
};

const INPUT_FIELD_STYLES = {
  sx: {
    margin: "0px 0px",
    height: "50px",
    "& fieldset": { border: "1px solid #E2E5ED" },
  },
};

export default function FamilyHistory() {
  const [open, setOpen] = useState(false);
  const [rowData, setRowData] = useState(null);
  const handleOpen = () => {
    setOpen(true);
    setRowData(null);
  };
  const handleClose = () => setOpen(false);
  const [familyHistoryId, setFamilyHistoryId] = useState(null);
  const [userId, setuserId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const dispatch = useDispatch();
  getSession().then((session) => {
    setuserId(session?.user?.user?.userId);
  });
  const [deleteFamilyMedicalHistory, { isLoading }] =
    useDeleteFamilyMedicalHistoryMutation();

  const GetAllMedicalHistory = useGetAllFamilyHistoryQuery({
    patientId: userId,
  });
  const handleOpenUserMenu = (data, event) => {
    event.stopPropagation();
    setAnchorElUser(event.currentTarget);
    setFamilyHistoryId(data?.original?.familyHistoryId);
  };

  const deleteFamilyMedicalHistoryHandler = async () => {
    try {
      const response = await deleteFamilyMedicalHistory(
        familyHistoryId
      ).unwrap();
      if (response.succeeded) {
        dispatch(
          onSuccess({
            message: "Record Deleted Successfully" || "Success",
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

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleEdit = (row) => {
    setOpen(!open);
  };
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
  return (
    <>
      <Box display="flex" justifyContent="center" my="15px">
        <div>{GetAllMedicalHistory?.isLoading && <BeatLoader />}</div>
      </Box>
      <Box
        display="flex"
        justifyContent={`${
          GetAllMedicalHistory?.data?.data?.length > 0 ? "flex-end" : "center"
        }`}
      >
        <Button
          variant={`${
            GetAllMedicalHistory?.data?.data?.length > 0 ? "" : "outlined"
          }`}
          height="45px"
          radius="12px"
          bg={`${
            GetAllMedicalHistory?.data?.data?.length > 0 ? "#E02828" : ""
          }`}
          sx={{
            margin: `${
              GetAllMedicalHistory?.data?.data?.length > 0
                ? "15px "
                : "15px auto"
            }`,
          }}
          startIcon={
            GetAllMedicalHistory?.data?.data?.length > 0 ? "" : <AddIcon />
          }
          onClick={handleOpen}
        >
          Add Family History
        </Button>
      </Box>

      {GetAllMedicalHistory?.isSuccess && (
        <>
          <Table
            columns={columns}
            data={GetAllMedicalHistory?.data?.data || []}
            enableRowSelection={false}
            enableRowActions={true}
            renderRowActions={({ row, cell }) => {
              return (
                <IconButton
                  disableRipple={true}
                  size="large"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  onClick={(event) => {
                    setRowData(cell?.row?.original);
                    handleOpenUserMenu(row, event);
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
              );
            }}
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
        <AddFamilyHistoryModal
          open={open}
          handleClose={handleClose}
          GetAllMedicalHistory={GetAllMedicalHistory}
          columns={columns}
          familyHistoryId={familyHistoryId}
          rowData={rowData}
          setOpen={setOpen}
        />
      )}

      {deleteModal && (
        <DeleteModal
          loading={isLoading}
          open={deleteModal}
          handleClose={() => setDeleteModal(false)}
          tittle="Delete Family History"
          onConfirm={deleteFamilyMedicalHistoryHandler}
        />
      )}
    </>
  );
}

const columns = [
  {
    header: "Family Member",
    accessorKey: "familyMemberType",
  },
  {
    header: "Age",
    accessorKey: "age",
  },
  {
    header: "Diseases",
    accessorKey: "diseases",
  },
];
