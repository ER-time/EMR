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
import { useGetHistoryOfPresentIllnessQuery } from "@/redux/slices/userProfile";
import { DeleteModal } from "@/components/webComponent";
import Table from "@/components/core/Table";
import AddHopiModal from "./addHopiModal";
import { BeatLoader } from "react-spinners";
import { convertDateToISOFormat, extractDateTimeComponents } from "@/lib/utils";
import moment from "moment";
import { usePathname } from "next/navigation";

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
export default function HOPI() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const pathname = usePathname();
  const url = pathname.split("/");
  const patientId = url[url.length - 1];
  const historyOfPresentIllness = useGetHistoryOfPresentIllnessQuery({patientId:patientId});
  const [illnessId, setillnessId] = useState(null);
  const handleOpenUserMenu = (data, event) => {
    event.stopPropagation();
    setAnchorElUser(event.currentTarget);
    setillnessId(data?.original?.illnessId);
  };
  const handleEdit = (row) => {
    setOpen(true);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const columns = [
    {
      header: "Timing On Set",
      accessorKey: "timingOnset",
      accessorFn: (row) => {
        const { date } = extractDateTimeComponents(row.timingOnset);
        return <div>{moment(date).format("MM/DD/YY")}</div>;
      },
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
  ];



  return (
    <>
      {/* <StyledMaterialReactTable
        enableRowSelection={false}
        enableTopToolbar={false}
        enableColumnFilters={false}
        enableColumnActions={false}
        enablePagination={false}
        columns={columns}
        data={AllAllergies?.data?.data || []}
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
        {/* {!hideActions && (
          <Button
            variant={`${
              historyOfPresentIllness?.data?.data?.length > 0 ? "" : "outlined"
            }`}
            height="45px"
            radius="12px"
            bg={`${
              historyOfPresentIllness?.data?.data?.length > 0 ? "#E02828" : ""
            }`}
            sx={{
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
        )} */}
      </Box>
      {historyOfPresentIllness?.isError && <p>{"Network Error"}</p>}
      {historyOfPresentIllness?.isSuccess && (
        <>
          <Table
            columns={columns}
            data={historyOfPresentIllness?.data?.data || []}
            enableRowSelection={false}
            enableRowActions={ false}
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
      {/* {open && (
        <AddHopiModal
          appointmentData={appointmentData || []}
          open={open}
          handleClose={handleClose}
          historyOfPresentIllness={historyOfPresentIllness}
          columns={columns}
          illnessId={illnessId}
        />
      )}
      {deleteModal && (
        <DeleteModal
          open={deleteModal}
          handleClose={() => setDeleteModal(false)}
          tittle="Delete HOPI"
          onConfirm={() => console.log("")}
        />
      )} */}
    </>
  );
}
