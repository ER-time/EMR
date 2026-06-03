import dynamic from "next/dynamic";

const Patients = dynamic(() => import("./patients"));

export default function PatientManagment() {
  return <Patients />;
}
