import { gql  } from "@apollo/client";
export const GET_SETTINGS_GENERAL = gql`
  query SettingsGeneral($domain: String!) {
    shop(defaultDomain: $domain) {
      name
      email
      billingAddress {
        countryCodeV2
        phone
      }
    }
  }
`;