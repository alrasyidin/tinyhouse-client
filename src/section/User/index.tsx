import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery } from "react-apollo";
import { USER } from "../../lib/graphql/queries";
import {
  User as UserData,
  UserVariables,
} from "../../lib/graphql/queries/User/__generated__/User";
import { Col, Layout, Row } from "antd";
import { UserProfile } from "./components";
import { Viewer } from "../../lib/types";
import { PageSkeleton } from "../../lib/components/PageSkeleton";
import { ErrorBanner } from "../../lib/components";

const { Content } = Layout;

interface MatchParams {
  id: string;
}

interface Props {
  viewer: Viewer;
}

export const User = ({
  match,
  viewer,
}: Props & RouteComponentProps<MatchParams>) => {
  const { data, loading, error } = useQuery<UserData, UserVariables>(USER, {
    variables: {
      id: match.params.id,
    },
  });

  const user: UserData["user"] | null = data ? data.user : null;
  const userProfileComponent = user ? (
    <UserProfile user={user} viewerIsUser={viewer.id === match.params.id} />
  ) : null;

  if (loading) {
    return (
      <Content className="user">
        <PageSkeleton />
      </Content>
    );
  }
  if (error) {
    return (
      <Content className="user">
        <ErrorBanner message="This user's may be not exists or we've encounter an error. Please try again later" />
        <PageSkeleton />
      </Content>
    );
  }

  return (
    <Content className="user">
      <Row gutter={12} type="flex" justify="space-between">
        <Col xs={24}>{userProfileComponent}</Col>
      </Row>
    </Content>
  );
};
