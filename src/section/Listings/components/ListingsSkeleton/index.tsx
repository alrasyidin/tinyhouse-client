import { Card, List, Skeleton } from "antd";
import React from "react";

export const ListingsSkeleton = () => {
  const emptyData = [{}, {}, {}, {}, {}, {}, {}, {}];

  return (
    <div className="listings-skeleton">
      <Skeleton paragraph={{ rows: 1 }} />

      <List
        grid={{ gutter: 10, xs: 1, sm: 2, md: 2, lg: 4, xl: 4 }}
        dataSource={emptyData}
        renderItem={() => (
          <List.Item>
            <Card
              className="listings-skeleton__card"
              cover={
                <div
                  style={{
                    backgroundColor: "#f0f2f3",
                  }}
                  className="listings-skeleton__card-cover-img"
                ></div>
              }
              loading
            />
          </List.Item>
        )}
      ></List>
    </div>
  );
};
