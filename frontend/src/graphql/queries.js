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
      collections {
        title
        collectionId
      }
      seo {
        title
        description
      }
      firstVariant {
        price
        compareAtPrice
        stock
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
          stock
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

export const ADMIN_ALL_COLLECTIONS = gql`
  query AdminCollectionsList($domain: String!, $first: Int, $after: String!) {
    allCollections(defaultDomain: $domain, first: $first, after: $after) {
      edges {
        node {
          id
          collectionId
          title
          description
          productsCount
          image {
            image
          }
          seo {
            title
            description
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

export const ADMIN_COLLECTION_BY_ID = gql`
  query AdminCollectionById($id: ID!) {
    collectionById(id: $id) {
      collectionId
      title
      description
      productsCount
      handle
      seo {
        title
        description
      }
      image {
        image
        imageId
      }
    }
  }
`;

export const ADMIN_PRODUCTS_BY_COLLECTION_ID = gql`
  query Admin_products_by_collection(
    $collectionId: ID!
    $first: Int
    $after: String!
  ) {
    productsByCollection(
      collectionId: $collectionId
      first: $first
      after: $after
    ) {
      edges {
        node {
          id
          productId
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

export const ADMIN_PRODUCT_RESOURCE_COLLECTION = gql`
  query AdminProductResourceCollection(
    $collectionId: ID!
    $first: Int
    $after: String!
    $search: String!
  ) {
    productResourceCollection(
      collectionId: $collectionId
      first: $first
      after: $after
      title_Icontains: $search
    ) {
      edges {
        node {
          id
          productId
          title
          inCollection
        }
      }
    }
  }
`;

export const ADMIN_COLLECTIONS_FIND = gql`
  query AdminCollectionsFind($domain: String!, $search: String!, $first: Int) {
    collectionsFind(
      defaultDomain: $domain
      title_Icontains: $search
      first: $first
    ) {
      edges {
        node {
          title
          collectionId
        }
      }
    }
  }
`;

export const CUSTOMER_LIST_ADMIN = gql`
  query CustomerListAdmin($domain: String!, $first: Int, $after: String!) {
    customerListAdmin(defaultDomain: $domain, first: $first, after: $after) {
      edges {
        node {
          id
          customerId
          fullName
          defaultAddress {
            country {
              name
            }
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
