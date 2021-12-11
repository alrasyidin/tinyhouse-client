import { gql } from "apollo-boost";

export const HOST_LISTING = gql`
  mutation HostLIsting($input: HostListingInput!) {
    hostListing(input: $input) {
      id
    }
  }
`;
