import React from "react";
import { Typography, Divider, Avatar, Card, Button, Tag } from "antd";
import { User as UserData } from "../../../../lib/graphql/queries/User/__generated__/User";
import {
  displayErrorMessage,
  displaySuccessNotification,
  formatListingPrice,
} from "../../../../lib/utils";
import { useMutation } from "react-apollo";
import { DISCONNECT_STRIPE } from "../../../../lib/graphql/mutations/DisconnectStripe";
import { Viewer } from "../../../../lib/types";
import { DisconnectStripe as DisconnectStripeData } from "../../../../lib/graphql/mutations/DisconnectStripe/__generated__/DisconnectStripe";

const stripeAuthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_S_CLIENT_ID}&scope=read_write`;

const { Text, Title, Paragraph } = Typography;

interface Props {
  user: UserData["user"];
  viewerIsUser: boolean;
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
  handleUserRefetch: () => void;
}

export const UserProfile = ({
  user,
  viewerIsUser,
  viewer,
  setViewer,
  handleUserRefetch,
}: Props) => {
  const [disconnectStripe, { loading }] = useMutation<DisconnectStripeData>(
    DISCONNECT_STRIPE,
    {
      onCompleted: (data) => {
        if (data && data.disconnectStripe) {
          setViewer({ ...viewer, hasWallet: data.disconnectStripe.hasWallet });
          displaySuccessNotification(
            "You've successfully disconnected from stripe",
            "You will have reconnect to Stripe to continue to create listings"
          );

          handleUserRefetch();
        }
      },
      onError: () => {
        console.log("Gagal");

        displayErrorMessage(
          "Sorry! We weren't able disconnect you from stripe. Please try again later!"
        );
      },
    }
  );

  const handleRedirectStripe = () => {
    window.location.href = stripeAuthUrl;
  };

  const additionalDetails = user.hasWallet ? (
    <>
      <Paragraph>
        <Tag color="green">STRIPE REGISTERED</Tag>
      </Paragraph>
      <Paragraph>
        Income Earned:{" "}
        <Text strong>
          {user.income ? formatListingPrice(user.income) : "$0"}
        </Text>
      </Paragraph>
      <Button
        type="primary"
        className="user-profile__details-cta"
        loading={loading}
        onClick={() => disconnectStripe()}
      >
        Disconnect Stripe Account
      </Button>
      <Paragraph type="secondary">
        By disconnecting you won't be able receive{" "}
        <Text strong>any further payment.</Text> This will prevent user from
        booking listings that you might have created before
      </Paragraph>
    </>
  ) : (
    <>
      <Paragraph>
        Interested to be TinyHouse host? Register with your stripe account.
      </Paragraph>
      <Button
        type="primary"
        className="user-profile__details-cta"
        onClick={handleRedirectStripe}
      >
        Connect Stripe Account
      </Button>
      <Paragraph>
        TinyHoue use <a href="https://stripe.com/en-US/connect">stripe</a> to
        help transfers your earnings with secure and trusted manneer
      </Paragraph>
    </>
  );

  const additionalDetailsSection = viewerIsUser ? (
    <>
      <Divider></Divider>

      <div className="user-profile__details">
        <Title level={4}>Additional Details</Title>
        {additionalDetails}
      </div>
    </>
  ) : null;

  return (
    <div className="user-profile">
      <Card className="user-profile__card">
        <div className="user-profile__avatar">
          <Avatar size={100} src={user.avatar}></Avatar>
        </div>
        <Divider></Divider>

        <div className="user-profile__details">
          <Title level={4}>Details</Title>
          <Paragraph>
            Name: <Text strong>{user.name}</Text>
          </Paragraph>
          <Paragraph>
            Contact: <Text strong>{user.contact}</Text>
          </Paragraph>
        </div>
        {additionalDetailsSection}
      </Card>
    </div>
  );
};
