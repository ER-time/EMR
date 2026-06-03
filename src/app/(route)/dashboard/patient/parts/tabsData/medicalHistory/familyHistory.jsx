import { Loader1 } from "@/components/core/Loader/Loader";
import { useGetAllFamilyHistoryQuery } from "@/redux/slices/userProfile";
import MaterialReactTable from "material-react-table";
import styled from "styled-components";

const StyledMaterialReactTable = styled(MaterialReactTable)``;

export default function FamilyHistory() {
  const GetAllMedicalHistory = useGetAllFamilyHistoryQuery();

  if (GetAllMedicalHistory?.isLoading) {
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
      data={GetAllMedicalHistory?.data?.data || []}
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
    header: "Family Member",
    accessorKey: "familyMemberType",
    accessorFn: (row) => {
      return <div>{row?.familyMemberType || "N/A"}</div>;
    },
  },
  {
    header: "Age",
    accessorKey: "age",
    accessorFn: (row) => {
      return <div>{row?.age || "N/A"}</div>;
    },
  },
  {
    header: "Diseases",
    accessorKey: "diseases",
    accessorFn: (row) => {
      return <div>{row?.diseases || "N/A"}</div>;
    },
  },
];

