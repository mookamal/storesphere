import { gql  } from "@apollo/client";
export const GET_STORE_DETAILS = gql`
  query SettingsGeneral($domain: String!) {
    storeDetails(domain: $domain) {
      name
      phone
      email
      domain
    }
  }
`;