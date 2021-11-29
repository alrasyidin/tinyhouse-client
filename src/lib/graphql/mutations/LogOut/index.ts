import { gql } from "apollo-boost";

export const LOG_OUT = gql`
  mutation LogIn() {
    logOut() {
      id
      token
      avatar
      hasWallet
      didRequest
    }
  }
`;
