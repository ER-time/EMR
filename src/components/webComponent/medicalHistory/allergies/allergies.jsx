import { Box, Button, GenericModal } from "@/components";
import MaterialReactTable from "material-react-table";
import styled from "styled-components";
import { useState } from "react";
import MuiTypography from "@/components/core/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import AddIcon from "@mui/icons-material/Add";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Grid, IconButton, MenuItem, Select, Menu } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InputField from "@/components/core/Input";
import {
  useDeleteAllergiesMutation,
  useGetAllAllergiesHistoryQuery,
} from "@/redux/slices/userProfile";
import { DeleteModal } from "@/components/webComponent";
import AddAllergyModal from "./addAllergyModal";
import Table from "@/components/core/Table";
import { API_END_POINTS } from "@/config";
import useSWR from "swr";
import { fetcher } from "@/lib/api-instance";
import { useSession } from "next-auth/react";
import { LoaderTable } from "@/components/core/Loader/Loader";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";
import { useDispatch } from "react-redux";

const StyledMaterialReactTable = styled(MaterialReactTable)``;
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

export default function Allergies({ appointmentData, hideAction }) {
  const [open, setOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [medicalHistoryId, setMedicalHistoryId] = useState(null);
  const [rowData, setRowData] = useState(null);
  const dispatch = useDispatch();
  const [deleteAllergies, { isLoading: AllergiesLoading }] =
    useDeleteAllergiesMutation();
  const { data: session } = useSession();

  const allergiesData = useGetAllAllergiesHistoryQuery({
    patientId: appointmentData?.data?.patientId,
  });
  const handleConfirm = async () => {
    try {
      const response = await deleteAllergies(medicalHistoryId).unwrap();
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
          message: "Error deleting allergies",
        })
      );
    }
  };

  const handleOpenUserMenu = (data, event) => {
    event.stopPropagation();
    setAnchorElUser(event.currentTarget);
    setMedicalHistoryId(data?.original?.medicalHistoryId);
  };

  const columns = [
    {
      header: "Allergy From",
      accessorKey: "allergyFromType",
      accessorFn: (row) => {
        return <div>{row?.allergyFromType || "N/A"}</div>;
      },
    },
    {
      header: "Reaction",
      accessorKey: "reaction",
    },
    {
      header: "Medication/Treatments",
      accessorKey: "medicationTreatment",
    },
  ];

  return (
    <>
      {!hideAction && (
        <Box display="flex" justifyContent="center">
          <Button
            variant="outlined"
            height="45px"
            radius="12px"
            sx={{ margin: "15px auto" }}
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Add Allergies
          </Button>
        </Box>
      )}

      {allergiesData?.isLoading ? (
        <div>
          <LoaderTable />
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            data={allergiesData?.data?.data || []}
            enableRowSelection={false}
            enableRowActions={!hideAction ? true : false}
            renderRowActions={({ row, cell }) => (
              <IconButton
                disableRipple={true}
                size="large"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={(event) => {
                  {
                    handleOpenUserMenu(row, event);
                    setRowData(cell?.row?.original);
                  }
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
            onClose={() => setAnchorElUser(null)}
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
            <MenuItem
              onClick={(row) => {
                setOpen(true);
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
        <AddAllergyModal
          open={open}
          handleClose={() => setOpen(false)}
          allAllergies={allergiesData?.data?.data || []}
          columns={columns}
          medicalHistoryId={medicalHistoryId}
          rowData={rowData}
          appointmentData={appointmentData}
        />
      )}

      {deleteModal && (
        <DeleteModal
          loading={AllergiesLoading}
          open={deleteModal}
          handleClose={() => setDeleteModal(false)}
          tittle="Delete Allergies"
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
