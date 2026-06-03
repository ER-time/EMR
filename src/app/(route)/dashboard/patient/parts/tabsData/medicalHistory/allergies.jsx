import { Loader1 } from "@/components/core/Loader/Loader";
import { useGetAllAllergiesHistoryQuery } from "@/redux/slices/userProfile";
import MaterialReactTable from "material-react-table";
import styled from "styled-components";

const StyledMaterialReactTable = styled(MaterialReactTable)``;

export default function Allergies() {
  const { isLoading, data: allergiesData } = useGetAllAllergiesHistoryQuery();
  if (isLoading) {
    return (
      <div>
        <Loader1 />
      </div>
    );
  }
  return (
    <StyledMaterialReactTable
      enableRowSelection={false}
      enableTopToolbar={false}
      enableColumnFilters={false}
      enableColumnActions={false}
      enablePagination={false}
      columns={columns}
      data={allergiesData?.data || data}
      muiTablePaperProps={{
        sx: { boxShadow: "none", my: "10px" },
      }}
      muiTableProps={{
        sx: {
          boxShadow: "none",
        },
      }}
      muiTableHeadCellProps={{
        sx: {
          backgroundColor: "none",
          color: "#348AF4",
        },
      }}
      muiTableBodyCellProps={{
        sx: {
          borderBottomColor: "#F2F2F2",
        },
      }}
    />
  );
}

const columns = [
  {
    header: "Allergy From",
    accessorKey: "allergyFromType",
    accessorFn: (row) => {
      return <div>{row?.allergyFromType || "N/A"}</div>;
    },
  },
  {
    header: "Reaction",
    accessorKey: "reaction",
  },
  {
    header: "Medication/Treatments",
    accessorKey: "medicationTreatment",
  },
];

const data = [...Array(5)].map(() => ({
  allergyFrom: "Dust allergy",
  reaction: "Sneezing, coughing, teary eyes",
  medication: "Wear a mask while cleaning.",
}));
