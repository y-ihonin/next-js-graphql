import { gql } from "@apollo/client";

export const get2FAInfoQuery = gql(`
  query {
    get2FAInfo {
      qrCodeUrl
      twoFASecret
      twoFactorRequired
      userId
    }
  }
`);
