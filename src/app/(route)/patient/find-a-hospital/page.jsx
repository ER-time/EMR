"use client";
import { useEffect, useState } from "react";
import { Loader1 } from "@/components/core/Loader/Loader";
import { Box } from "@/components";
import FindHospitalGridView from "@/components/webComponent/findHospital/gridView";
import FindHospitalListView from "@/components/webComponent/findHospital/listView";

export default function FindAHospital() {
  const [userLocation, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showType, setShowType] = useState("GRID");
  const changeLayoutTypeHandler = (arg) => {
    setShowType(arg);
  };

  useEffect(() => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lattitude: position?.coords?.latitude,
            longitude: position?.coords?.longitude,
          });

          setIsLoading(false);
        },
        (error) => {
          console.log("error", error);
          setLocation(null);
          setLocationError("Location is Disabled");
        }
      );
    } else {
      setIsLoading(false);
      setLocationError("Geolocation is not supported by this browser ");
    }
  }, []);

  if (isLoading) {
    <Box bgcolor="#fff" p="30px">
      <Loader1 />
    </Box>;
  }
  if (locationError) {
    return <div>{locationError}</div>;
  }

  if (userLocation !== null) {
    return (
      <>
        {showType === "GRID" ? (
          <FindHospitalGridView
            location={userLocation}
            layoutType={showType}
            changeLayoutTypeHandler={changeLayoutTypeHandler}
          />
        ) : (
          <FindHospitalListView
            location={userLocation}
            layoutType={showType}
            changeLayoutTypeHandler={changeLayoutTypeHandler}
          />
        )}
      </>
    );
  }
}
