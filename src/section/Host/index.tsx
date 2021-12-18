import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";

import {
  HomeOutlined,
  BankOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import {
  Button,
  Form,
  Input,
  InputNumber,
  Layout,
  Radio,
  Typography,
  Upload,
} from "antd";
import { UploadChangeParam } from "antd/lib/upload";
import { ListingType } from "../../lib/graphql/globalTypes";
import { Viewer } from "../../lib/types";
import {
  displayErrorMessage,
  displaySuccessNotification,
  iconColor,
} from "../../lib/utils";
import { useMutation } from "react-apollo";
import {
  HostListing as HostListingData,
  HostListingVariables,
} from "../../lib/graphql/mutations/HostListing/__generated__/HostLIsting";
import { HOST_LISTING } from "../../lib/graphql/mutations";
import { useScrollToTop } from "../../lib/hooks";

const { Content } = Layout;
const { Text, Title } = Typography;
const { Item } = Form;

interface Props {
  viewer: Viewer;
}

export const Host = ({ viewer }: Props) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageBase64Value, setImageBase64Value] = useState<string | null>(null);
  const [form] = Form.useForm();

  useScrollToTop();

  const [hostListing, { loading, data }] = useMutation<
    HostListingData,
    HostListingVariables
  >(HOST_LISTING, {
    onCompleted: () => {
      displaySuccessNotification("You've successfully create your listing");
    },
    onError: () => {
      displayErrorMessage(
        "Sorry! We weren't able to create your listing. Please try again later."
      );
    },
  });
  const handleChangeImageUpload = (info: UploadChangeParam) => {
    const { file } = info;

    if (file.status === "uploading") {
      setImageLoading(true);
      return;
    }

    if (file.status === "done" && file.originFileObj) {
      getBase64Value(file.originFileObj, (imageBase64Value: string) => {
        setImageBase64Value(imageBase64Value);
        setImageLoading(false);
      });
    }
  };

  const handleHostListing = (value: any) => {
    const fullAddress = `${value.address}, ${value.city}, ${value.state}, ${value.postal_code}`;

    const input = {
      ...value,
      address: fullAddress,
      image: imageBase64Value,
      price: value.price * 100,
    };

    delete input.city;
    delete input.state;
    delete input.postal_code;

    console.log(input);

    hostListing({
      variables: {
        input,
      },
    });
  };

  if (!viewer.id || !viewer.hasWallet) {
    return (
      <Content className="host-content">
        <div className="host__form-header">
          <Title level={4} className="host__form-title">
            You'll to be signed in and connected to Stripe to host a listing!
          </Title>

          <Text type="secondary">
            We only allow users who've signed to our application and have
            connected with Stripe to create a new listing. You can login at{" "}
            <Link to="/login">/login</Link> page and connect with Stripe shortly
            after
          </Text>
        </div>
      </Content>
    );
  }

  if (loading) {
    return (
      <Content className="host-content">
        <div className="host__form-header">
          <Title level={4} className="host__form-title">
            Please wait!{" "}
          </Title>

          <Text type="secondary">We're creating your listing now.</Text>
        </div>
      </Content>
    );
  }

  if (data && data.hostListing) {
    return <Redirect to={`/listing/${data.hostListing.id}`} />;
  }

  return (
    <Content className="host-content">
      <Form
        className="host__form"
        form={form}
        layout="vertical"
        requiredMark={true}
        onFinish={handleHostListing}
        onFinishFailed={({ values, errorFields }) => {
          if (errorFields) {
            displayErrorMessage("Please complete all required form fields!");
            return;
          }
        }}
      >
        <div className="host__form-header">
          <Title level={3} className="host__form-title">
            Hi! Let's get started listing your place.
          </Title>

          <Text type="secondary">
            We'll collect some basic and additional information about your
            listing.
          </Text>
        </div>

        <Item
          name="type"
          label="Host Type"
          rules={[{ required: true, message: "Please select a home type" }]}
        >
          <Radio.Group>
            <Radio.Button value={ListingType.APARTMENT}>
              <HomeOutlined style={{ color: iconColor }} />{" "}
              <span>Apartment</span>
            </Radio.Button>
            <Radio.Button value={ListingType.HOUSE}>
              <BankOutlined style={{ color: iconColor }} /> <span>House</span>
            </Radio.Button>
          </Radio.Group>
        </Item>

        <Item
          name="numOfGuests"
          label="Max # Num Of Guests"
          rules={[
            { required: true, message: "Please enter max number of guests" },
          ]}
        >
          <InputNumber min={1} placeholder="4" />
        </Item>

        <Item
          name="title"
          label="Title"
          tooltip="Max character count of 100"
          rules={[
            { required: true, message: "Please enter a title of your listing" },
          ]}
        >
          <Input
            maxLength={100}
            placeholder="The iconic and luxurious Bel-Air mansion"
          />
        </Item>

        <Item
          name="description"
          label="Description of listing"
          tooltip="Max character count of 5000"
          rules={[
            {
              required: true,
              message: "Please enter a description of your listing",
            },
          ]}
        >
          <Input.TextArea
            rows={8}
            maxLength={5000}
            placeholder="Modern, iconic and clean home of Fresh Prince. Situated in the heart Bel-Air, Los Angeles"
          />
        </Item>

        <Item
          name="address"
          label="Address"
          rules={[
            {
              required: true,
              message: "Please enter a address of your listing",
            },
          ]}
        >
          <Input placeholder="251 North Bristol Avenue" />
        </Item>

        <Item
          name="city"
          label="City"
          rules={[
            { required: true, message: "Please enter a city of your listing" },
          ]}
        >
          <Input placeholder="Los Angles" />
        </Item>

        <Item
          name="state"
          label="State/Region"
          rules={[
            {
              required: true,
              message: "Please enter a state/region of your listing",
            },
          ]}
        >
          <Input placeholder="California" />
        </Item>

        <Item
          name="postal_code"
          label="Zip/Postal Code"
          rules={[
            {
              required: true,
              message: "Please enter a zip or postal code of your listing",
            },
          ]}
        >
          <Input placeholder="Please enter your zip code for your listing" />
        </Item>

        <Item
          name="image"
          label="Image"
          tooltip="Images to be under 1MB in size and of type JPG or PNG"
          rules={[
            {
              required: true,
              message: "Please enter a image of your listing",
            },
          ]}
        >
          <div className="host__form-image-upload">
            <Upload
              name="image"
              listType="picture-card"
              showUploadList={false}
              action="/statusDone"
              beforeUpload={beforeImageUpload}
              onChange={handleChangeImageUpload}
            >
              {imageBase64Value ? (
                <img
                  src={imageBase64Value}
                  alt="Listing"
                  style={{ maxWidth: "100%" }}
                />
              ) : (
                <div>
                  {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div className="ant-upload-text">Upload</div>
                </div>
              )}
            </Upload>
          </div>
        </Item>

        <Item
          name="price"
          label="Price"
          tooltip="All price in USD/day"
          rules={[
            { required: true, message: "Please enter a price of your listing" },
          ]}
        >
          <InputNumber min={0} placeholder="120" />
        </Item>

        <Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Item>
      </Form>
    </Content>
  );
};

const beforeImageUpload = (file: File) => {
  const fileIsValidImage =
    file.type === "image/jpeg" || file.type === "image/png";
  const fileIsValidSize = file.size / 1024 / 1024 < 1;

  if (!fileIsValidImage) {
    displayErrorMessage(
      "You're only able to upload valid image JPG or PNG file"
    );
    return false;
  }

  if (!fileIsValidSize) {
    displayErrorMessage(
      "You're only able to upload valid image under 1MB in size!"
    );
    return false;
  }

  return fileIsValidImage && fileIsValidSize;
};

const getBase64Value = (
  file: File | Blob,
  callback: (imageBase64Value: string) => void
) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = () => {
    callback(reader.result as string);
  };
};
