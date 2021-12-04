import React from "react";
import { Card, Typography, Divider, Button } from "antd";

const { Title, Paragraph } = Typography;

export const ListingCreateBookings = () => {
  return (
    <div className="listing-booking">
      <div>
        <Card className="listing-booking__card">
          <Paragraph>
            <Title>Here the price</Title>
          </Paragraph>
          <Divider />
          <div className="listing-booking__card-date-picker">
            <Paragraph strong>Check IN</Paragraph>
          </div>
          <div className="listing-booking__card-date-picker">
            <Paragraph strong>Check OUT</Paragraph>
          </div>
        </Card>
      </div>
      <Divider />
      <Button size="large" type="primary" className="listing-booking__card-cta">
        Request to book!
      </Button>
    </div>
  );
};
