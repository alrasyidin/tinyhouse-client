import React from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { Typography, Modal, Divider, Button } from "antd";
import { KeyOutlined } from "@ant-design/icons";
import moment, { Moment } from "moment";
import {
  displayErrorMessage,
  displaySuccessNotification,
  formatListingPrice,
} from "../../../../lib/utils";
import {
  CreateBooking as CreateBookingData,
  CreateBookingVariables,
} from "../../../../lib/graphql/mutations/CreateBooking/__generated__/CreateBooking";
import { CREATE_BOOKING } from "../../../../lib/graphql/mutations";
import { useMutation } from "react-apollo";

interface Props {
  id: string;
  price: number;
  checkInDate: Moment;
  checkOutDate: Moment;
  modalVisible: boolean;
  setModalVisible: (modalVisible: boolean) => void;
  clearBookingData: () => void;
  handleRefetch: () => Promise<void>;
}
const { Text, Title, Paragraph } = Typography;

export const ListingCreateBookingModal = ({
  id,
  price,
  checkInDate,
  checkOutDate,
  modalVisible,
  setModalVisible,
  clearBookingData,
  handleRefetch,
}: Props) => {
  const [createBooking, { loading }] = useMutation<
    CreateBookingData,
    CreateBookingVariables
  >(CREATE_BOOKING, {
    onCompleted: () => {
      clearBookingData();
      displaySuccessNotification(
        "You've succesfully booked listing",
        "Booking history can always be found in User page"
      );
      handleRefetch();
    },
    onError: () => {
      displayErrorMessage(
        "Sorry! we weren't able to successfully book listing. Please try again later"
      );
    },
  });

  const stripe = useStripe();
  const elements = useElements();

  const handleCheckout = async () => {
    if (!elements || !stripe) {
      return displayErrorMessage("Sorry! we weren't able connect to stripe");
    }

    let { token: stripeToken, error } = await stripe.createToken(
      elements.getElement(CardElement) as StripeCardElement
    );

    if (stripeToken) {
      createBooking({
        variables: {
          input: {
            id,
            source: stripeToken.id,
            checkIn: moment(checkInDate).format("YYYY-MM-DD"),
            checkOut: moment(checkOutDate).format("YYYY-MM-DD"),
          },
        },
      });
    } else {
      displayErrorMessage(
        error && error.message
          ? error.message
          : "Sorry! we wern't be able to book a listing"
      );
    }
  };

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
          <CardElement className="listing-booking-modal__stripe-card" />
          <Button
            type="primary"
            size="large"
            className="listing-booking-modal__cta"
            onClick={handleCheckout}
            loading={loading}
            disabled={!stripe || !elements}
          >
            Book
          </Button>
        </div>
      </div>
    </Modal>
  );
};
