import React from "react";
import { Typography, List } from "antd";
import { ListingsCard } from "../../../../lib/components/ListingCard/";
import { User } from "../../../../lib/graphql/queries/User/__generated__/User";

interface Props {
  limit: number;
  bookingsPage: number;
  setBookingsPage: (bookingsPage: number) => void;
  userBookings: User["user"]["bookings"];
}

const { Paragraph, Title, Text } = Typography;

export const UserBookings = ({
  limit,
  bookingsPage,
  setBookingsPage,
  userBookings,
}: Props) => {
  const total = userBookings ? userBookings.total : null;
  const result = userBookings ? userBookings.result : null;

  const userBookingsList = userBookings ? (
    <List
      grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 4, xl: 4 }}
      dataSource={result ? result : undefined}
      locale={{ emptyText: "You haven't made any bookings" }}
      pagination={{
        current: bookingsPage,
        total: total ? total : undefined,
        defaultPageSize: limit,
        position: "top",
        showLessItems: true,
        hideOnSinglePage: true,
        onChange: (page: number) => setBookingsPage(page),
      }}
      renderItem={(booking) => {
        const bookingHistory = (
          <div className="user-bookings__history">
            <div>
              Check-IN: <Text strong>{booking.checkIn}</Text>
            </div>
            <div>
              Check-OUT: <Text strong>{booking.checkOut}</Text>
            </div>
          </div>
        );
        return (
          <List.Item>
            {bookingHistory}
            <ListingsCard listing={booking.listing}></ListingsCard>
          </List.Item>
        );
      }}
    />
  ) : null;

  const userBookingsElement = userBookingsList ? (
    <div className="user-bookings">
      <Title className="user-bookings__title" level={4}>
        Bookings
      </Title>
      <Paragraph className="user-bookings__description">
        This section highlight the bookings you've made, and check-in/check-out
        dates associated with it.
      </Paragraph>
      {userBookingsList}
    </div>
  ) : null;

  return userBookingsElement;
};
