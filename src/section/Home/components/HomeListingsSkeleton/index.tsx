import { Card, List, Skeleton } from "antd";
import React from "react";

export const HomeListingsSkeleton = () => {
  const emptyData = [{}, {}, {}, {}];

  return (
    <div className="home-listings-skeleton">
      <Skeleton paragraph={{ rows: 0 }} />

      <List
        grid={{ gutter: 10, xs: 1, sm: 2, lg: 4 }}
        dataSource={emptyData}
        renderItem={() => (
          <List.Item>
            <Card
              cover={
                <div
                  style={{
                    backgroundColor: "#f0f2f3",
                  }}
                  className="home-listings-skeleton__card-cover-img"
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
