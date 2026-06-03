import { Grid } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

import MuiTypography from "@/components/core/Typography";
import { useGetAllPreExistingConditionQuery } from "@/redux/slices/userProfile";
import { Loader1 } from "@/components/core/Loader/Loader";

export default function PreExistingCondition() {
  const GetAllPreExistingCondition = useGetAllPreExistingConditionQuery();

  if (GetAllPreExistingCondition.isLoading) {
    return (
      <div>
        <Loader1 />
      </div>
    );
  }
  
  return (
    <Grid container spacing={3}>
      {GetAllPreExistingCondition?.data?.data?.map((conditionItem, index) => {
        return(
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
            {conditionItem.diseaseTpye || "N/A"}
            <span
              style={{ color: "#666" }}
            >{`(From - ${conditionItem.existingConditionDuration || "N/A"})`}</span>
          </MuiTypography>
        </Grid>
      )})}
    </Grid>
  );
}
