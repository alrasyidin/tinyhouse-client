import React from "react";
import { Card, Col, Input, Row, Typography } from "antd";

import imageToronto from "../../assets/toronto.jpg";
import imageDubai from "../../assets/dubai.jpg";
import imageLondon from "../../assets/london.jpg";
import imageLosAngeles from "../../assets/los-angeles.jpg";
import { Link } from "react-router-dom";

const { Title } = Typography;
const { Search } = Input;

interface Props {
  onSearch: (value: string) => void;
}

export const HomeHero = ({ onSearch }: Props) => {
  return (
    <div className="home-hero">
      <div className="home-hero__search">
        <Title level={1} className="home-hero__title">
          Find a Place You Love to Vacation
        </Title>
        <Search
          placeholder="Search 'San Francisco'"
          size="large"
          className="home-hero__search-input"
          enterButton
          onSearch={onSearch}
        />
      </div>
      <Row className="home-hero__cards" gutter={8}>
        <Col md={6} xs={12}>
          <Link to={`listings/toronto`}></Link>
          <Card cover={<img src={imageToronto} alt="Toronto" />}>Toronto</Card>
        </Col>
        <Col md={6} xs={12}>
          <Link to={`listings/dubai`}></Link>
          <Card cover={<img src={imageDubai} alt="Dubai" />}>Dubai</Card>
        </Col>
        <Col md={6} xs={0}>
          <Link to={`listings/los%20angeles`}></Link>
          <Card cover={<img src={imageLosAngeles} alt="Los Angeles" />}>
            Los Angeles
          </Card>
        </Col>
        <Col md={6} xs={0}>
          <Link to={`listings/london`}></Link>
          <Card cover={<img src={imageLondon} alt="London" />}>London</Card>
        </Col>
      </Row>
    </div>
  );
};
