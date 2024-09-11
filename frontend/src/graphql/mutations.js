export const UPDATE_STORE_PROFILE =`
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

export const UPDATE_STORE_ADDRESS =`
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

export const UPDATE_STORE_CURRENCY =`
  mutation UpdateStoreProfile($input: StoreInput!, $defaultDomain: String!) {
    updateStoreProfile(input: $input, defaultDomain: $defaultDomain) {
      store {
        currencyCode
      }
    }
  }
`;

export const CREATE_PRODUCT = `
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      product {
        productId
      }
    }
  }
`;
