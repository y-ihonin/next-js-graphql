import { gql } from "@apollo/client";

export const enable2FAMutation = gql(`
  mutation Enable2FA($input: Enable2FAInput) {
    enable2FA(input: $input) {
      message
      success
    }
  }
`);
