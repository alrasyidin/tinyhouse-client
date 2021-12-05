import React from "react";
import { Col, Layout, Row, Typography } from "antd";
import { HomeHero } from "./components";
import { Link, RouteComponentProps } from "react-router-dom";
import { displayErrorMessage } from "../../lib/utils";
import { useQuery } from "react-apollo";
import {
  Listings as ListingsData,
  ListingsVariables,
} from "../../lib/graphql/queries/Listings/__generated__/Listings";

import mapImage from "./assets/map-background.jpg";
import imageSanFrancisco from "./assets/san-fransisco.jpg";
import imageCancun from "./assets/cancun.jpg";
import { LISTINGS } from "../../lib/graphql/queries";
import { ListingsFilter } from "../../lib/graphql/globalTypes";
import { HomeListings } from "./components";
import { HomeListingsSkeleton } from "./components/HomeListingsSkeleton";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const PAGE_LIMIT = 4;
const PAGE_NUMBER = 1;

export const Home = ({ history }: RouteComponentProps) => {
  const { data, loading } = useQuery<ListingsData, ListingsVariables>(
    LISTINGS,
    {
      variables: {
        filter: ListingsFilter.PRICE_HIGH_TO_LOW,
        limit: PAGE_LIMIT,
        page: PAGE_NUMBER,
      },
    }
  );
  const onSearch = (value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue) {
      history.push(`/listings/${trimmedValue}`);
    } else {
      displayErrorMessage("Please provide valid input search");
    }
  };

  const renderHomeListingsComponent = () => {
    if (loading) {
      return <HomeListingsSkeleton />;
    }

    if (data && data.listings) {
      return (
        <HomeListings
          title="Premium Listings"
          listings={data.listings.result}
        />
      );
    }

    return null;
  };

  return (
    <Content className="home" style={{ backgroundImage: `url(${mapImage})` }}>
      <HomeHero onSearch={onSearch} />
      <div className="home__cta-section">
        <Title level={3} className="home__cta-section-title">
          Your guide for all things rental
        </Title>
        <Paragraph>
          Helping you to make decisions in renting your last minute locations
        </Paragraph>

        <Link
          to={`/listings/indonesia`}
          className="ant-btn ant-btn-lg ant-btn-primary home__cta-section-button"
        >
          Popular listings in Indonesia
        </Link>
      </div>

      {renderHomeListingsComponent()}
      <div className="home__listings">
        <Title level={4} className="home__listings-title">
          All of any kind listings
        </Title>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Link to={`/listings/san%20francisco`}>
              <div className="home__listings-img-cover">
                <img
                  src={imageSanFrancisco}
                  alt="San Francisco"
                  className="home__listings-img"
                />
              </div>
            </Link>
          </Col>
          <Col xs={24} md={12}>
            <Link to={`/listings/san%20francisco`}>
              <div className="home__listings-img-cover">
                <img
                  src={imageCancun}
                  alt="Cancun"
                  className="home__listings-img"
                />
              </div>
            </Link>
          </Col>
        </Row>
      </div>
    </Content>
  );
};
