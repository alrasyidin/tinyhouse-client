import React, { useState } from "react";
import { useQuery } from "react-apollo";
import {
  Listings as ListingsData,
  ListingsVariables,
} from "../../lib/graphql/queries/Listings/__generated__/Listings";
import { LISTINGS } from "../../lib/graphql/queries";
import { ListingsFilter as ListingsFilterEnum } from "../../lib/graphql/globalTypes";
import { Link, RouteComponentProps } from "react-router-dom";
import { List, Layout, Typography, Affix } from "antd";
import { ErrorBanner, ListingsCard } from "../../lib/components";
import {
  ListingsFilter,
  ListingsPagination,
  ListingsSkeleton,
} from "./components";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

interface MatchParams {
  location: string;
}
const PAGE_LIMIT = 8;

export const Listings = ({ match }: RouteComponentProps<MatchParams>) => {
  const [filter, setFilter] = useState(ListingsFilterEnum.PRICE_LOW_TO_HIGH);
  const [page, setPage] = useState(1);

  const { data, loading, error } = useQuery<ListingsData, ListingsVariables>(
    LISTINGS,
    {
      variables: {
        location: match.params.location,
        limit: PAGE_LIMIT,
        page,
        filter,
      },
    }
  );

  const listings = data ? data.listings : null;
  const listingsRegion = listings ? listings.region : null;

  const ListingsElement =
    listings && listings.result.length ? (
      <>
        <Affix offsetTop={64}>
          <div className="listings__option">
            <ListingsFilter filter={filter} setFilter={setFilter} />
            <ListingsPagination
              page={page}
              limit={PAGE_LIMIT}
              total={listings.total}
              setPage={setPage}
            />
          </div>
        </Affix>
        <List
          className="listings__list"
          grid={{ gutter: 8, xs: 1, sm: 2, lg: 4 }}
          dataSource={listings.result}
          renderItem={(listing) => (
            <List.Item>
              <ListingsCard listing={listing} />
            </List.Item>
          )}
        ></List>
      </>
    ) : (
      <div>
        <Paragraph>
          It appears that no listings have been created for{" "}
          <Text mark>"{listingsRegion}"</Text>
        </Paragraph>
        <Paragraph>
          Be the first person to create{" "}
          <Link to={"/host"}>a listing for this area</Link>
        </Paragraph>
      </div>
    );

  const ListingsTitleElement = listingsRegion ? (
    <Title level={3} className="listings__title">
      Resut For "{listingsRegion}"
    </Title>
  ) : null;

  if (loading) {
    return (
      <Content className="listings">
        <ListingsSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="listings">
        <ErrorBanner message="We either couldn't find anything matching your search or have encounters an error. If You are searching for unique location, try searching again with more common keywords." />
        <ListingsSkeleton />
      </Content>
    );
  }

  return (
    <Content className="listings">
      {ListingsTitleElement}
      {ListingsElement}
    </Content>
  );
};
