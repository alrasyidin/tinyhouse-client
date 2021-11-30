import { Alert } from "antd";
import React from "react";

interface Props {
  message?: string;
  description?: string;
}
export const ErrorBanner = ({
  message = "Uh oh! Something went wrong :(",
  description = "Look like something went wrong. Please check your internet connection or try again later.",
}: Props) => {
  return (
    <Alert
      closable
      banner
      message={message}
      description={description}
      type="error"
      className="error-banner"
    ></Alert>
  );
};
