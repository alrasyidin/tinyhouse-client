import React from "react";
import { Select } from "antd";
import { ListingsFilter as ListingsFilterEnum } from "../../../../lib/graphql/globalTypes";

const { Option } = Select;
interface Props {
  filter: ListingsFilterEnum;
  setFilter: (filter: ListingsFilterEnum) => void;
}
export const ListingsFilter = ({ filter, setFilter }: Props) => {
  return (
    <div className="listings-filters">
      <span>Filter By: </span>
      <Select
        value={filter}
        onChange={(filter: ListingsFilterEnum) => setFilter(filter)}
      >
        <Option value={ListingsFilterEnum.PRICE_LOW_TO_HIGH}>
          Price: Low To High
        </Option>
        <Option value={ListingsFilterEnum.PRICE_HIGH_TO_LOW}>
          Price: High To Low
        </Option>
      </Select>
    </div>
  );
};
