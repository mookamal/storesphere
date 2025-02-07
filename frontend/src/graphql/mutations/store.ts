import { gql } from '@apollo/client';
import { StoreInput } from '../types/store';

export interface UpdateStoreProfileVariables {
    input: StoreInput;
    defaultDomain: string;
  }

  export const UPDATE_STORE_PROFILE = gql`
  mutation UpdateStoreProfile($input: StoreInput!, $defaultDomain: String!) {
    updateStoreProfile(input: $input, defaultDomain: $defaultDomain) {
      store {
        name
      }
    }
  }
`;