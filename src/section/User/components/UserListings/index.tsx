import React from "react";
import { Typography, List } from "antd";
import { ListingsCard } from "../../../../lib/components/ListingCard/";
import { User } from "../../../../lib/graphql/queries/User/__generated__/User";

interface Props {
  limit: number;
  listingsPage: number;
  setListingsPage: (listingsPage: number) => void;
  userListings: User["user"]["listings"];
}

const { Paragraph, Title } = Typography;

export const UserListings = ({
  limit,
  listingsPage,
  setListingsPage,
  userListings,
}: Props) => {
  const { total, result } = userListings;

  const userListingsList = (
    <List
      grid={{ gutter: 16, xs: 1, sm: 2, lg: 4 }}
      dataSource={result}
      locale={{ emptyText: "User doesn't have any listings" }}
      pagination={{
        current: listingsPage,
        total,
        defaultPageSize: limit,
        position: "top",
        showLessItems: true,
        hideOnSinglePage: true,
        onChange: (page: number) => setListingsPage(page),
      }}
      renderItem={(listing) => (
        <List.Item>
          <ListingsCard listing={listing}></ListingsCard>
        </List.Item>
      )}
    />
  );

  return (
    <div className="user-listings">
      <Title className="user-listings__title" level={4}>
        Listings
      </Title>
      <Paragraph className="user-listings__description">
        This section highlight the listings this user currently hosts and has
        made available for bookings
      </Paragraph>
      {userListingsList}
    </div>
  );
};
