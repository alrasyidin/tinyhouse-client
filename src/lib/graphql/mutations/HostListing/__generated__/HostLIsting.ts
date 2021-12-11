/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { HostListingInput } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: HostLIsting
// ====================================================

export interface HostLIsting_hostListing {
  __typename: "Listing";
  id: string;
}

export interface HostLIsting {
  hostListing: HostLIsting_hostListing;
}

export interface HostLIstingVariables {
  input: HostListingInput;
}
