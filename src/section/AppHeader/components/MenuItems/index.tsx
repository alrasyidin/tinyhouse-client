import React from "react";

import { useMutation } from "react-apollo";
import { Link } from "react-router-dom";
import { Avatar, Button, Icon, Menu } from "antd";
import { Viewer } from "../../../../lib/types";
import { LogOut as LogOutData } from "../../../../lib/graphql/mutations/LogOut/__generated__/LogOut";
import { LOG_OUT } from "../../../../lib/graphql/mutations";
import {
  displayErrorMessage,
  displaySuccessNotification,
} from "../../../../lib/utils";

const { Item, SubMenu } = Menu;

interface Props {
  viewer: Viewer;
  setViewer: (Viewer: Viewer) => void;
}

export const MenuItems = ({ viewer, setViewer }: Props) => {
  const [logOut] = useMutation<LogOutData>(LOG_OUT, {
    onCompleted: (data) => {
      if (data && data.logOut) {
        setViewer(data.logOut);
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
      <SubMenu title={<Avatar src={viewer.avatar} />}>
        <Item key={`/user`}>
          <Link to={`/user/${viewer.id}`}>
            <Icon type="user"></Icon>
            Profile
          </Link>
        </Item>
        <Item key={`/logout`}>
          <div onClick={handleLogOut}>
            <Icon type="logout"></Icon>
            Log Out
          </div>
        </Item>
      </SubMenu>
    ) : (
      <Item>
        <Link to="/login">
          <Button type="primary">Sign In</Button>
        </Link>
      </Item>
    );

  return (
    <Menu mode="horizontal" selectable={false} className="menu">
      <Item key="/host">
        <Link to="/host">
          <Icon type="home"></Icon>
          Host
        </Link>
      </Item>
      {subMenuLogin}
    </Menu>
  );
};
