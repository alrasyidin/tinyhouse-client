import React, { useEffect, useRef } from "react";
import { Redirect, useLocation } from "react-router-dom";
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
import { useScrollToTop } from "../../lib/hooks";

const { Content } = Layout;
const { Text, Title } = Typography;

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const Login = ({ viewer, setViewer }: Props) => {
  const [handleAuthorize, { error: codeError }] = useLazyQuery<AuthUrlData>(
    AUTH_URL,
    {
      onCompleted: (data) => {
        if (data && data.authUrl) {
          // window.location.href = data.authUrl;
          window.location.assign(data.authUrl);
        }
      },
      onError: (error) => {
        console.log(error.message);
        displayErrorMessage(
          "Sorry. We weren't to unable log you in. Please try again later"
        );
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
  const location = useLocation();
  useScrollToTop();

  useEffect(() => {
    const code = new URLSearchParams(location.search).get("code");
    // console.log("CODE", code);
    // console.log(window.location);

    if (code) {
      logInRef.current({
        variables: {
          input: { code },
        },
      });
    }
  }, [location.search]);

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

  if (viewer.id) {
    return <Redirect to={`/user/${viewer.id}`} />;
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
