import { notification, message } from "antd";

export const iconColor = "#1890ff";

export const formatListingPrice = (price: number, round: boolean = true) => {
  const formatPrice = round ? Math.round(price / 100) : price / 100;
  return `$${formatPrice}`;
};

export const displaySuccessNotification = (
  message: string,
  description?: string
) => {
  return notification.success({
    message,
    description,
    placement: "topLeft",
    style: {
      marginTop: 20,
    },
  });
};

export const displayErrorMessage = (error: string) => {
  return message.error(error);
};
