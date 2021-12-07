import React, { useEffect, useRef } from "react";
import { Layout, Spin } from "antd";
import { useMutation } from "react-apollo";
import { CONNECT_STRIPE } from "../../lib/graphql/mutations/ConnectStripe";
import {
  ConnectStripe as ConnectStripeData,
  ConnectStripeVariables,
} from "../../lib/graphql/mutations/ConnectStripe/__generated__/ConnectStripe";
import { Viewer } from "../../lib/types";
import { Redirect, useHistory } from "react-router-dom";
import { displaySuccessNotification } from "../../lib/utils";

const { Content } = Layout;

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const Stripe = ({ viewer, setViewer }: Props) => {
  const history = useHistory();

  const [connectStripe, { error, data, loading }] = useMutation<
    ConnectStripeData,
    ConnectStripeVariables
  >(CONNECT_STRIPE, {
    onCompleted: (data) => {
      if (data && data.connectStripe) {
        setViewer({ ...viewer, hasWallet: data.connectStripe.hasWallet });
        displaySuccessNotification(
          "You've connected successfully to your Stripe account!",
          "You can now begin to create listings in Host page"
        );
      }
    },
  });
  const connectStripeRef = useRef(connectStripe);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      connectStripeRef.current({
        variables: {
          input: { code },
        },
      });
    } else {
      history.replace("/login");
    }
  }, [history]);

  if (data && data.connectStripe) {
    return <Redirect to={`/user/${viewer.id}`} />;
  }

  if (loading) {
    return (
      <Content className="stripe">
        <Spin size="large" tip="Connectiong your stripe account..."></Spin>
      </Content>
    );
  }

  if (error) {
    return <Redirect to={`/user/${viewer.id}?stripe_error=true`} />;
  }

  return null;
};
