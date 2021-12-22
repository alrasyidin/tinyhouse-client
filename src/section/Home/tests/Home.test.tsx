import React from "react";

import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/react-testing";
import { Home } from "../index";
import { LISTINGS } from "../../../lib/graphql/queries";
import { ListingsFilter } from "../../../lib/graphql/globalTypes";

describe("Home", () => {
  window.scrollTo = () => {};
  describe("search input", () => {
    it("render an empty input on initial render", async () => {
      const history = createMemoryHistory();

      const { getByPlaceholderText } = render(
        <MockedProvider mocks={[]}>
          <Router history={history}>
            <Home />
          </Router>
        </MockedProvider>
      );

      // eslint-disable testing-library/no-wait-for-empty-callback
      await waitFor(() => {
        const searchInput = getByPlaceholderText(
          "Search 'San Francisco'"
        ) as HTMLInputElement;

        expect(searchInput.value).toEqual("");
      });
    });

    it("redirect the user to the /listings page when valid search is provided", async () => {
      const history = createMemoryHistory();

      const { getByPlaceholderText } = render(
        <MockedProvider mocks={[]}>
          <Router history={history}>
            <Home />
          </Router>
        </MockedProvider>
      );

      await waitFor(() => {
        const searchInput = getByPlaceholderText(
          "Search 'San Francisco'"
        ) as HTMLInputElement;

        fireEvent.change(searchInput, { target: { value: "Toronto" } });
        fireEvent.keyDown(searchInput, { key: "Enter", keyCode: 13 });

        expect(history.location.pathname).toBe("/listings/Toronto");
      });
    });

    it("don't redirect the user to the /listings page when invalid search is provided", async () => {
      const history = createMemoryHistory();

      const { getByPlaceholderText } = render(
        <MockedProvider mocks={[]}>
          <Router history={history}>
            <Home />
          </Router>
        </MockedProvider>
      );

      await waitFor(() => {
        const searchInput = getByPlaceholderText(
          "Search 'San Francisco'"
        ) as HTMLInputElement;

        fireEvent.change(searchInput, { target: { value: "" } });
        fireEvent.keyDown(searchInput, { key: "Enter", keyCode: 13 });

        expect(history.location.pathname).toBe("/");
      });
    });
  });

  describe("premium listings", () => {
    it("renders loading state when query is loading", async () => {
      const history = createMemoryHistory();

      const { queryByText } = render(
        <MockedProvider mocks={[]}>
          <Router history={history}>
            <Home />
          </Router>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(queryByText("Premium Listings - Loading")).not.toBeNull();
        expect(queryByText("Premium Listings")).toBeNull();
      });
    });

    it("renders intended UI when query is successfull", async () => {
      const listingsMock = {
        request: {
          query: LISTINGS,
          variables: {
            filter: ListingsFilter.PRICE_HIGH_TO_LOW,
            limit: 4,
            page: 1,
          },
        },
        result: {
          data: {
            listings: {
              region: null,
              total: 10,
              result: [
                {
                  id: "213123",
                  title: "Apartment Cantik dan Nyaman",
                  image: "image.png",
                  address: "Karasak Baru",
                  price: 90000,
                  numOfGuests: 5,
                },
              ],
            },
          },
        },
      };

      const history = createMemoryHistory();

      const { queryByText } = render(
        <MockedProvider mocks={[listingsMock]} addTypename={false}>
          <Router history={history}>
            <Home />
          </Router>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(queryByText("Premium Listings")).not.toBeNull();
        expect(queryByText("Premium Listings - Loading")).toBeNull();
      });
    });

    it("does not render loading state and listings ui when query is error", async () => {
      const listingsMock = {
        request: {
          query: LISTINGS,
          variables: {
            filter: ListingsFilter.PRICE_HIGH_TO_LOW,
            limit: 1,
            page: 4,
          },
        },
        error: new Error("Network Error"),
      };

      const history = createMemoryHistory();

      const { queryByText } = render(
        <MockedProvider mocks={[listingsMock]} addTypename={false}>
          <Router history={history}>
            <Home />
          </Router>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(queryByText("Premium Listings")).toBeNull();
        expect(queryByText("Premium Listings - Loading")).toBeNull();
      });
    });
  });
});
