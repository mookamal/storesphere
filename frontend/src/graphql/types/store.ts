import { CountryInput } from './country';

export interface StoreAddressInput {
  address1?: string;
  address2?: string;
  city?: string;
  country?: CountryInput;
  company?: string;
  phone?: string;
  provinceCode?: string;
  zip?: string;
}


export interface StoreInput {
  name?: string;
  email?: string;
  currencyCode?: string;
  billingAddress?: StoreAddressInput;
}