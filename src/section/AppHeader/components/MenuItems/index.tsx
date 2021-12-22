import React from "react";

import { useMutation } from "react-apollo";
import { Link } from "react-router-dom";
import { Avatar, Button, Menu } from "antd";
import { Viewer } from "../../../../lib/types";
import { LogOut as LogOutData } from "../../../../lib/graphql/mutations/LogOut/__generated__/LogOut";
import { LOG_OUT } from "../../../../lib/graphql/mutations";
import {
  displayErrorMessage,
  displaySuccessNotification,
} from "../../../../lib/utils";
import {
  ApartmentOutlined,
  HomeOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Item, SubMenu } = Menu;

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const MenuItems = ({ viewer, setViewer }: Props) => {
  const [logOut] = useMutation<LogOutData>(LOG_OUT, {
    onCompleted: (data) => {
      if (data && data.logOut) {
        setViewer(data.logOut);
        sessionStorage.removeItem("token");
        displaySuccessNotification("You've successfull logged out");
      }
    },
    onError: () => {
      displayErrorMessage(
        "Sorry! We weren't able you log out. Please try again later"
      );
    },
  });
  const handleLogOut = () => {
    logOut();
  };
  const subMenuLogin =
    viewer.id && viewer.avatar ? (
      <SubMenu title={<Avatar src={viewer.avatar} />} key={"menu"}>
        <Item key={`/user`}>
          <Link to={`/user/${viewer.id}`}>
            <UserOutlined /> Profile
          </Link>
        </Item>
        <Item key={`/logout`}>
          <div onClick={handleLogOut}>
            <LogoutOutlined /> Log Out
          </div>
        </Item>
      </SubMenu>
    ) : (
      <Item key={`/login`}>
        <Link to="/login">
          <Button type="primary">Sign In</Button>
        </Link>
      </Item>
    );

  return (
    <Menu mode="horizontal" selectable={false} className="menu">
      <Item key="/host">
        <Link to="/host">
          <HomeOutlined /> Host
        </Link>
      </Item>
      <Item key="/browse-listings">
        <Link to="/listings">
          <ApartmentOutlined /> Browse Listings
        </Link>
      </Item>
      {subMenuLogin}
    </Menu>
  );
};
