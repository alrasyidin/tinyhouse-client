import React from "react";
import {
  Card,
  Typography,
  Divider,
  Button,
  DatePicker,
  Tooltip,
  Badge,
} from "antd";
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

  const isDateBooked = (date: Moment) => {
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
      const isDateBeforeEndOfDay = date.isBefore(moment().endOf("days"));

      const isDateMoreThanOneMonthAhead = moment(date).isAfter(
        moment().endOf("day").add(30, "days")
      );

      return (
        isDateBeforeEndOfDay ||
        isDateMoreThanOneMonthAhead ||
        isDateBooked(date)
      );
    } else {
      return false;
    }
  };

  const verifyAndSetCheckOutDate = (checkOutDate: Moment | null) => {
    console.log(checkOutDate?.format("YYYY-MM-DD"));
    if (checkInDate) {
      if (moment(checkOutDate).isBefore(checkInDate, "days")) {
        setCheckOutDate(null);

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
            <Paragraph strong>Check In</Paragraph>
            <DatePicker
              value={checkInDate ? checkInDate : undefined}
              format={"DD/MM/YYYY"}
              disabled={checkInInputDisabled}
              disabledDate={disabledDate}
              showToday={false}
              onChange={(dateValue) => setCheckInDate(dateValue)}
              onOpenChange={() => setCheckOutDate(null)}
              renderExtraFooter={() => (
                <div>
                  <Text type="secondary" className="ant-calendar-footer-text">
                    You can only book listing within 30 days from today
                  </Text>
                </div>
              )}
            />
          </div>
          <div className="listing-booking__card-date-picker">
            <Paragraph strong>Check Out</Paragraph>
            <DatePicker
              value={checkOutDate ? checkOutDate : null}
              format={"DD/MM/YYYY"}
              disabled={checkOutInputDisabled}
              disabledDate={disabledDate}
              showToday={false}
              onChange={(dateValue) => verifyAndSetCheckOutDate(dateValue)}
              dateRender={(current) => {
                if (
                  moment(current).isSame(
                    checkInDate ? checkInDate : null,
                    "day"
                  )
                ) {
                  return (
                    <Tooltip title="Check in date">
                      <div className="ant-calendar-date ant-calendar-date__check-in">
                        {current.date()}
                      </div>
                    </Tooltip>
                  );
                } else {
                  return (
                    <div className="ant-calendar-date ant-picker-cell-inner">
                      {current.date()}
                    </div>
                  );
                }
              }}
              renderExtraFooter={() => (
                <div>
                  <Text type="secondary" className="ant-calendar-footer-text">
                    You can only book listing within 30 days from today
                  </Text>
                </div>
              )}
            />
          </div>
          {/* <Tooltip title="Check in date">
            <div className="ant-calendar-date ant-calendar-date__check-in">
              {moment().format("YYYY-MM-DD")}
            </div>
          </Tooltip> */}
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
