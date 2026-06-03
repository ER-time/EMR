import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

import MuiTypography from "@/components/core/Typography";
import { Box, Button } from "@/components";
import AddConsultationModal from "./addConsultationModal";

export default function Consultation() {
  const [open, setOpen] = useState(false);

  const ConsultingData = [
    {
      id: 1,
      title: "Subjective",
      description:
        "Stacey reports that she is 'feeling good' and enjoying her time away. Stacey reports she has been compliant with her medication and using her meditation app whenever she feels heranxiety.",
    },
    {
      id: 2,
      title: "Objective",
      description:
        "Stacey was unable to attend her session as she is on a family holiday this week. She was able to touch base with me over the phone and was willing and able to make the phone call at the set time. Stacey appeared to be calm and positive over the phone.",
    },
    {
      id: 3,
      title: "Assessment",
      description:
        "Stacey presented this afternoon with a relaxed mood. Her speech was normal in rate, tone, and volume. Stacey was able to articulate her thoughts and feelings coherently. Stacey did not present with any signs of hallucinations or delusions. Insight and judgment are good. No sign of substance use was present.",
    },
    {
      id: 4,
      title: "Plan",
      description:
        "Plan to meet again in person at 2 pm next Tuesday, 25th May. Stacey will continue on her current medication and has given her family copies of her safety plan should she need it.",
    },
  ];

  return (
    <>
      {!ConsultingData ? (
        ConsultingData?.map((item, index) => (
          <div key={index}>
            <MuiTypography
              variant="h6"
              component="h6"
              fontWeight="600"
              fontSize="16px"
              color="#348AF4"
            >
              {item?.title}
            </MuiTypography>
            <MuiTypography
              variant="h6"
              component="p"
              fontWeight="400"
              fontSize="14px"
              color="#666666"
            >
              {item?.description}
            </MuiTypography>
          </div>
        ))
      ) : (
        <Box display="flex" justifyContent="center">
          <Button
            variant="outlined"
            height="45px"
            radius="12px"
            sx={{ margin: "15px auto" }}
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Add Consultation
          </Button>
        </Box>
      )}
      {open && (
        <AddConsultationModal open={open} handleClose={() => setOpen(false)} />
      )}
    </>
  );
}
