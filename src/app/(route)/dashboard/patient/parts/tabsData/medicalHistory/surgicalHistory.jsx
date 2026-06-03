import { Loader1 } from "@/components/core/Loader/Loader";
import { useGetAllSurgicalHistoryQuery } from "@/redux/slices/userProfile";
import MaterialReactTable from "material-react-table";
import styled from "styled-components";

const StyledMaterialReactTable = styled(MaterialReactTable)``;

export default function SurgicalHistory() {
  const GetAllSurgicalHistory = useGetAllSurgicalHistoryQuery();
  if (GetAllSurgicalHistory.isLoading) {
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
      data={GetAllSurgicalHistory?.data?.data || []}
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
    header: "Surgery",
    accessorKey: "surgery",
  },
  {
    header: "Surgery Year",
    accessorKey: "year",
  },
  {
    header: "Surgery Reason",
    accessorKey: "reason",
  },
];
