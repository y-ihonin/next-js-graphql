import { gql } from "@apollo/client";

export const signUpMutation = gql(`
  mutation Register($input: UsersPermissionsRegisterInput!) {
    register(input: $input) {
    jwt
    user {
      blocked
      confirmed
      documentId
      id
      email
      username
    }
  }
`);
