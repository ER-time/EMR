"use client";

import { Paper, Select, MenuItem } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import DatePicker from "@/components/core/DatePicker";
import AccordionData from "./parts/accordionData";
import InputField from "@/components/core/Input";
import { Box } from "@/components";
import styled from "styled-components";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useGetAllPrecriptionQuery, useGetAllSoapNotesQuery } from "@/redux/slices/userProfile";
import { useSession } from "next-auth/react";

const StyledTimePicker = styled(TimePicker)`
  height: 45px;
  && {
    margin: 0px 10px 0px 0px;
  }
  .MuiInputBase-root {
    width: 140px;
    height: 100%;
  }
  .MuiOutlinedInput-notchedOutline {
    border: 1px solid #e5e6e6 !important;
    border-radius: 6px;
  }
  input {
    font-size: 14px;
  }
  label {
    font-size: 14px;
    color: #a2a2a2;
    line-height: normal;
    /* -webkit-transform: translate(14px, 14px) scale(1); */
  }
`;

const PAPER_PROPS = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "0px 4px 15px 0px #00000029",
  display: "flex",
  // height: "100vh",
  // height: `calc(100vh - 116px)`,
};

const INPUT_FIELD_STYLES = {
  sx: {
    width: "140px",
    margin: "0px 0px",
    height: "46px",
    marginRight: "10px",
    marginBottom: "0px",
    "& fieldset": { border: "1px solid #E2E5ED" },
  },
};

const INPUT_FIELD_PROPS_SEARCH = {
  label: "",
  fullWidth: true,
  variant: "standard",
};

const INPUT_FIELD_STYLES_SEARCH = {
  sx: {
    margin: "10px 0px",
    width: "250px",
    height: "44px",
    paddingLeft: "10px",
    // marginLeft: "10px",
    marginRight: "10px",
    "& fieldset": { border: "1px solid #E2E5ED" },
  },
};

export default function Prescriptions() {
  const session = useSession();

  const getAllSoapNotes = useGetAllSoapNotesQuery({
    patientId: session?.data?.user?.user?.userId,
  });
  console.log("getAllSoapNotes:::",getAllSoapNotes);
  return (
    <Paper sx={{ ...PAPER_PROPS, padding: "22px 38px 22px 26px" }}>
      <div>
        <Box display="flex" flexWrap="wrap" alignItems="center" sx={{margin: '0px 10px'}} >
          <InputField
            id="search"
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
          <Select
            value={1}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            sx={INPUT_FIELD_STYLES.sx}
          >
            <MenuItem value={1}>Speciality</MenuItem>
            <MenuItem value={10}>Cardiology</MenuItem>
            <MenuItem value={20}>Physiologist</MenuItem>
            <MenuItem value={30}>Electrophysiology</MenuItem>
          </Select>
          <Box
            display="flex"
            boxSizing="border-box"
            width="auto"
          >
            <StyledTimePicker label="HH:MM:AA" />

            <DatePicker
              height="45px"
              width="160px"
              border="1px solid #e5e6e6"
              radius="6px"
              fsize="14px"
            />
          </Box>
        </Box>
        <div>
          <AccordionData data={getAllSoapNotes}/>
        </div>
      </div>
    </Paper>
  );
}
