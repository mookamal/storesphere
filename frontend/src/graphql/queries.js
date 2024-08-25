import { gql  } from "@apollo/client";
export const GET_SETTINGS_GENERAL = gql`
  query SettingsGeneral($domain: String!) {
    shop(domain: $domain) {
      name
      email
      billingAddress {
        phone
      }
    }
  }
`;