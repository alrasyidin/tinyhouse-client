import React, { useState } from "react";
import { Moment } from "moment";
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
  ListingBookings,
  ListingDetails,
  ListingCreateBookings,
  ListingCreateBookingModal,
} from "./components";
import { Viewer } from "../../lib/types";

interface MatchParams {
  id: string;
}

interface Props {
  viewer: Viewer;
}

const PAGE_LIMIT = 4;

const { Content } = Layout;

export const Listing = ({
  viewer,
  match,
}: Props & RouteComponentProps<MatchParams>) => {
  const [bookingsPage, setBookingsPage] = useState(1);
  const [checkInDate, setCheckInDate] = useState<Moment | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Moment | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { data, error, loading, refetch } = useQuery<
    ListingData,
    ListingVariables
  >(LISTING, {
    variables: {
      id: match.params.id,
      bookingsPage,
      limit: PAGE_LIMIT,
    },
  });

  const clearBookingData = () => {
    setModalVisible(false);
    setCheckOutDate(null);
    setCheckInDate(null);
  };

  const handleRefetch = async () => {
    await refetch();
  };

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
    <ListingBookings
      listingBookings={listingBookings}
      bookingsPage={bookingsPage}
      setBookingsPage={setBookingsPage}
      limit={PAGE_LIMIT}
    />
  ) : null;

  const listingCreateBookingElement = listing ? (
    <ListingCreateBookings
      viewer={viewer}
      host={listing.host}
      bookingsIndex={listing.bookingsIndex}
      price={listing.price}
      checkInDate={checkInDate}
      checkOutDate={checkOutDate}
      setCheckInDate={setCheckInDate}
      setCheckOutDate={setCheckOutDate}
      setModalVisible={setModalVisible}
    />
  ) : null;

  const listingCreateBookingModalElement =
    listing && checkInDate && checkOutDate ? (
      <ListingCreateBookingModal
        id={listing.id}
        price={listing.price}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        clearBookingData={clearBookingData}
        handleRefetch={handleRefetch}
      />
    ) : null;

  return (
    <Content className="listing">
      <Row gutter={24} justify="space-between">
        <Col xs={24} lg={14}>
          {listingDetailsElement}
          {listingBookingsElement}
        </Col>
        <Col xs={24} lg={10}>
          {listingCreateBookingElement}
        </Col>
      </Row>
      {listingCreateBookingModalElement}
    </Content>
  );
};
