import { gql  } from "@apollo/client";
export const GET_SETTINGS_GENERAL = gql`
  query SettingsGeneral($domain: String!) {
    store(defaultDomain: $domain) {
      name
      email
      currencyCode
      billingAddress {
        phone
        address1
        address2
        city
        company
        zip
        country {
          name
          code
        }
      }
    }
  }
`;

export const PRODUCTS_ADMIN_PAGE = gql`
  query ProductIndex($domain: String!, $search: String!, $status: ProductProductStatusChoices) {
    allProducts(defaultDomain: $domain, title_Icontains: $search,status: $status) {
      edges {
        node {
          id
          title
          status
        }
      }
    }
  }
`;