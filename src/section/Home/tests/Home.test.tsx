import React from "react";

import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/react-testing";
import { Home } from "../index";

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
    it("", () => {});
  });
});
