"use client";

import { Avatar, Button, Grid, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";

import { Box, Typography } from "@/components";
import MuiTypography from "@/components/core/Typography";
import InputField from "@/components/core/Input";
import Table from "@/components/core/Table";
import Pagination from "@/components/core/Pagination";
import DatePicker from "@/components/core/DatePicker";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import {
  useGetCannotAffordMutation,
  useUpdateStatusMutation,
} from "@/redux/slices/iCantAfford";
import { Loader1 } from "@/components/core/Loader/Loader";
import moment from "moment";
import { extractDateTimeComponents } from "@/lib/utils";

const INPUT_FIELD_PROPS_SEARCH = {
  label: "",
  fullWidth: true,
  variant: "standard",
};

const INPUT_FIELD_STYLES_SEARCH = {
  sx: {
    margin: "10px 0px",
    width: "200px",
    height: "40px",
    paddingLeft: "10px",
    marginLeft: "10px",
    "& fieldset": { border: "1px solid #E2E5ED" },
  },
};

const StyledPagination = styled.div`
  @media (max-width: 669px) {
    width: 100%;
    display: flex;
    justify-content: end;
  }
`;
export default function FreePatients() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [triggerApi, setTriggerApi] = useState(false);
  const [getCannotAfford, { data, isLoading }] = useGetCannotAffordMutation();
  const session = useSession();
  useEffect(() => {
    async function fetchCannotAfford() {
      try {
        const payload = {};
        const response = await getCannotAfford(payload);
        if (response?.data?.succeeded === true) {
          console.log("");
          // dispatch(
          //   onSuccess({
          //     message: "Record Fetch Successfully",
          //   })
          // );
        } else {
          dispatch(
            onFailure({
              message: "Record not Fetch Successfully",
            })
          );
        }
      } catch (error) {
        dispatch(
          onFailure({
            message: "Record not Fetch Successfully",
          })
        );
      }
    }
    if (session) fetchCannotAfford();
  }, [session, triggerApi]);

  const [
    updateStatus,
    { data: updateStatusData, isLoading: updateStatusLoading },
  ] = useUpdateStatusMutation();
  const handleUpdateStatus = async ({ row, isAdminApproved }) => {
    console.log("row::::::", row);
    console.log("isAdminApproved::::::", isAdminApproved);
    if (isAdminApproved) {
      console.log(111111);
    } else {
      console.log(22222);
    }
    try {
      // return;
      const response = await updateStatus({
        iCantAffordId: row.iCantAffordDetailId,
        isAdminApproved: isAdminApproved,
      });

      if (response?.data?.succeeded === true) {
        dispatch(
          onSuccess({
            message: isAdminApproved
              ? "Status Approved Successfully"
              : "status Rejected",
          })
        );
        setTriggerApi(true);
      } else {
        dispatch(
          onFailure({
            message: "Error ",
          })
        );
      }
    } catch (error) {
      dispatch(
        onFailure({
          message: "error",
        })
      );
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const columns = [
    {
      header: "Patients",
      accessorKey: "patients",
      Cell: ({ cell }) => (
        <Box display="flex" alignItems="center">
          <Avatar sx={{ bgcolor: "rgb(224, 40, 40)", width: 40, height: 40 }}>
            OP
          </Avatar>
          <MuiTypography variant="body2" component="span" sx={{ mx: "10px" }}>
            {cell.row.original.patient}
          </MuiTypography>
        </Box>
      ),
    },
    {
      header: "Patient Email",
      accessorKey: "patientEmail",
    },
    {
      header: "Created At",
      accessorKey: "createAt",
      Cell: ({ cell }) => {
        const { date } = extractDateTimeComponents(cell.row.original.createAt);
        return (
          <Box display="flex" alignItems="center">
            <MuiTypography variant="body2" component="span" sx={{ mx: "10px" }}>
              {moment(date).format("MM/DD/YY") || "N/A"}
            </MuiTypography>
          </Box>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "patientEmail",
      Cell: ({ row }) => {
        return (
          <>
            {row.original.isAdminApproved || row.original.isCount ? (
              <img
                width="48"
                height="48"
                src="https://img.icons8.com/color/48/checked--v1.png"
                alt="checked--v1"
              />
            ) : (
              <Box>
                <Button
                  sx={{
                    background: "green",
                    " &:hover": {
                      background: "green",
                    },
                  }}
                  onClick={() =>
                    handleUpdateStatus({
                      row: row.original,
                      isAdminApproved: true,
                    })
                  }
                  variant="contained"
                >
                  Approve
                </Button>
                <Button
                  sx={{
                    background: "red",
                    ml: 1,
                    " &:hover": {
                      background: "#E02828",
                    },
                  }}
                  onClick={() =>
                    handleUpdateStatus({
                      row: row.original,
                      isAdminApproved: false,
                    })
                  }
                  variant="contained"
                >
                  Reject
                </Button>
              </Box>
            )}
          </>
        );
      },
    },
  ];
  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box
            bgcolor="#fff"
            boxShadow="0px 0px 24px 0px rgba(0, 0, 0, 0.04)"
            width="100%"
            borderRadius="12px"
          >
            <Box
              p="20px"
              display="flex"
              flexWrap="wrap"
              justifyContent="space-between"
              alignItems="center"
            >
              <MuiTypography variant="h6" component="h6" fontWeight="600">
                Free Patients
              </MuiTypography>
              {/* <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="flex-end"
                alignItems="center"
                boxSizing="border-box"
                width="auto"
                sx={{
                  display: { xs: "none", sm: "flex" },
                  marginLeft: "auto",
                }}
              >
                <DatePicker
                  height="40px"
                  width="160px"
                  border="1px solid #e5e6e6"
                  radius="6px"
                  fsize="14px"
                />
                <InputField
                  id="email"
                  placeholder="Search"
                  {...INPUT_FIELD_PROPS_SEARCH}
                  sx={INPUT_FIELD_STYLES_SEARCH.sx}
                  variant="standard"
                  startAdornment={
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  }
                />
              </Box> */}
            </Box>

            <TabelComponent
              isLoading={isLoading}
              Data={data}
              columns={columns}
            />
            <Box
              display="flex"
              justifyContent="space-between"
              flexWrap="wrap"
              alignItems="center"
              pb="20px"
              px="20px"
              sx={{ boxSizing: "border-box" }}
            >
              <MuiTypography
                variant="span"
                component="span"
                color="#1C1D21"
                fontWeight="400"
              >
                {currentPage} to {(data && data?.data?.length) || 0}{" "}
                <span style={{ color: "#666666" }}>out of </span>
                {data?.totalCounts || 0} entries
              </MuiTypography>
              <StyledPagination>
                <Pagination
                  count={Math.ceil(data?.totalCounts / 10)}
                  onPageChange={handlePageChange}
                />
              </StyledPagination>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

const TabelComponent = ({ isLoading, Data, columns }) => {
  if (isLoading) {
    return (
      <Box>
        <Loader1 />
      </Box>
    );
  }
  return (
    <>
      <Table
        columns={columns}
        data={Data?.data || []}
        enableRowSelection={false}
        enableRowActions={false}
        renderDetailPanel={({ row }) => {
          const questions = [
            {
              question: `Question ${row.original.question1}`,
              answer: `Answer 1. ${row.original.answer1}`,
            },
            {
              question: `Question ${row.original.question2}`,
              answer: `Answer 2. ${row.original.answer2}`,
            },
            {
              question: `Question ${row.original.question3}`,
              answer: `Answer 3. ${row.original.answer3}`,
            },
            {
              question: `Question ${row.original.question4}`,
              answer: `Answer 4. ${row.original.answer4}`,
            },
            {
              question: `Question ${row.original.question5}`,
              answer: `Answer 5. ${row.original.answer5}`,
            },
          ];

          return (
            <Box
              sx={{
                padding: 2,
                width: "100%",
                margin: "0px auto",
              }}
            >
              {questions.map((q, index) => (
                <Box key={index} sx={{ marginBottom: 2 }}>
                  <MuiTypography
                    variant="body1"
                    component="span"
                    sx={{ fontWeight: "bold" }}
                  >
                    {q.question}
                  </MuiTypography>
                  <br />
                  <MuiTypography variant="body1" component="p">
                    {q.answer}
                  </MuiTypography>
                </Box>
              ))}
            </Box>
          );
        }}
      />
    </>
  );
};
