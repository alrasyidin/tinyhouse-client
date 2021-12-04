import React, { useState } from "react";

import { RouteComponentProps } from "react-router";
import { useQuery } from "react-apollo";

import { ErrorBanner } from "../../lib/components/ErrorBanner";
import { PageSkeleton } from "../../lib/components/PageSkeleton";

import { Col, Layout, Row } from "antd";

import { LISTING } from "../../lib/graphql/queries";
import {
  Listing as ListingData,
  ListingVariables,
} from "../../lib/graphql/queries/Listing/__generated__/Listing";
import {
  ListingBooking,
  ListingDetails,
  ListingCreateBookings,
} from "./components";

interface MatchParams {
  id: string;
}

const PAGE_LIMIT = 4;

const { Content } = Layout;

export const Listing = ({ match }: RouteComponentProps<MatchParams>) => {
  const [bookingsPage, setBookingsPage] = useState(1);
  const { data, error, loading } = useQuery<ListingData, ListingVariables>(
    LISTING,
    {
      variables: {
        id: match.params.id,
        bookingsPage,
        limit: PAGE_LIMIT,
      },
    }
  );
  if (loading) {
    return (
      <Content className="listing">
        <PageSkeleton />
      </Content>
    );
  }
  if (error) {
    return (
      <Content className="listing">
        <ErrorBanner message="This listing may not exits or we've encounter error. Please try again"></ErrorBanner>
        <PageSkeleton />
      </Content>
    );
  }

  const listing = data ? data.listing : null;
  const listingDetailsElement = listing ? (
    <ListingDetails listing={listing} />
  ) : null;

  const listingBookings = listing ? listing.bookings : null;
  const listingBookingsElement = listingBookings ? (
    <ListingBooking bookings={listingBookings} />
  ) : null;

  const listingCreateBookingElement = <ListingCreateBookings />;

  return (
    <Content className="listing">
      <Row type="flex" gutter={24} justify="space-between">
        <Col xs={24} lg={14}>
          {listingDetailsElement}
          {listingBookingsElement}
        </Col>
        <Col xs={24} lg={10}>
          {listingCreateBookingElement}
        </Col>
      </Row>
    </Content>
  );
};
