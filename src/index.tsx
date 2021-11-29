import React from "react";
import ReactDOM from "react-dom";

import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";

import { Home, Host, Listing, Listings, NotFound, User } from "./section";
import "./styles/index.css";

const client = new ApolloClient({
  uri: "/api",
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Listings title="TinyHouse Listings" />,
  </ApolloProvider>,

  document.getElementById("root")
);
