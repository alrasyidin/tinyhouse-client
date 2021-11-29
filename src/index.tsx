import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";

import { Home, Host, Listing, Listings, NotFound, User } from "./section";
import "./styles/index.css";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/host" component={Host} />
        <Route exact path="/listings/:location?" component={Listings} />
        <Route exact path="/listing/:id" component={Listing} />
        <Route exact path="/user" component={User} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};

const client = new ApolloClient({
  uri: "/api",
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,

  document.getElementById("root")
);
