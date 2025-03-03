import { gql } from "@apollo/client";

export const usersPermissionsUsersQuery = gql(`
  query {
    usersPermissionsUsers {
      email
    }
  }
`);
