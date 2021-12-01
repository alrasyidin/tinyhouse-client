import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Layout } from "antd";

import logo from "./assets/tinyhouse-logo.png";
import { MenuItems } from "./components";
import { Viewer } from "../../lib/types";

const { Header } = Layout;

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const AppHeader = forwardRef(
  ({ viewer, setViewer }: Props, _ref: unknown) => {
    return (
      <Header className="app-header">
        <div className="app-header__logo-search-section">
          <div className="app-header__logo">
            <Link to="/">
              <img src={logo} alt="App Logo" />
            </Link>
          </div>
        </div>
        <div className="app-header__menu-section">
          <MenuItems viewer={viewer} setViewer={setViewer} />
        </div>
      </Header>
    );
  }
);
