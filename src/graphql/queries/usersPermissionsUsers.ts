import { gql } from "@apollo/client";

export const usersPermissionsUsersQuery = gql(`
  query {
    usersPermissionsUsers {
      email
    }
  }
`);

export const usersPermissionsMeQuery = gql(`
  query usersPermissionsMe {
    me {
      documentId
      email
      id
      role {
        description
        id
        name
        type
      }
      username
    }
  }
`);
