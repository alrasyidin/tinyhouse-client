import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery } from "react-apollo";
import { USER } from "../../lib/graphql/queries";
import {
  User as UserData,
  UserVariables,
} from "../../lib/graphql/queries/User/__generated__/User";
import { Col, Layout, Row } from "antd";
import { UserBookings, UserListings, UserProfile } from "./components";
import { Viewer } from "../../lib/types";
import { PageSkeleton } from "../../lib/components";
import { ErrorBanner } from "../../lib/components";
import { useScrollToTop } from "../../lib/hooks";

const { Content } = Layout;

interface MatchParams {
  id: string;
}

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const PAGE_LIMIT = 4;

export const User = ({
  match,
  viewer,
  setViewer,
}: Props & RouteComponentProps<MatchParams>) => {
  const [listingsPage, setListingsPage] = useState(1);
  const [bookingsPage, setBookingsPage] = useState(1);

  useScrollToTop();

  const { data, loading, error, refetch } = useQuery<UserData, UserVariables>(
    USER,
    {
      variables: {
        id: match.params.id,
        listingsPage,
        bookingsPage,
        limit: PAGE_LIMIT,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const handleUserRefetch = async () => {
    await refetch();
  };

  const user = data ? data.user : null;

  const userListings = user ? user.listings : null;
  const userBookings = user ? user.bookings : null;
  if (listingsPage >= 2) {
    console.log(data);
  }

  const userProfileComponent = user ? (
    <UserProfile
      user={user}
      viewerIsUser={viewer.id === match.params.id}
      viewer={viewer}
      setViewer={setViewer}
      handleUserRefetch={handleUserRefetch}
    />
  ) : null;

  const userListingsComponent = userListings ? (
    <UserListings
      userListings={userListings}
      listingsPage={listingsPage}
      setListingsPage={setListingsPage}
      limit={PAGE_LIMIT}
    />
  ) : null;

  const userBookingsComponent = userBookings ? (
    <UserBookings
      userBookings={userBookings}
      bookingsPage={bookingsPage}
      setBookingsPage={setBookingsPage}
      limit={PAGE_LIMIT}
    />
  ) : null;

  const stripeError = new URLSearchParams(window.location.search).get(
    "stripe_error"
  );
  const stripeErrorElement = stripeError ? (
    <Content className="user">
      <ErrorBanner message="This user's may be not exists or we've encounter an error. Please try again later" />
    </Content>
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
      {stripeErrorElement}
      <Row gutter={12} justify="space-between">
        <Col xs={24}>{userProfileComponent}</Col>
        <Col xs={24}>
          {userListingsComponent}
          {userBookingsComponent}
        </Col>
      </Row>
    </Content>
  );
};
