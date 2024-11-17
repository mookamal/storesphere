export const UPDATE_STORE_PROFILE = `
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

export const UPDATE_STORE_ADDRESS = `
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

export const UPDATE_STORE_CURRENCY = `
  mutation UpdateStoreProfile($input: StoreInput!, $defaultDomain: String!) {
    updateStoreProfile(input: $input, defaultDomain: $defaultDomain) {
      store {
        currencyCode
      }
    }
  }
`;

export const CREATE_PRODUCT = `
  mutation CreateProductMutation($product: ProductInput!, $defaultDomain: String!) {
    createProduct(input: {product: $product ,defaultDomain: $defaultDomain }) {
      product {
        id
        productId
      }
    }
  }
`;

export const CREATE_PRODUCT_VARIANT = `
    mutation CreateProductVariantMutation($productId: ID!,$variantInputs: ProductVariantInput!) {
      createProductVariant(productId: $productId,variantInputs: $variantInputs ) {
        productVariant {
          id
        }
      }
    }
  `;
export const UPDATE_PRODUCT_VARIANT = `
    mutation UpdateProductVariantMutation($variantId: ID!,$price: Decimal!) {
    updateProductVariant(variantId: $variantId,price: $price  ) {
      productVariant {
        variantId
      }
    }
  }
  `;
export const UPDATE_PRODUCT = `
  mutation ProductSaveUpdate($id:ID! , $defaultDomain: String! , $product: ProductInput!) {
  updateProduct(input: {id: $id ,defaultDomain: $defaultDomain , product: $product }) {
    product {
      id
    }
  }
}
`;

export const ADD_MEDIA_IMAGES_PRODUCT = `
mutation AddMediaImagesProduct($defaultDomain: String!, $productId: ID!$imageIds: [ID]!) {
  addImagesProduct(defaultDomain: $defaultDomain ,productId: $productId,imageIds: $imageIds) {
    product {
      id
    }
  }
}
`;

export const REMOVE_MEDIA_IMAGES_PRODUCT = `
  mutation RemoveMediaImagesProduct($defaultDomain: String!, $productId: ID!$imageIds: [ID]!) {
  removeImagesProduct(defaultDomain: $defaultDomain ,productId: $productId,imageIds: $imageIds) {
    product {
      id
    }
  }
}`;

export const PERFORM_ACTION_ON_VARIANTS = `
  mutation PerformActionOnVariants($action: VariantActions!, $variantIds: [ID!]!) {
    performActionOnVariants(action: $action, variantIds: $variantIds) {
      success
      message
      errors
    }
  }
`;

export const VariantActions = Object.freeze({
  DELETE: "DELETE",
  UPDATE_PRICE: "UPDATE_PRICE",
});
