import { gql } from '@apollo/client';

export const UPDATE_STORE_PROFILE = gql`
  mutation UpdateStoreProfile($input: StoreInput!, $defaultDomain: String!) {
    updateStoreProfile(input: $input, defaultDomain: $defaultDomain) {
      store {
        name
        email
        billingAddress {
          phone
        }
      }
    }
  }
`;

export const UPDATE_STORE_ADDRESS = gql`
  mutation UpdateStoreAddress($input: StoreAddressInput!, $defaultDomain: String!) {
    updateStoreAddress(input: $input, defaultDomain: $defaultDomain) {
      billingAddress {
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

export const UPDATE_STORE_CURRENCY = gql`
  mutation UpdateStoreProfile($input: StoreInput!, $defaultDomain: String!) {
    updateStoreProfile(input: $input, defaultDomain: $defaultDomain) {
      store {
        currencyCode
      }
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProductMutation($product: ProductInput!, $defaultDomain: String!) {
    createProduct(product: $product, defaultDomain: $defaultDomain) {
      product {
        id
        productId
      }
    }
  }
`;

export const CREATE_PRODUCT_VARIANT = gql`
  mutation CreateProductVariantMutation($productId: ID!,$variantInputs: ProductVariantInput!, $defaultDomain: String!) {
    createProductVariant(productId: $productId,variantInputs: $variantInputs, defaultDomain: $defaultDomain) {
      productVariant {
        id
      }
    }
  }
`;

export const UPDATE_PRODUCT_VARIANT = gql`
  mutation UpdateProductVariantMutation($variantInputs: ProductVariantInput!) {
    updateProductVariant(variantInputs: $variantInputs  ) {
      productVariant {
        variantId
      }
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation ProductSaveUpdate($id:ID! , $defaultDomain: String! , $product: ProductInput!) {
    updateProduct(id: $id ,defaultDomain: $defaultDomain , product: $product) {
      product {
        id
      }
    }
  }
`;

export const ADD_MEDIA_IMAGES_PRODUCT = gql`
  mutation AddMediaImagesProduct($defaultDomain: String!, $productId: ID!$imageIds: [ID]!) {
    addImagesProduct(defaultDomain: $defaultDomain ,productId: $productId,imageIds: $imageIds) {
      product {
        id
      }
    }
  }
`;

export const REMOVE_MEDIA_IMAGES_PRODUCT = gql`
  mutation RemoveMediaImagesProduct($defaultDomain: String!, $productId: ID!$imageIds: [ID]!) {
    removeImagesProduct(defaultDomain: $defaultDomain ,productId: $productId,imageIds: $imageIds) {
      product {
        id
    }
  }
}`;

export const PERFORM_ACTION_ON_VARIANTS = gql`
  mutation PerformActionOnVariants($action: VariantActions!, $variantIds: [ID!]!) {
    performActionOnVariants(action: $action, variantIds: $variantIds) {
      success
      message
      errors
    }
  }
`;

export const ADMIN_CREATE_COLLECTION = gql`
  mutation AdminCreateCollection($collectionInputs:CollectionInputs!,$domain: String!) {
    createCollection(collectionInputs:$collectionInputs,defaultDomain:$domain) {
      collection {
        collectionId
      }
    }
  }
`;

export const ADMIN_UPDATE_COLLECTION = gql`
  mutation UpdateCollection($collectionId: ID!$collectionInputs:CollectionInputs!, $domain: String!) {
    updateCollection(collectionId: $collectionId,collectionInputs:$collectionInputs ,defaultDomain:$domain) {
      collection {
        title
        description
        handle
        image {
          image
        }
        seo {
          title
          description
        }
      }
    }
  }
`;

export const ADD_PRODUCTS_TO_COLLECTION = gql`
  mutation AddProductsToCollection($collectionId : ID! $productIds: [ID]! $domain: String!) {
    addProductsToCollection(collectionId:$collectionId productIds:$productIds defaultDomain:$domain) {
      success
    }
  }
`;

export const DELETE_PRODUCTS_FROM_COLLECTION = gql`
  mutation DeleteProductsFromCollection($collectionId : ID! $productIds: [ID]! $domain: String!) {
    deleteProductsFromCollection(collectionId:$collectionId productIds:$productIds defaultDomain:$domain) {
      success
    }
  }
`;

export const DELETE_COLLECTIONS = gql`
  mutation AdminDeleteCollections($collectionIds: [ID]! $defaultDomain: String!) {
    deleteCollections(collectionIds:$collectionIds defaultDomain:$defaultDomain) {
      success
    }
  }
`;

export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($customerInputs: CustomerInputs!, $defaultDomain: String!) { 
    createCustomer(input: {customerInputs: $customerInputs, defaultDomain: $defaultDomain}) {
        customer {
            customerId
        }
    }
  }
`;

export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($customerInputs: CustomerInputs!, $id: ID!) { 
    updateCustomer(input: {customerInputs: $customerInputs, id: $id}) {
        customer {
            customerId
        }
    }
  }
`;

export const DELETE_CUSTOMER = gql`
  mutation DeleteCustomer($id: ID!) { 
    deleteCustomer(input: {id: $id}) {
        success
    }
  }
`;

export const VariantActions = Object.freeze({
  DELETE: "DELETE",
  UPDATE_PRICE: "UPDATE_PRICE",
});
