import React from "react";
import { createMemoryHistory } from "history";
import {
  waitFor,
  render,
  fireEvent,
  queryByText,
} from "@testing-library/react";
import { MockedProvider } from "@apollo/react-testing";
import { Route, Router } from "react-router-dom";
import { Login } from "../index";
import { AUTH_URL } from "../../../lib/graphql/queries";
import { GraphQLError } from "graphql";
import { LOG_IN } from "../../../lib/graphql/mutations";

const defaultProps = {
  setViewer: () => {},
  viewer: {
    id: null,
    token: null,
    avatar: null,
    hasWallet: null,
    didRequest: false,
  },
};

describe("Login", () => {
  window.scrollTo = () => {};

  describe.only("AUTH_URL Query", () => {
    const savedLocation = window.location;

    beforeEach(() => {
      //@ts-ignore
      Object.defineProperty(window, "location", {
        value: { assign: jest.fn() },
      });
    });
    afterEach(() => {
      Object.defineProperty(window, "location", {
        value: { ...savedLocation },
      });
    });

    it("redirects the user when query is succesfull", async () => {
      const authMock = {
        request: {
          query: AUTH_URL,
        },
        result: {
          data: {
            authUrl: "https://google.com/signin",
          },
        },
      };

      const history = createMemoryHistory({
        initialEntries: ["/login"],
      });

      const { queryByText, getByRole } = render(
        <MockedProvider mocks={[authMock]} addTypename={false}>
          <Router history={history}>
            <Route path="/login">
              <Login {...defaultProps} />
            </Route>
          </Router>
        </MockedProvider>
      );

      const button = getByRole("button");
      fireEvent.click(button);

      await waitFor(() => {
        expect(window.location.assign).toHaveBeenCalledWith(
          "https://google.com/signin"
        );
        expect(
          queryByText(
            "Sorry. We weren't to unable log you in. Please try again later"
          )
        ).toBeNull();
      });
    });

    it("does not redirects the user when query is unsuccesfull", async () => {
      const authMock = {
        request: {
          query: AUTH_URL,
        },
        error: new GraphQLError("Something was wrong"),
      };

      const history = createMemoryHistory({
        initialEntries: ["/login"],
      });

      const { queryByText, getByRole } = render(
        <MockedProvider mocks={[authMock]} addTypename={false}>
          <Router history={history}>
            <Route path="/login">
              <Login {...defaultProps} />
            </Route>
          </Router>
        </MockedProvider>
      );

      const button = getByRole("button");
      fireEvent.click(button);

      await waitFor(() => {
        expect(window.location.assign).not.toHaveBeenCalled();
        expect(
          queryByText(
            "Sorry. We weren't to unable log you in. Please try again later"
          )
        ).not.toBeNull();
      });
    });
  });

  describe("LOGIN_URL Mutation", () => {
    it("When no code exists in /login route, the mutation is not fired", async () => {
      const logInMock = {
        request: {
          query: LOG_IN,
          variables: {
            input: {
              code: "1234",
            },
          },
        },
        result: {
          data: {
            logIn: {
              id: "1111",
              token: "11lkn23l1n2",
              avatar: "image.jpg",
              hasWallet: false,
              didRequest: true,
            },
          },
        },
      };

      const history = createMemoryHistory({
        initialEntries: ["/login"],
      });

      render(
        <MockedProvider mocks={[logInMock]} addTypename={false}>
          <Router history={history}>
            <Route path="/login">
              <Login {...defaultProps} />
            </Route>
          </Router>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(window.location.pathname).not.toBe("/user/1234");
      });
    });

    describe("When code exists in /login route, as query parameter url", () => {
      it("displaying loading indicator when mutation is in progress", async () => {});
      it("redirect user to their user page when mutation is successful", async () => {
        const logInMock = {
          request: {
            query: LOG_IN,
            variables: {
              input: {
                code: "1234",
              },
            },
          },
          result: {
            data: {
              logIn: {
                id: "1111",
                token: "11lkn23l1n2",
                avatar: "image.jpg",
                hasWallet: false,
                didRequest: true,
              },
            },
          },
        };

        const history = createMemoryHistory({
          initialEntries: ["/login?code=1234"],
        });

        render(
          <MockedProvider mocks={[logInMock]} addTypename={false}>
            <Router history={history}>
              <Route path="/login">
                <Login {...defaultProps} />
              </Route>
            </Router>
          </MockedProvider>
        );

        await waitFor(() => {
          expect(window.location.pathname).toBe("/user/1234");
        });
      });
      it("does not redirect user to their user page when mutation is unsuccessful", async () => {});
    });
  });
});
