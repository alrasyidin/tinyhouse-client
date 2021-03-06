import React from "react";
import { Card, List, Skeleton, Typography } from "antd";

interface Props {
  title: string;
}

const { Title } = Typography;

export const HomeListingsSkeleton = ({ title }: Props) => {
  const emptyData = [{}, {}, {}, {}];

  return (
    <div className="home-listings-skeleton">
      {/* <Skeleton paragraph={{ rows: 0 }} /> */}
      <Title level={4} className="home-listings__title">
        {title}
      </Title>

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
