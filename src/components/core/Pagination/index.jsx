import styled from "styled-components";
import { Pagination } from "@mui/material";
import { useState } from "react";

const StyledPagination = styled(Pagination)`
  && {
    .MuiPaginationItem-root {
      background: #f5f5f5;
      border: none;
      color: #000;
      height: 30px;
      border-radius: 5px;
    }
    .Mui-selected {
      background: #e02828;
      color: #fff;
    }
  }
`;

export default function PaginationComponent({
  count,
  variant,
  shape,
  onPageChange,
  ...props
}) {
  const [page, setPage] = useState(1);
  const handleChange = (event, value) => {
    setPage(value);
    onPageChange(value);
  };
  return (
    <StyledPagination
      count={count}
      page={page}
      onChange={handleChange}
      variant="outlined"
      shape="rounded"
      {...props}
    />
  );
}

PaginationComponent.propTypes = {};

PaginationComponent.defaultProps = {
  count: 0,
  variant: "outlined",
  shape: "rounded",
};
