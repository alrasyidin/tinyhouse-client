import React from "react";
import { Avatar, Divider, Typography, List } from "antd";
import { Listing } from "../../../../lib/graphql/queries/Listing/__generated__/Listing";
import { Link } from "react-router-dom";

interface Props {
  limit: number;
  bookingsPage: number;
  setBookingsPage: (bookingsPage: number) => void;
  listingBookings: Listing["listing"]["bookings"];
}

const { Title, Text } = Typography;

export const ListingBookings = ({
  limit,
  bookingsPage,
  setBookingsPage,
  listingBookings,
}: Props) => {
  const total = listingBookings ? listingBookings.total : null;
  const result = listingBookings ? listingBookings.result : null;

  const listingBookingsList = listingBookings ? (
    <List
      grid={{ gutter: 16, xs: 1, sm: 2, lg: 4 }}
      dataSource={result ? result : undefined}
      locale={{ emptyText: "No booking have been made yet" }}
      pagination={{
        current: bookingsPage,
        total: total ? total : undefined,
        defaultPageSize: limit,
        showLessItems: true,
        hideOnSinglePage: true,
        onChange: (page: number) => setBookingsPage(page),
      }}
      renderItem={(listingBooking) => {
        const bookingHistory = (
          <div className="user-bookings__history">
            <div>
              Check-IN: <Text strong>{listingBooking.checkIn}</Text>
            </div>
            <div>
              Check-OUT: <Text strong>{listingBooking.checkOut}</Text>
            </div>
          </div>
        );
        return (
          <List.Item>
            {bookingHistory}
            <Link to={`/user/${listingBooking.tenant.id}`}>
              <Avatar
                src={listingBooking.tenant.avatar}
                size={64}
                shape="square"
              ></Avatar>
            </Link>
          </List.Item>
        );
      }}
    />
  ) : null;

  const listingBookingsElement = listingBookingsList ? (
    <div className="listing-bookings">
      <Divider />
      <div className="listing-bookings__section">
        <Title level={4}>Bookings</Title>
      </div>
      {listingBookingsList}
    </div>
  ) : null;

  return listingBookingsElement;
};
