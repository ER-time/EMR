import { Avatar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

import { Box, Button } from "@/components";
import MuiTypography from "@/components/core/Typography";
import styled from "styled-components";

const StyledText = styled(Box)`
&& {
  width: auto;
}
`;
export default function InvoicePreview({ setDetailsOpen }) {
  return (
    <Box
      bgcolor="#fff"
      boxShadow="0px 0px 24px 0px rgba(0, 0, 0, 0.04)"
      width="100%"
      borderRadius="12px"
      p="20px"
    >
      <Box display="flex" alignItems="center">
        <Box display="flex" alignItems="center">
          <CloseIcon
            onClick={() => setDetailsOpen(false)}
            sx={{ cursor: "pointer" }}
          />
          <MuiTypography
            variant="h6"
            component="h6"
            color="#000"
            sx={{ mx: 1 }}
          >
            Invoice Preview
          </MuiTypography>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" flexWrap="wrap">
          <Avatar
            alt="Remy Sharp"
            src="/images/sign-in-bg.png"
            sx={{ width: 70, height: 70 }}
          />
          <StyledText mx={2}>
            <MuiTypography
              variant="body1"
              component="h6"
              color="#000"
              fontWeight="500"
            >
              Miranda Clements
            </MuiTypography>
            <MuiTypography variant="body2" component="p" color="#333">
              miranda.clements@example.com
            </MuiTypography>
          </StyledText>
        </Box>

      <Box px="10px" my="40px">
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
          <Box gridColumn="span 12">
            <MuiTypography variant="body2" component="h6" color="#999">
              Invoice Date
            </MuiTypography>

            <MuiTypography variant="body1" component="p" color="#333">
              Wednesday, August 20, 2023
            </MuiTypography>
          </Box>
          <Box gridColumn="span 6">
            <MuiTypography variant="body2" component="h6" color="#999">
              Status
            </MuiTypography>
            <div style={{ display: "flex", alignItems: "center" }}>
              <FiberManualRecordIcon
                sx={{ color: "#E02828", marginRight: "5px", fontSize: "12px" }}
              />

              <MuiTypography variant="body1" component="p" color="#333">
                Unpaid
              </MuiTypography>
            </div>
          </Box>
          <Box gridColumn="span 6">
            <MuiTypography variant="body2" component="h6" color="#999">
              Payment Method
            </MuiTypography>

            <MuiTypography variant="body1" component="p" color="#333">
              Cash
            </MuiTypography>
          </Box>
        </Box>
        <Box
          bgcolor="#FBFBFB"
          borderRadius="4px"
          maxWidth="450px"
          m="20px auto"
        >
          <Box display="flex" justifyContent="space-between" p={2}>
            <MuiTypography variant="subtitle1" component="h6" color="#999">
              Total Invoice
            </MuiTypography>

            <MuiTypography variant="h6" component="p" color="#333">
              $436.67
            </MuiTypography>
          </Box>

          <Box display="flex" justifyContent="space-between" p={2}>
            <MuiTypography variant="subtitle1" component="h6" color="#999">
              Due Amount
            </MuiTypography>

            <MuiTypography variant="h6" component="p" color="#333">
              $50.00
            </MuiTypography>
          </Box>
        </Box>
      </Box>

      <Box px="10px">
        <Box display="flex" alignItems="center" justifyContent="center" my={2}>
          <Button
            sx={{ mr: 1, fontSize: "18px" }}
            variant="contain"
            bg="#E02828"
            color="#FFFFFF"
            height="52px"
            radius="12px"
            width="160px"
          >
            Pay
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
