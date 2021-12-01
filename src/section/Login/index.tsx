import React, { useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
import { Layout, Typography, Card, Spin } from "antd";
import { Viewer } from "../../lib/types";
import { useLazyQuery, useMutation } from "react-apollo";
import { ErrorBanner } from "../../lib/components";

import GoogleLogo from "./assets/google_logo.jpg";

import { AuthUrl as AuthUrlData } from "../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl";

import {
  LogIn as LogInData,
  LogInVariables,
} from "../../lib/graphql/mutations/LogIn/__generated__/LogIn";
import {
  displayErrorMessage,
  displaySuccessNotification,
} from "../../lib/utils";
import { LOG_IN } from "../../lib/graphql/mutations";
import { AUTH_URL } from "../../lib/graphql/queries";

const { Content } = Layout;
const { Text, Title } = Typography;

interface Props {
  setViewer: (viewer: Viewer) => void;
}

export const Login = ({ setViewer }: Props) => {
  const [handleAuthorize, { error: codeError }] = useLazyQuery<AuthUrlData>(
    AUTH_URL,
    {
      variables: {},
      onCompleted: (data) => {
        if (data && data.authUrl) {
          window.location.href = data.authUrl;
        }
      },
    }
  );

  const [logIn, { data: LogInData, loading: LogInLoading, error: LogInError }] =
    useMutation<LogInData, LogInVariables>(LOG_IN, {
      onCompleted: (data) => {
        if (data && data.logIn && data.logIn.token) {
          setViewer(data.logIn);
          sessionStorage.setItem("token", data.logIn.token);
          displaySuccessNotification("You`ve succesfully login");
        }
      },
    });
  const logInRef = useRef(logIn);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (code) {
      console.log(code);
      logInRef.current({
        variables: {
          input: { code },
        },
      });
    }
  }, []);

  if (codeError) {
    displayErrorMessage(
      "Sorry we weren't able login you. Please comeback later"
    );
  }

  const LogInErroBannerComponent = LogInError ? (
    <ErrorBanner description="Sorry we weren't able login you. Please comeback later" />
  ) : null;

  if (LogInLoading) {
    return (
      <Content className="log-in">
        <Spin size="large" tip="Logging you in..."></Spin>
      </Content>
    );
  }

  if (LogInData && LogInData.logIn) {
    const { id: viewerId } = LogInData.logIn;
    return <Redirect to={`/user/${viewerId}`} />;
  }

  return (
    <Content className="log-in">
      {LogInErroBannerComponent}
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
        <button
          className="log-in-card__google-button"
          onClick={() => handleAuthorize()}
        >
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
