import {
  Form,
  Icon,
  Input,
  InputNumber,
  Layout,
  Radio,
  Typography,
  Upload,
} from "antd";
import { UploadChangeParam } from "antd/lib/upload";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ListingType } from "../../lib/graphql/globalTypes";
import { Viewer } from "../../lib/types";
import { displayErrorMessage, iconColor } from "../../lib/utils";

const { Content } = Layout;
const { Text, Title } = Typography;
const { Item } = Form;

interface Props {
  viewer: Viewer;
}

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

export const Host = ({ viewer }: Props) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageBase64Value, setImageBase64Value] = useState<string | null>(null);

  const handleChange = (info: UploadChangeParam) => {
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

  return (
    <Content className="host-content">
      <Form className="host__form">
        <div className="host__form-header">
          <Title level={3} className="host__form-title">
            Hi! Let's get started listing your place.
          </Title>

          <Text type="secondary">
            We'll collect some basic and additional information about your
            listing.
          </Text>
        </div>

        <Item label="Host Type">
          <Radio.Group>
            <Radio.Button value={ListingType.APARTMENT}>
              <Icon style={{ color: iconColor }} type="bank" />{" "}
              <span>Apartment</span>
            </Radio.Button>
            <Radio.Button value={ListingType.HOUSE}>
              <Icon style={{ color: iconColor }} type="home" />{" "}
              <span>House</span>
            </Radio.Button>
          </Radio.Group>
        </Item>

        <Item label="Title" extra="Max character count of 100">
          <Input
            maxLength={100}
            placeholder="The iconic and luxurious Bel-Air mansion"
          />
        </Item>

        <Item
          label="Description of listing"
          extra="Max character count of 5000"
        >
          <Input
            maxLength={5000}
            placeholder="Modern, iconic and clean home of Fresh Prince. Situated in the heart Bel-Air, Los Angeles"
          />
        </Item>

        <Item label="Address">
          <Input placeholder="251 North Bristol Avenue" />
        </Item>

        <Item label="City">
          <Input placeholder="Los Angles" />
        </Item>

        <Item label="State/Region">
          <Input placeholder="California" />
        </Item>

        <Item label="Zip/Postal Code">
          <Input placeholder="Please enter your zip code for your listing" />
        </Item>

        <Item
          label="Image"
          extra="Images to be under 1MB in size and of type JPG or PNG"
        >
          <div className="host__form-image-upload">
            <Upload
              name="image"
              listType="picture-card"
              showUploadList={false}
              action="/statusDone"
              beforeUpload={beforeImageUpload}
              onChange={handleChange}
            >
              {imageBase64Value ? (
                <img src={imageBase64Value} alt="Listing" />
              ) : (
                <div>
                  <Icon type={imageLoading ? "loading" : "plus"} />
                  <div className="ant-upload-text">Upload</div>
                </div>
              )}
            </Upload>
          </div>
        </Item>

        <Item label="Price" extra="All price in USD/day">
          <InputNumber min={0} placeholder="120" />
        </Item>
      </Form>
    </Content>
  );
};
