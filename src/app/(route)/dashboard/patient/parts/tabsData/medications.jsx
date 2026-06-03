"use client";
import Table from "@/components/core/Table";
import { useGetAllMedicationQuery } from "@/redux/slices/userProfile";
import { useSession } from "next-auth/react";

const columns = [
  {
    header: "Medicine",
    accessorKey: "medicineName",
  },
  {
    header: "Dose",
    accessorKey: "dose",
  },
  {
    header: "Dose Frequency",
    accessorKey: "doseFrequency",
  },
  {
    header: "Reason",
    accessorKey: "reason",
     accessorFn: (row) => {
      return <div>{row?.reason || "N/A"}</div>;
    },
  },
];



export default function Medications() {
  const session = useSession()
  const userData=session?.data?.user?.user;
  const payload = {
    pageNo: 1,
    pageSize: 10,
    patientId: userData?.userId,
  };
  const getMedications = useGetAllMedicationQuery(payload);
  return (
    <div style={{ width: "100%" }}>
      <Table
        columns={columns}
        data={getMedications?.data?.data || []}
        enableRowSelection={false}
        enableRowActions={false}
      />
    </div>
  );
}
