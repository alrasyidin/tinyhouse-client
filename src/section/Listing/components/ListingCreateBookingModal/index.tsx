import React from "react";
import { Typography, Modal, Divider, Button } from "antd";
import { KeyOutlined } from "@ant-design/icons";
import moment, { Moment } from "moment";
import { formatListingPrice } from "../../../../lib/utils";

interface Props {
  price: number;
  checkInDate: Moment;
  checkOutDate: Moment;
  modalVisible: boolean;
  setModalVisible: (modalVisible: boolean) => void;
}
const { Text, Title, Paragraph } = Typography;

export const ListingCreateBookingModal = ({
  price,
  checkInDate,
  checkOutDate,
  modalVisible,
  setModalVisible,
}: Props) => {
  const daysBooked = moment(checkOutDate).diff(checkInDate, "days") + 1;
  const priceBooking = price * daysBooked;
  // const tinyHouseFee = 0.05 * priceBooking;
  // const totalPrice = priceBooking + tinyHouseFee;

  return (
    <Modal
      visible={modalVisible}
      centered
      footer={null}
      onCancel={() => setModalVisible(false)}
    >
      <div className="listing-booking-modal">
        <div className="listing-booking-modal__intro">
          <Title level={2}>
            <KeyOutlined />
          </Title>
          <Title level={3}>Book your trip</Title>
          <Paragraph>
            Enter your payment information to book your listing from date
            between{" "}
            <Text mark strong>
              {moment(checkInDate).format("MMMM Do YYYY")}
            </Text>{" "}
            and{" "}
            <Text mark strong>
              {moment(checkOutDate).format("MMMM Do YYYY")}
            </Text>
            , inclusive
          </Paragraph>
        </div>

        <Divider />

        <div className="listing-booking-modal__charge-summary">
          <Paragraph>
            {formatListingPrice(price, false)} * {daysBooked} days ={" "}
            <Text strong>{formatListingPrice(priceBooking, false)}</Text>
          </Paragraph>

          {/* <Paragraph>
            TinyHouse Fee <sup>~ 5%</sup> ={" "}
            <Text strong>{formatListingPrice(tinyHouseFee)}</Text>
          </Paragraph> */}
          <Paragraph className="listing-booking-modal__charge-summary-total">
            Total Price ={" "}
            <Text strong mark>
              {formatListingPrice(priceBooking, false)}
            </Text>
          </Paragraph>
        </div>

        <Divider />

        <div className="listing-booking-modal__stripe-card-section">
          <Button
            type="primary"
            size="large"
            className="listing-booking-modal__cta"
          >
            Book
          </Button>
        </div>
      </div>
    </Modal>
  );
};
