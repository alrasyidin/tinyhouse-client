import React from "react";
import { Avatar, Divider, Tag, Typography } from "antd";
import { Listing } from "../../../../lib/graphql/queries/Listing/__generated__/Listing";
import { iconColor } from "../../../../lib/utils";
import { Link } from "react-router-dom";
import { EnvironmentOutlined } from "@ant-design/icons";

interface Props {
  listing: Listing["listing"];
}

const { Paragraph, Title } = Typography;

export const ListingDetails = ({ listing }: Props) => {
  const { title, image, description, numOfGuests, type, host, address, city } =
    listing;
  return (
    <div className="listing-details">
      <div
        style={{ backgroundImage: `url(${image})` }}
        className="listing-details__image"
      ></div>
      <div className="listing-details__information">
        <Paragraph
          type="secondary"
          ellipsis
          className="listing-details__city-address"
        >
          <EnvironmentOutlined style={{ color: iconColor }} /> {city}
          <Divider type="vertical" />
          {address}
        </Paragraph>
        <Title level={3} className="listing-details__title">
          {title}
        </Title>
      </div>
      <Divider />
      <div className="liting-details__section">
        <Link to={`/user/${host.id}`}>
          <Avatar src={host.avatar} size={64} />
          <Title level={2} className="listing-details__host-name">
            {host.name}
          </Title>
        </Link>
      </div>
      <Divider />
      <div className="listing-details__section">
        <Title level={4}>About this space</Title>
        <div className="listing-details__about-items">
          <Tag color="magenta">{type}</Tag>
          <Tag color="magenta">{numOfGuests} GUESTS</Tag>
        </div>

        <Paragraph ellipsis={{ rows: 3, expandable: true }}>
          {description}
        </Paragraph>
      </div>
    </div>
  );
};
