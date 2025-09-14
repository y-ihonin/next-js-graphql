import { gql } from "@apollo/client";

export const disable2FAMutation = gql(`
  mutation Disable2FA($input: Disable2FAInput) {
    disable2FA(input: $input) {
      message
      success
    }
  }
`);
