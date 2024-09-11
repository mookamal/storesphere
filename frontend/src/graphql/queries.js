import { gql } from "@apollo/client";
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
  query ProductIndex($domain: String!, $first: Int,$after: String! ,$search: String!, $status: ProductProductStatusChoices) {
    allProducts(defaultDomain: $domain, first: $first ,after: $after ,title_Icontains: $search,status: $status) {
      edges {
        node {
          id
          title
          status
        }
      }
      pageInfo {
      endCursor
      hasNextPage
      }
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    product(id: $id) {
      title
      description
      status
      handle
    }
  }
`;