import React from "react";
import { Card, Typography, Divider, Button, DatePicker } from "antd";
import { displayErrorMessage, formatListingPrice } from "../../../../lib/utils";
import moment, { Moment } from "moment";

interface Props {
  price: number;
  checkInDate: Moment | null;
  checkOutDate: Moment | null;
  setCheckInDate: (checkInDate: Moment | null) => void;
  setCheckOutDate: (checkOutDate: Moment | null) => void;
}

const { Title, Paragraph } = Typography;

export const ListingCreateBookings = ({
  price,
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
}: Props) => {
  const disabledDate = (date: Moment | null) => {
    if (date) {
      const checkDateBeforeEndOfDay = date.isBefore(moment().endOf("days"));
      const checkDateAfterSixMonth = date.isAfter(
        moment().add(6, "M").startOf("month")
      );

      return checkDateBeforeEndOfDay || checkDateAfterSixMonth;
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
    }

    setCheckOutDate(checkOutDate);
  };

  const checkOutInputDisabled = !checkInDate;
  const buttonDisabled = !checkInDate || !checkOutDate;

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
        >
          Request to book!
        </Button>
      </Card>
    </div>
  );
};
