import { Grid } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

import MuiTypography from "@/components/core/Typography";
import { useGetAllSocialHistoryQuery } from "@/redux/slices/userProfile";
import { Loader1 } from "@/components/core/Loader/Loader";

export default function SocialHistory() {
  const GetAllSocialHistory = useGetAllSocialHistoryQuery();

  if (GetAllSocialHistory.isLoading) {
    return <Loader1 />;
  }
  return (
    <Grid container spacing={3}>
      {GetAllSocialHistory?.data?.data?.map((conditionItem, index) => (
        <Grid item xs={12} lg={6} key={index}>
          <FiberManualRecordIcon
            sx={{ fontSize: "10px", color: "#348AF4", mr: 1 }}
          />
          <MuiTypography
            variant="subtitle1"
            color="#333"
            component="span"
            fontWeight="300"
          >
            {conditionItem.socialAddictionType}
            <span style={{ color: "#666" }}>{`(From - ${
              conditionItem.duration || "N/A"
            })`}</span>
          </MuiTypography>
        </Grid>
      ))}
    </Grid>
  );
}
