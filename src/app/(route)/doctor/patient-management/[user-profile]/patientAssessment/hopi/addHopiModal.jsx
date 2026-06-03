import { Box, Button, GenericModal } from "@/components";
import InputField from "@/components/core/Input";
import MuiTypography from "@/components/core/Typography";
import { Grid } from "@mui/material";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useState } from "react";

export default function AddHopiModal({ open, handleClose }) {
  const [userType, setUserType] = useState("template1");

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

  return (
    <GenericModal show={open} onHide={handleClose} tittle="Add HOPI">
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
          <Box width="100%">
            <MuiTypography
              {...INPUT_LABEL_PROPS}
              htmlFor="firstName"
              gutterBottom={true}
            >
              Subjective
            </MuiTypography>
            <InputField
              id="firstName"
              placeholder="First name"
              {...INPUT_FIELD_PROPS}
              sx={INPUT_FIELD_STYLES.sx}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Box width="100%">
            <MuiTypography
              {...INPUT_LABEL_PROPS}
              htmlFor="lastName"
              gutterBottom={true}
            >
              Objective
            </MuiTypography>
            <InputField
              id="lastName"
              placeholder="Last Name"
              {...INPUT_FIELD_PROPS}
              sx={INPUT_FIELD_STYLES.sx}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <CustomeRadioButton
            tittle="Template 1"
            name="template1"
            type={userType}
            active={true}
            onClick={() => setUserType("template1")}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <Box width="100%">
            <CustomeRadioButton
              tittle="Template 2"
              name="template2"
              type={userType}
              onClick={() => setUserType("template2")}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Box width="100%">
            <MuiTypography
              {...INPUT_LABEL_PROPS}
              htmlFor="email"
              gutterBottom={true}
            >
              Assessment
            </MuiTypography>
            <InputField
              id="email"
              placeholder="Email"
              {...INPUT_FIELD_PROPS}
              sx={INPUT_FIELD_STYLES.sx}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={12} lg={12}>
          <Box width="100%">
            <MuiTypography
              {...INPUT_LABEL_PROPS}
              htmlFor="address"
              gutterBottom={true}
            >
              Plan
            </MuiTypography>
            <InputField
              id="address"
              type="textArea"
              placeholder=" Current Address"
              {...INPUT_FIELD_PROPS}
              sx={INPUT_FIELD_STYLES.sx}
            />
          </Box>
        </Grid>
        <Box display="flex" justifyContent="flex-end" my="15px">
          <Button
            variant="contain"
            bg="#E02828"
            color="#fff"
            height="45px"
            radius="12px"
            // onClick={handleOpen}
          >
            Save
          </Button>
        </Box>
      </Grid>
    </GenericModal>
  );
}

const CustomeRadioButton = ({ name, type, tittle, onClick }) => {
  return (
    <Box
      width="100%"
      border={`1px solid ${type === name ? "#E02828" : "#E2E5ED"}`}
      height="50px"
      borderRadius="4px"
      alignItems="center"
      display="flex"
      justifyContent="space-between"
      px={1}
      sx={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <Box alignItems="center" display="flex">
        <RadioButtonCheckedIcon
          sx={{ color: `${type === name ? "#E02828" : "#CCCCCC"}` }}
        />
        <MuiTypography
          variant="subtitle1"
          component="label"
          color={`${type !== name && "#CCCCCC"}`}
          sx={{ mx: 1 }}
        >
          {tittle}
        </MuiTypography>
      </Box>
      {type === name && <TaskAltIcon sx={{ color: "#E02828" }} />}
    </Box>
  );
};
