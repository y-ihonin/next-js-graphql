import { gql } from "@apollo/client";

export const generate2FASecretMutation = gql(`
  mutation Generate2FASecret {
    generate2FASecret {
      message
      success
    }
  }
`);
