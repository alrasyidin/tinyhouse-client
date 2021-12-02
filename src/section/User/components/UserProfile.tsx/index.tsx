import React from "react";
import { Typography, Divider, Avatar, Card, Button } from "antd";
import { User as UserData } from "../../../../lib/graphql/queries/User/__generated__/User";

const { Text, Title, Paragraph } = Typography;

interface Props {
  user: UserData["user"];
  viewerIsUser: boolean;
}

export const UserProfile = ({ user, viewerIsUser }: Props) => {
  const additionalDetailsSection = viewerIsUser ? (
    <>
      <Divider></Divider>

      <div className="user-profile__details">
        <Title level={4}>Additional Details</Title>
        <Paragraph>
          Interested to be TinyHouse host? Register with your stripe account.
        </Paragraph>
        <Button type="primary" className="user-profile__details-cta">
          Connect Stripe Account
        </Button>
        <Paragraph>
          TinyHoue use <a href="https://stripe.com/en-US/connect">stripe</a> to
          help transfers your earnings with secure and trusted manneer
        </Paragraph>
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
