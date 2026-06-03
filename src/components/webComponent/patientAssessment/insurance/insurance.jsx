import { FiFileText } from "react-icons/fi";
import { Box } from "@/components";
import MuiTypography from "@/components/core/Typography";
import { MdKeyboardArrowRight } from "react-icons/md";

export default function Insurance() {
  return (
    <>
      <Box sx={{ padding: "15px" }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            background: "#E7F1FE",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          <Box display="flex" alignItems="center">
            <FiFileText
              size={28}
              color="#fff"
              style={{
                background: "#348af4",
                padding: "10px",
                borderRadius: "5px",
              }}
            />
            <MuiTypography variant="p" marginLeft="10px" color="#000000">
              INN - 434341255
            </MuiTypography>
          </Box>
          <MdKeyboardArrowRight size={28} />
        </Box>
      </Box>
    </>
  );
}
