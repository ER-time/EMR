import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";
import MuiTypography from "@/components/core/Typography";
import { Box, Button } from "@/components";
import AddSoapNotesModal from "./addSoapNotesModal";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useGetAllSoapNotesQuery } from "@/redux/slices/userProfile";
import styled from "styled-components";
import { MenuItem, Menu, IconButton, Modal } from "@mui/material";
import { BeatLoader } from "react-spinners";
import { useParams, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Table from "@/components/core/Table";
import CloseIcon from "@mui/icons-material/Close";

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

export default function SOAPNotes() {
  const TruncatedText = styled(MuiTypography)`
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  `;

  const [detailData, setDetailData] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [soapNoteId, setsoapNoteId] = useState(null);
  const session = useSession();
  const pathname = usePathname();
  const url = pathname.split("/");
  const patientId = url[url.length - 1];
  const handleEdit = (row) => {
    setOpen(true);
    // setsoapNoteId(row?.soapNoteId);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleOpenUserMenu = (data, event) => {
    setsoapNoteId(data?.soapNoteId);

    event.stopPropagation();
    setAnchorElUser(event.currentTarget);
  };
  const getAllSoapNotes = useGetAllSoapNotesQuery({
    patientId: patientId,
  });

  const handleShowDetail = (row) => {
    setDetailData(row);
    setDetailModalOpen(true);
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
    {
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
  ];

  return (
    <>
      <Box display="flex" justifyContent="center" my="15px">
        <div>{getAllSoapNotes?.isLoading && <BeatLoader />}</div>
      </Box>
      <Box display="flex" justifyContent="center" my="15px">
        <div>{getAllSoapNotes?.isError && <p>Network Error</p>}</div>
      </Box>
      <Box
        display="flex"
        justifyContent={`${
          getAllSoapNotes?.data?.data?.length > 0 ? "flex-end" : "center"
        }`}
      >
        {/* {!hideActions && (
          <Button
            variant={`${
              getAllSoapNotes?.data?.data?.length > 0 ? "" : "outlined"
            }`}
            height="45px"
            radius="12px"
            bg={`${getAllSoapNotes?.data?.data?.length > 0 ? "#E02828" : ""}`}
            sx={{
              margin: `${
                getAllSoapNotes?.data?.data?.length > 0 ? "15px " : "15px auto"
              }`,
            }}
            startIcon={
              getAllSoapNotes?.data?.data?.length > 0 ? "" : <AddIcon />
            }
            onClick={() => setOpen(true)}
          >
            Add SOAP Notes
          </Button>
        )} */}
      </Box>
      {/* <Box display="flex" justifyContent="center">
        <Button
          variant="outlined"
          height="45px"
          radius="12px"
          sx={{ margin: "15px auto" }}
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add SOAP Notes
        </Button>
      </Box> */}
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
          <React.Fragment>
            <Table
              columns={columns}
              data={getAllSoapNotes?.data?.data || []}
              enableRowSelection={false}
              enableRowActions={false}
            />
          </React.Fragment>
        )}
      </Box>
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
      {open && (
        <AddSoapNotesModal
          soapNoteId={soapNoteId}
          open={open}
          handleClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
