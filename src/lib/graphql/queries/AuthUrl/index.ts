import { gql } from "apollo-boost";

export const AUTH_URL = gql`
  mutation AuthUrl() {
    authUrl
  }
`;
