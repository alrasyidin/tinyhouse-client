import React from "react";
import { Card, Typography, Divider, Button, DatePicker } from "antd";
import { displayErrorMessage, formatListingPrice } from "../../../../lib/utils";
import moment, { Moment } from "moment";
import { Viewer } from "../../../../lib/types";
import { Listing as ListingData } from "../../../../lib/graphql/queries/Listing/__generated__/Listing";
import { BookingsIndex } from "./types";

interface Props {
  price: number;
  viewer: Viewer;
  host: ListingData["listing"]["host"];
  bookingsIndex: string;
  checkInDate: Moment | null;
  checkOutDate: Moment | null;
  setCheckInDate: (checkInDate: Moment | null) => void;
  setCheckOutDate: (checkOutDate: Moment | null) => void;
  setModalVisible: (modalVisible: boolean) => void;
}

const { Text, Title, Paragraph } = Typography;

export const ListingCreateBookings = ({
  price,
  viewer,
  host,
  bookingsIndex,
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
  setModalVisible,
}: Props) => {
  const bookingsIndexJSON: BookingsIndex = JSON.parse(bookingsIndex);

  const dateIsBooked = (date: Moment) => {
    const y = moment(date).year();
    const m = moment(date).month();
    const d = moment(date).date();

    if (bookingsIndexJSON[y] && bookingsIndexJSON[y][m]) {
      return Boolean(bookingsIndexJSON[y][m][d]);
    } else {
      return false;
    }
  };

  const disabledDate = (date: Moment | null) => {
    if (date) {
      const checkDateBeforeEndOfDay = date.isBefore(moment().endOf("days"));
      const checkDateAfterSixMonth = date.isAfter(
        moment().add(6, "M").startOf("month")
      );

      return (
        checkDateBeforeEndOfDay || checkDateAfterSixMonth || dateIsBooked(date)
      );
    } else {
      return false;
    }
  };

  const disabledDateCheckout = (date: Moment | null) => {
    if (checkInDate && date) {
      const checkOutDateDisableOneMonthLater = date.isAfter(
        moment(checkInDate).add(1, "M").endOf("month")
      );

      return checkOutDateDisableOneMonthLater || disabledDate(date);
    } else {
      return false;
    }
  };

  const verifyAndSetCheckOutDate = (checkOutDate: Moment | null) => {
    if (checkInDate && checkOutDate) {
      if (moment(checkOutDate).isBefore(checkInDate, "days")) {
        return displayErrorMessage(
          "Yoy can't pick date of check out prior to check in!"
        );
      }

      let dateCursor = checkInDate;

      while (moment(dateCursor).isBefore(checkOutDate, "days")) {
        dateCursor = moment(dateCursor).add(1, "days");

        const y = moment(dateCursor).year();
        const m = moment(dateCursor).month();
        const d = moment(dateCursor).date();

        if (
          bookingsIndexJSON[y] &&
          bookingsIndexJSON[y][m] &&
          bookingsIndexJSON[y][m][d]
        ) {
          return displayErrorMessage(
            "Tou can't book period of time that overlap the existing booking. Please try again"
          );
        }
      }
    }

    setCheckOutDate(checkOutDate);
  };

  const viewerIsHost = viewer.id === host.id;
  const checkInInputDisabled = !viewer.id || viewerIsHost || !host.hasWallet;
  const checkOutInputDisabled = checkInInputDisabled || !checkInDate;
  const buttonDisabled = checkInInputDisabled || !checkInDate || !checkOutDate;

  let buttonMessage = "You won't be charged yet";
  if (!viewer.id) {
    buttonMessage = "You have to be signed in to book listing";
  } else if (viewerIsHost) {
    buttonMessage = "You can't book your own listing";
  } else if (!host.hasWallet) {
    buttonMessage =
      "The host disconnected from Stripe and thus won't be able to receive payment";
  }

  return (
    <div className="listing-booking">
      <Card className="listing-booking__card">
        <div>
          <Paragraph>
            <Title level={2} className="listing-booking__card-title">
              {formatListingPrice(price)}
              <span>/day</span>
            </Title>
          </Paragraph>
          <Divider />
          <div className="listing-booking__card-date-picker">
            <Paragraph strong>Check IN</Paragraph>
            <DatePicker
              value={checkInDate ? checkInDate : undefined}
              format={"DD/MM/YYYY"}
              disabled={checkInInputDisabled}
              disabledDate={disabledDate}
              showToday={false}
              onChange={(dateValue) => setCheckInDate(dateValue)}
              onOpenChange={() => setCheckOutDate(null)}
            />
          </div>
          <div className="listing-booking__card-date-picker">
            <Paragraph strong>Check OUT</Paragraph>
            <DatePicker
              value={checkOutDate ? checkOutDate : undefined}
              format={"DD/MM/YYYY"}
              disabledDate={disabledDateCheckout}
              disabled={checkOutInputDisabled}
              showToday={false}
              onChange={(dateValue) => verifyAndSetCheckOutDate(dateValue)}
            />
          </div>
        </div>
        <Divider />
        <Button
          size="large"
          disabled={buttonDisabled}
          type="primary"
          className="listing-booking__card-cta"
          onClick={() => setModalVisible(true)}
        >
          Request to book!
        </Button>
        <Text type="secondary" mark>
          {buttonMessage}
        </Text>
      </Card>
    </div>
  );
};
