import { useState } from "react";
import FindHospitalGridView from "./gridView";
import FindHospitalListView from "./listView";

export default function FindDoctor({ location }) {
  const [showType, setShowType] = useState("GRID");
  const changeLayoutTypeHandler = (arg) => {
    setShowType(arg);
  };

  return (
    <>
      {showType === "GRID" ? (
        <FindHospitalGridView
          layoutType={showType}
          changeLayoutTypeHandler={changeLayoutTypeHandler}
        />
      ) : (
        <FindHospitalListView
          layoutType={showType}
          changeLayoutTypeHandler={changeLayoutTypeHandler}
        />
      )}
    </>
  );
}
