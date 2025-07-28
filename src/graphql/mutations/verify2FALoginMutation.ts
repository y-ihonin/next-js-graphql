import { gql } from "@apollo/client";

export const verify2FALoginMutation = gql(`
  mutation Verify2FALogin($input: Verify2FAInput!) {
    verify2FALogin(input: $input) {
      jwt
    }
  }
`);
