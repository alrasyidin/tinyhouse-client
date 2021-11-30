import React from "react";
import { Layout, Typography, Card } from "antd";
import GoogleLogo from "./assets/google_logo.jpg";

const { Content } = Layout;
const { Text, Title } = Typography;

export const Login = () => {
  return (
    <Content className="log-in">
      <Card className="log-in-card">
        <div className="log-in-card__intro">
          <Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="wave">
              👋
            </span>
          </Title>
          <Title level={3} className="log-in-card__intro-title">
            Login to TinyHouse!
          </Title>
          <Text>Sign In with Google to start</Text>
        </div>
        <button className="log-in-card__google-button">
          <img
            src={GoogleLogo}
            alt="Google Logo"
            className="log-in-card__google-button-logo"
          />
          <span className="log-in-card__google-button-text">
            Sign In WIth Google
          </span>
        </button>
        <Text type="secondary">
          Note: By signing in, you will be redirected to google consent form to
          sign in with your accoutn.
        </Text>
      </Card>
    </Content>
  );
};
