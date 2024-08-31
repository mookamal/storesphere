import { gql  } from "@apollo/client";
export const GET_SETTINGS_GENERAL = gql`
  query SettingsGeneral($domain: String!) {
    store(defaultDomain: $domain) {
      name
      email
      billingAddress {
        phone
        address1
        address2
        city
        company
        provinceCode
        zip
        country {
          name
          code
        }
      }
    }
  }
`;