import { gql } from "apollo-boost";

export const LISTING = gql`
  query Listing($id: ID!, $bookingsPage: Int!, $limit: Int!) {
    listing(id: $id) {
      id
      title
      description
      image
      type
      host {
        id
        name
        avatar
        hasWallet
      }
      bookings(limit: $limit, page: $bookingsPage) {
        total
        result {
          id
          tenant {
            id
            name
            avatar
          }
          checkIn
          checkOut
        }
      }
      bookingsIndex
      price
      numOfGuests
      address
      country
      admin
      city
    }
  }
`;
