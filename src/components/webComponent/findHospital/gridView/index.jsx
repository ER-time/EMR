"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { Paper } from "@mui/material";

import FilterList from "./filter";
import FilteredResultDoctor from "./filterResultHospitals";
import { Loader1 } from "@/components/core/Loader/Loader";
import { Box } from "@/components";
import useScreenWidth from "@/hooks/useScreenWidth";

const PAPER_PROPS = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "0px 4px 15px 0px #00000029",
  display: "flex",
  height: "100vh",
  height: `calc(100vh - 116px)`,
};

export default function FindHospitalGridView({
  location,
  layoutType,
  changeLayoutTypeHandler,
}) {
  const screenWidth = useScreenWidth();

  const [showMessanger, setShowMessanger] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hospitalsList, setHospitalsList] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    if (location) {
      axios
        .post(
          "https://medical-aibe.xeventechnologies.com/get_nearby_hospitals",
          {
            lattitude: location?.lattitude, 
            longitude: location?.longitude,
          }
        )
        .then((response) => {
          let hospitalsList = response?.data?.data?.[0]?.Response
          ? response.data.data[0].Response.map((hospital) => ({
              ...hospital,
            }))
          : [];
          setHospitalsList(hospitalsList);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          console.log("error>>>>>>", error);
        });
    } else {
      setIsLoading(false);
    }
  }, [location]);
  

  return (
    <Paper sx={{ ...PAPER_PROPS }}>
      <FilterList
        showMessanger={showMessanger}
        setShowMessanger={setShowMessanger}
        setHospitalsList={setHospitalsList}
        setIsLoading={setIsLoading}
      />
      {isLoading ? (
        <Box p="30px">
          <Loader1 />
        </Box>
      ) : showMessanger && !screenWidth < 992 ? (
        <FilteredResultDoctor
          currentLocation={location}
          hospitalsList={hospitalsList}
          layoutType={layoutType}
          changeLayoutTypeHandler={changeLayoutTypeHandler}
          showMessanger={showMessanger}
          setShowMessanger={setShowMessanger}
        />
      ) : null}
    </Paper>
  );
}
