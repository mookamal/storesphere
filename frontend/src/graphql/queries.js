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
  query ProductIndex(
    $domain: String!
    $first: Int
    $after: String!
    $search: String!
    $status: ProductProductStatusChoices
  ) {
    allProducts(
      defaultDomain: $domain
      first: $first
      after: $after
      title_Icontains: $search
      status: $status
    ) {
      edges {
        node {
          id
          title
          status
          productId
          image {
            image
          }
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
      seo {
        title
        description
      }
      firstVariant {
        price
        compareAtPrice
      }
      options {
        id
        name
        values {
          id
          name
        }
      }
    }
  }
`;

export const GET_MEDIA_IMAGES = gql`
  query GetMediaImages($domain: String!, $first: Int, $after: String!) {
    allMediaImages(defaultDomain: $domain, first: $first, after: $after) {
      edges {
        node {
          image
          id
          imageId
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export const GET_MEDIA_PRODUCT = gql`
  query GetMediaProduct($productId: ID!, $after: String!) {
    getImagesProduct(productId: $productId, first: 10, after: $after) {
      edges {
        node {
          image
          id
          imageId
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export const ADMIN_PRODUCT_DETAILS_VARIANTS = gql`
  query AdminProductDetailsVariants(
    $productId: ID!
    $first: Int
    $after: String!
  ) {
    productDetailsVariants(
      productId: $productId
      first: $first
      after: $after
    ) {
      edges {
        node {
          id
          variantId
          price
          selectedOptions {
            id
            name
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;
