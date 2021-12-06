import React from "react";
import { Pagination } from "antd";

interface Props {
  page: number;
  limit: number;
  total: number;
  setPage: (page: number) => void;
}
export const ListingsPagination = ({ page, limit, total, setPage }: Props) => {
  return (
    <div className="listings-pagination">
      <Pagination
        current={page}
        total={total}
        defaultPageSize={limit}
        showLessItems
        hideOnSinglePage
        onChange={(page) => setPage(page)}
      />
    </div>
  );
};
