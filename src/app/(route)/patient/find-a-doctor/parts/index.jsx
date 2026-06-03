import { useEffect, useState } from "react";
import FindDoctorGridView from "./gridView";
import FindDoctorListView from "./listView";
import { useGetCannotAffordMutation } from "@/redux/slices/iCantAfford";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { onFailure, onSuccess } from "@/redux/features/apiStatusSlice";

export default function FindDoctor() {
  const [showType, setShowType] = useState("GRID");
  const session = useSession();
  const dispatch = useDispatch();
  const changeLayoutTypeHandler = (arg) => {
    setShowType(arg);
  };
  const [getCannotAfford, { data, isLoading }] = useGetCannotAffordMutation();
  useEffect(() => {
    async function fetchCannotAfford() {
      try {
        const payload = { patientId: session?.data?.user?.user?.userId };
        const response = await getCannotAfford(payload);
        if (response?.data?.succeeded === true) {
          console.log("Record fetch successfully");
        } else {
          console.log("Record fetch successfully");
        }
      } catch (error) {
        console.log("Error Occur while fetching records");
      }
    }
    if (session) fetchCannotAfford();
  }, [session]);
  return (
    <>
      {showType === "GRID" ? (
        <FindDoctorGridView
          layoutType={showType}
          changeLayoutTypeHandler={changeLayoutTypeHandler}
          getCannotAffordData={data}
          getCannotAffordDataLoading={isLoading}
        />
      ) : (
        <FindDoctorListView
          layoutType={showType}
          changeLayoutTypeHandler={changeLayoutTypeHandler}
          getCannotAffordData={data}
          getCannotAffordDataLoading={isLoading}
        />
      )}
    </>
  );
}
