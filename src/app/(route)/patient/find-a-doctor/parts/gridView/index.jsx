"use client";

import { Box, Paper } from "@mui/material";
import { useEffect, useState } from "react";

import FilterList from "./filter";
import FilteredResultDoctor from "./filterResultDoctors";
import { useGetAllDoctorMutation } from "@/redux/slices/doctors";
import { BeatLoader } from "react-spinners";
import { Loader1, LoaderCenter } from "@/components/core/Loader/Loader";
import useScreenWidth from "@/hooks/useScreenWidth";

export default function FindDoctorGridView({
  layoutType,
  changeLayoutTypeHandler,
  getCannotAffordData,
  getCannotAffordDataLoading,
}) {
  const screenWidth = useScreenWidth();

  const [showMessanger, setShowMessanger] = useState(true);
  const [searchDoctor, setSearchDoctor] = useState(null);
  const [languageId, setLanguageId] = useState(null);
  const [genderID, setGenderID] = useState(null);
  const [selectedSpecialtiesId, setSelectedSpecialtiesID] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [reset, setReset] = useState(null);
  const [
    getAllDoctor,
    { isLoading, isError, error, isSuccess, data: getDoctorsList },
  ] = useGetAllDoctorMutation();
  useEffect(() => {
    try {
      let finalPayload = {
        pageNo: pageNo,
        pageSize: 80,
      };
      const resp = getAllDoctor(finalPayload).unwrap();
    } catch (err) {
      console.log("err", err);
    }
  }, [reset]);
  const applyFiltersHandler = async () => {
    try {
      const payload = {
        pageNo: pageNo,
        pageSize: 80,
        search: searchDoctor,
        specializationId: selectedSpecialtiesId,
        genderId: genderID,
        languageId: languageId,
      };
      await getAllDoctor(payload).unwrap();
    } catch (error) {
      console.log(error.message || "An error occurred while fetching data");
    }
  };

  const PAPER_PROPS = {
    display: "flex",
    width:"100%",
    // alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0px 4px 15px 0px #00000029",
    display: "flex",
    height: "100vh",
    height: `calc(100vh - 116px)`,
  };
  if (isLoading) {
    <>
      <Loader1 />
    </>;
  }
  return (
    <Paper sx={{ ...PAPER_PROPS }}>
      <FilterList
        isLoading={isLoading}
        setSearchDoctor={setSearchDoctor}
        setLanguageId={setLanguageId}
        languageId={languageId}
        searchDoctor={searchDoctor}
        selectedSpecialtiesId={selectedSpecialtiesId}
        setSelectedSpecialtiesID={setSelectedSpecialtiesID}
        showMessanger={showMessanger}
        setShowMessanger={setShowMessanger}
        applyFiltersHandler={applyFiltersHandler}
        setReset={setReset}
        reset={reset}
      />
      {showMessanger && !screenWidth < 992 && (
        <FilteredResultDoctor
          getDoctorsList={getDoctorsList}
          layoutType={layoutType}
          changeLayoutTypeHandler={changeLayoutTypeHandler}
          showMessanger={showMessanger}
          setShowMessanger={setShowMessanger}
          getCannotAffordData={getCannotAffordData}
          getCannotAffordDataLoading={getCannotAffordDataLoading}
        />
      )}
    </Paper>
  );
}
