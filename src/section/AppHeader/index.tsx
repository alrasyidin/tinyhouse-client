import React, { forwardRef, useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Layout } from "antd";

import logo from "./assets/tinyhouse-logo.png";
import { MenuItems } from "./components";
import { Viewer } from "../../lib/types";
import { Input } from "antd";
import { displayErrorMessage } from "../../lib/utils";

const { Header } = Layout;
const { Search } = Input;

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const AppHeader = forwardRef(
  ({ viewer, setViewer }: Props, _ref: unknown) => {
    const location = useLocation();
    const history = useHistory();

    const [search, setSearch] = useState("");

    useEffect(() => {
      const { pathname } = location;
      const pathnameSubString = pathname.split("/");

      if (!pathname.includes("/listings")) {
        setSearch("");

        return;
      }

      if (pathname.includes("/listings") && pathnameSubString.length === 3) {
        setSearch(pathnameSubString[2]);
        return;
      }
    }, [location]);

    const handleSearch = (search: string) => {
      const trimmedValue = search.trim();

      if (trimmedValue) {
        history.push(`/listings/${trimmedValue}`);
      } else {
        displayErrorMessage("Please provide valid input search");
      }
    };

    return (
      <Header className="app-header">
        <div className="app-header__logo-search-section">
          <div className="app-header__logo">
            <Link to="/">
              <img src={logo} alt="App Logo" />
            </Link>
          </div>
          <div className="app-header__search-input">
            <Search
              placeholder="Search 'Sans Francisco'"
              value={search}
              onChange={(evt) => setSearch(evt.target.value)}
              onSearch={handleSearch}
              enterButton
            ></Search>
          </div>
        </div>
        <div className="app-header__menu-section">
          <MenuItems viewer={viewer} setViewer={setViewer} />
        </div>
      </Header>
    );
  }
);
