import { gql } from "@apollo/client";

export const signInMutation = gql(`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      twoFactorRequired
      userId
      jwt
      twoFASecret
    }
  }
`);
