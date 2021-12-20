import React, { useEffect, useRef, useState } from "react";

import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import { Viewer } from "./lib/types";
import { useMutation } from "react-apollo";

import {
  LogIn as LogInData,
  LogInVariables,
} from "./lib/graphql/mutations/LogIn/__generated__/LogIn";
import { LOG_IN } from "./lib/graphql/mutations";

import { Affix, Layout, Spin } from "antd";

import {
  Home,
  Host,
  Listing,
  Listings,
  NotFound,
  User,
  Login,
  AppHeader,
} from "./section";
import "./styles/index.css";
import { AppHeaderSkeleton, ErrorBanner } from "./lib/components";
import { Stripe } from "./section/Stripe";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";

const client = new ApolloClient({
  credentials: "include",
  uri:
    `${process.env.NODE_ENV}` === "development"
      ? "/api"
      : `${process.env.REACT_APP_SERVER_URL}`,
  request: async (operation) => {
    const token = sessionStorage.getItem("token");
    operation.setContext({
      headers: {
        "X-CSRF-TOKEN": token || "",
      },
    });
  },
});

const stripePromise = loadStripe(
  process.env.REACT_APP_S_PUBLISHABLE_KEY as string
);

const optionsStripe: StripeElementsOptions = {
  appearance: {
    theme: "stripe",
  },
};

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
};

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn) {
        setViewer(data.logIn);

        if (data.logIn.token) {
          sessionStorage.setItem("token", data.logIn.token);
        } else {
          sessionStorage.removeItem("token");
        }
      }
    },
  });
  const logInRef = useRef(logIn);

  useEffect(() => {
    logInRef.current();
  }, []);

  if (!viewer.didRequest && !error) {
    return (
      <Layout className="app-skeleton">
        <AppHeaderSkeleton />
        <div className="app-skeleton__spin-section">
          <Spin size="large" tip="Loading TinyHouse" />
        </div>
      </Layout>
    );
  }

  const LogInErrorBannerElement = error ? (
    <ErrorBanner description="We weren't able to verify if you were logged in. Please try again later." />
  ) : null;

  return (
    <Router>
      <Layout id="app">
        {LogInErrorBannerElement}
        <Affix offsetTop={0} className="app__affix-header">
          <AppHeader viewer={viewer} setViewer={setViewer} />
        </Affix>

        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            exact
            path="/host"
            render={(props) => <Host {...props} viewer={viewer} />}
          />
          <Route exact path="/listings/:location?" component={Listings} />
          <Route
            exact
            path="/listing/:id"
            render={(props) => (
              <Elements stripe={stripePromise} options={optionsStripe}>
                <Listing {...props} viewer={viewer} />{" "}
              </Elements>
            )}
          />
          <Route
            exact
            path="/login"
            render={(props) => (
              <Login {...props} viewer={viewer} setViewer={setViewer} />
            )}
          />
          <Route
            exact
            path="/stripe"
            render={(props) => (
              <Stripe {...props} viewer={viewer} setViewer={setViewer} />
            )}
          />
          <Route
            exact
            path="/user/:id"
            render={(props) => (
              <User {...props} viewer={viewer} setViewer={setViewer} />
            )}
          />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  );
};

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,

  document.getElementById("root")
);
