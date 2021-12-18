import { Empty, Layout, Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { useScrollToTop } from "../../lib/hooks";

const { Content } = Layout;
const { Text } = Typography;

export const NotFound = () => {
  useScrollToTop();
  return (
    <Content className="not-found">
      <Empty
        description={
          <>
            <Text className="not-found__description-title">
              Uh oh! something went wrong
            </Text>
            <Text className="not-found__description-subtitle">
              The page you're looking can't be found
            </Text>
          </>
        }
      />
      <Link to="/">Go to Home</Link>
    </Content>
  );
};
