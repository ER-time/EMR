"use client";

import { Avatar, Grid, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";

import { Box, Typography } from "@/components";
import MuiTypography from "@/components/core/Typography";
import InputField from "@/components/core/Input";
import Table from "@/components/core/Table";
import Pagination from "@/components/core/Pagination";
import DatePicker from "@/components/core/DatePicker";
import { useEffect, useState } from "react";
import { useAddOrUpdateDonationMutation } from "@/redux/slices/donations";
import { convertDateToISOFormat, extractDateTimeComponents } from "@/lib/utils";
import moment from "moment";
import styled from "styled-components";

const StyledPagination = styled.div`
  @media (max-width: 669px) {
    width: 100%;
    display: flex;
    justify-content: end;
  }
`;
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

export default function Donations() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [addOrUpdateDonation, { data, isLoading }] =
    useAddOrUpdateDonationMutation();

  useEffect(() => {
    const fetchData = async () => {
      await addOrUpdateDonation({
        pageNo: currentPage,
        pageSize: 10,
        invoiceDate:  startDate === "Invalid date" ? null : startDate
      });
    };
    fetchData();
  }, [currentPage,startDate]);

  const onDateSearchHandler = (date) => {
    if (date) {
      setStartDate(convertDateToISOFormat(date));
      const payload = {
        pageNo: currentPage,
        pageSize: 10,
        invoiceDate: convertDateToISOFormat(date),
      };
      addOrUpdateDonation(payload);
    }
  };

  const onSearchHandler = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value.length > 3 || e.target.value.length === 0) {
      const payload = {
        pageNo: currentPage,
        pageSize: 10,
        search: e.target.value,
      };

      addOrUpdateDonation(payload);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
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
                Donations
              </MuiTypography>
              <Box
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
                  value={startDate}
                  onChange={onDateSearchHandler}
                />
                <InputField
                  id="email"
                  placeholder="Search"
                  {...INPUT_FIELD_PROPS_SEARCH}
                  sx={INPUT_FIELD_STYLES_SEARCH.sx}
                  value={searchValue}
                  onChange={onSearchHandler}
                  variant="standard"
                  startAdornment={
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  }
                />
              </Box>
            </Box>

            <TabelComponent data={data} />
            <Box
              display="flex"
              flexWrap="wrap"
              alignItems="center"
              justifyContent="space-between"
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
                {currentPage} to {data?.data?.length}{" "}
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

const TabelComponent = ({ data }) => {
  return (
    <>
      <Table
        columns={columns}
        data={data?.data || []}
        enableRowSelection={false}
        enableRowActions={false}
      />
    </>
  );
};

const columns = [
  {
    header: "Patients",
    accessorKey: "patients",
    Cell: ({ cell }) => (
      <Box display="flex" alignItems="center">
        {/* <Avatar sx={{ bgcolor: "rgb(224, 40, 40)", width: 40, height: 40 }}>
          OP
        </Avatar> */}
        <MuiTypography variant="body2" component="span" sx={{ mx: "10px" }}>
          {cell.row.original.patient}
        </MuiTypography>
      </Box>
    ),
  },
  {
    header: "Doctors",
    accessorKey: "doctor",
  },
  {
    header: "Invoice Date",
    accessorKey: "invoiceDate",
    accessorFn: (row) => {
      const { date } = extractDateTimeComponents(row?.invoiceDate);
      return <div>{moment(date).format("MM/DD/YY")}</div>;
    },
  },
  {
    header: "Total Invoice",
    accessorKey: "invoiceAmount",
  },
  {
    header: "Donation Amount",
    accessorKey: "donationAmount",
  },
];
