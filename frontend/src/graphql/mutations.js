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
