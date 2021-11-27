import { Alert, Divider, Skeleton } from "antd";
import "./styles/ListingsSkeleton.css";
interface Props {
  title: string;
  error?: boolean;
}

export const ListingsSkeleton = ({ title, error }: Props) => {
  const errorAlert = error ? (
    <Alert
      type="error"
      message="Uh oh! Something went wrong with deleting - please try again"
      className="listings-skeleton__alert"
    />
  ) : null;

  return (
    <div className="listings-skeleton">
      {errorAlert}
      <h1>{title}</h1>
      <Skeleton active paragraph={{ rows: 1 }}></Skeleton>
      <Divider></Divider>
      <Skeleton active paragraph={{ rows: 1 }}></Skeleton>
      <Divider></Divider>
      <Skeleton active paragraph={{ rows: 1 }}></Skeleton>
      <Divider></Divider>
    </div>
  );
};
