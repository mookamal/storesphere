import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Decimal: { input: any; output: any; }
  EmailScalar: { input: any; output: any; }
  JSONString: { input: any; output: any; }
  PhoneNumberScalar: { input: any; output: any; }
};

/**
 * GraphQL mutation for adding images to a product.
 *
 * Handles adding images to a product's first variant.
 * Performs authentication and authorization checks.
 *
 * Attributes:
 *     product (graphene.Field): The product with the added images.
 *
 * Arguments:
 *     default_domain (str): Domain of the store where the product exists.
 *     product_id (graphene.ID): ID of the product to add images to.
 *     image_ids (graphene.List): IDs of the images to add.
 */
export type AddImagesProduct = {
  __typename?: 'AddImagesProduct';
  product?: Maybe<ProductNode>;
};

/**
 * GraphQL mutation for adding products to a collection.
 *
 * Handles the process of adding multiple products to a collection
 * with authentication and authorization checks.
 *
 * Attributes:
 *     success (graphene.Boolean): Indicates whether the products were added successfully.
 *
 * Arguments:
 *     collection_id (graphene.ID): ID of the collection to add products to.
 *     product_ids (list): IDs of the products to add.
 *     default_domain (str): Domain of the store.
 */
export type AddProductsToCollection = {
  __typename?: 'AddProductsToCollection';
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type AddressInputs = {
  address1?: InputMaybe<Scalars['String']['input']>;
  address2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<CountryInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
  phone?: InputMaybe<Scalars['PhoneNumberScalar']['input']>;
  provinceCode?: InputMaybe<Scalars['String']['input']>;
  zip?: InputMaybe<Scalars['String']['input']>;
};

export type AddressType = {
  __typename?: 'AddressType';
  address1?: Maybe<Scalars['String']['output']>;
  address2?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Country>;
  phone?: Maybe<Scalars['String']['output']>;
  provinceCode?: Maybe<Scalars['String']['output']>;
  zip?: Maybe<Scalars['String']['output']>;
};

/**
 * Input type for creating or updating product collections.
 *
 * Represents a collection of products with metadata and SEO information.
 *
 * Attributes:
 *     title (graphene.String): Required title of the collection.
 *     description (graphene.String): Optional description of the collection.
 *     handle (graphene.String): Optional URL-friendly identifier.
 *     image_id (graphene.ID): Optional ID of the collection's representative image.
 *     seo (SEOInput): Optional SEO metadata for the collection.
 */
export type CollectionInputs = {
  description?: InputMaybe<Scalars['String']['input']>;
  handle?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<ImageInput>;
  imageId?: InputMaybe<Scalars['ID']['input']>;
  seo?: InputMaybe<SeoInput>;
  title: Scalars['String']['input'];
};

/**
 * GraphQL node type representing a product collection.
 *
 * Converts the Collection Django model to a GraphQL node type.
 * Provides comprehensive information about product collections.
 *
 * Attributes:
 *     collection_id (graphene.Int): Unique identifier for the collection.
 *     seo (graphene.Field): SEO metadata for the collection.
 *     image (graphene.Field): Representative image for the collection.
 *     products_count (graphene.Int): Total number of products in the collection.
 */
export type CollectionNode = Node & {
  __typename?: 'CollectionNode';
  collectionId?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  handle?: Maybe<Scalars['String']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  image?: Maybe<ImageNode>;
  products: ProductNodeConnection;
  productsCount?: Maybe<Scalars['Int']['output']>;
  seo?: Maybe<SeoType>;
  title: Scalars['String']['output'];
};


/**
 * GraphQL node type representing a product collection.
 *
 * Converts the Collection Django model to a GraphQL node type.
 * Provides comprehensive information about product collections.
 *
 * Attributes:
 *     collection_id (graphene.Int): Unique identifier for the collection.
 *     seo (graphene.Field): SEO metadata for the collection.
 *     image (graphene.Field): Representative image for the collection.
 *     products_count (graphene.Int): Total number of products in the collection.
 */
export type CollectionNodeProductsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<ProductProductStatusChoices>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  title_Istartswith?: InputMaybe<Scalars['String']['input']>;
};

export type CollectionNodeConnection = {
  __typename?: 'CollectionNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<CollectionNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `CollectionNode` and its cursor. */
export type CollectionNodeEdge = {
  __typename?: 'CollectionNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<CollectionNode>;
};

export type Country = {
  __typename?: 'Country';
  /** ISO 3166-1 three character country code */
  alpha3?: Maybe<Scalars['String']['output']>;
  /** ISO 3166-1 two character country code */
  code?: Maybe<Scalars['String']['output']>;
  /** International Olympic Committee country code */
  iocCode?: Maybe<Scalars['String']['output']>;
  /** Country name */
  name?: Maybe<Scalars['String']['output']>;
  /** ISO 3166-1 numeric country code */
  numeric?: Maybe<Scalars['Int']['output']>;
};

export type CountryInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/**
 * GraphQL mutation for creating a new collection.
 *
 * Handles the process of creating a collection with its associated metadata.
 * Performs authentication and authorization checks.
 *
 * Attributes:
 *     collection (graphene.Field): The newly created collection.
 *
 * Arguments:
 *     default_domain (str): Domain of the store where the collection is being created.
 *     collection_inputs (CollectionInputs): Input data for creating the collection.
 */
export type CreateCollection = {
  __typename?: 'CreateCollection';
  collection?: Maybe<CollectionNode>;
};

export type CreateCustomerInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  customerInputs: CustomerInputs;
  defaultDomain: Scalars['String']['input'];
};

export type CreateCustomerPayload = {
  __typename?: 'CreateCustomerPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  customer?: Maybe<CustomerNode>;
};

/**
 * GraphQL mutation for creating a new product.
 *
 * Handles the process of creating a product with its first variant,
 * options, and associated metadata. Performs authentication and
 * authorization checks.
 *
 * Attributes:
 *     product (graphene.Field): The newly created product.
 *
 * Arguments:
 *     product (ProductInput): Input data for creating the product.
 *     default_domain (str): Domain of the store where the product is being created.
 */
export type CreateProduct = {
  __typename?: 'CreateProduct';
  product?: Maybe<ProductNode>;
};

/**
 * GraphQL mutation for creating a new product variant.
 *
 * Handles the process of adding a new variant to an existing product.
 * Performs authentication and authorization checks.
 *
 * Attributes:
 *     product_variant (graphene.Field): The newly created product variant.
 *
 * Arguments:
 *     product_id (graphene.ID): ID of the product to add the variant to.
 *     variant_inputs (ProductVariantInput): Input data for creating the variant.
 *     default_domain (str): Domain of the store where the variant is being created.
 */
export type CreateProductVariant = {
  __typename?: 'CreateProductVariant';
  productVariant?: Maybe<ProductVariantNode>;
};

export type CustomerInputs = {
  customerId?: InputMaybe<Scalars['ID']['input']>;
  defaultAddress?: InputMaybe<AddressInputs>;
  email?: InputMaybe<Scalars['EmailScalar']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
};

export type CustomerNode = Node & {
  __typename?: 'CustomerNode';
  createdAt: Scalars['DateTime']['output'];
  customerId?: Maybe<Scalars['Int']['output']>;
  defaultAddress?: Maybe<AddressType>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type CustomerNodeConnection = {
  __typename?: 'CustomerNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<CustomerNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `CustomerNode` and its cursor. */
export type CustomerNodeEdge = {
  __typename?: 'CustomerNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<CustomerNode>;
};

/**
 * GraphQL mutation for deleting multiple collections.
 *
 * Handles the process of deleting collections with authentication
 * and authorization checks.
 *
 * Attributes:
 *     success (graphene.Boolean): Indicates whether the deletion was successful.
 *
 * Arguments:
 *     collection_ids (list): IDs of the collections to delete.
 *     default_domain (str): Domain of the store.
 */
export type DeleteCollections = {
  __typename?: 'DeleteCollections';
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteCustomerInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type DeleteCustomerPayload = {
  __typename?: 'DeleteCustomerPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  customer?: Maybe<CustomerNode>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

/**
 * GraphQL mutation for removing products from a collection.
 *
 * Handles removing multiple products from a collection at once.
 * Performs authentication and authorization checks.
 *
 * Attributes:
 *     success (graphene.Boolean): Whether the removal was successful.
 *
 * Arguments:
 *     collection_id (graphene.ID): ID of the collection to remove products from.
 *     product_ids (graphene.List): IDs of the products to remove.
 *     default_domain (str): Domain of the store where the collection exists.
 */
export type DeleteProductsFromCollection = {
  __typename?: 'DeleteProductsFromCollection';
  success?: Maybe<Scalars['Boolean']['output']>;
};

/**
 * Input type for image fields.
 *
 * Represents an image with its URL and alternative text.
 *
 * Attributes:
 *     image (graphene.String): Required URL of the image.
 *     alt_text (graphene.String): Optional alternative text for the image.
 */
export type ImageInput = {
  /** Alternative text for the image. */
  altText?: InputMaybe<Scalars['String']['input']>;
  /** URL of the image. */
  image: Scalars['String']['input'];
  imageId?: InputMaybe<Scalars['ID']['input']>;
};

/**
 * GraphQL node type representing an image.
 *
 * Converts the Image Django model to a GraphQL node type.
 * Provides information about images associated with products or collections.
 *
 * Attributes:
 *     image_id (graphene.Int): Unique identifier for the image.
 */
export type ImageNode = Node & {
  __typename?: 'ImageNode';
  altText?: Maybe<Scalars['String']['output']>;
  collectionSet: CollectionNodeConnection;
  createdAt: Scalars['DateTime']['output'];
  /** The ID of the object */
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
  imageId?: Maybe<Scalars['Int']['output']>;
  products: ProductVariantNodeConnection;
};


/**
 * GraphQL node type representing an image.
 *
 * Converts the Image Django model to a GraphQL node type.
 * Provides information about images associated with products or collections.
 *
 * Attributes:
 *     image_id (graphene.Int): Unique identifier for the image.
 */
export type ImageNodeCollectionSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  title_Istartswith?: InputMaybe<Scalars['String']['input']>;
};


/**
 * GraphQL node type representing an image.
 *
 * Converts the Image Django model to a GraphQL node type.
 * Provides information about images associated with products or collections.
 *
 * Attributes:
 *     image_id (graphene.Int): Unique identifier for the image.
 */
export type ImageNodeProductsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type ImageNodeConnection = {
  __typename?: 'ImageNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ImageNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `ImageNode` and its cursor. */
export type ImageNodeEdge = {
  __typename?: 'ImageNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ImageNode>;
};

/** Represents amount of money in specific currency. */
export type Money = {
  __typename?: 'Money';
  /** Amount of money. */
  amount: Scalars['Float']['output'];
  /** Currency code. */
  currency: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /**
   * GraphQL mutation for adding images to a product.
   *
   * Handles adding images to a product's first variant.
   * Performs authentication and authorization checks.
   *
   * Attributes:
   *     product (graphene.Field): The product with the added images.
   *
   * Arguments:
   *     default_domain (str): Domain of the store where the product exists.
   *     product_id (graphene.ID): ID of the product to add images to.
   *     image_ids (graphene.List): IDs of the images to add.
   */
  addImagesProduct?: Maybe<AddImagesProduct>;
  /**
   * GraphQL mutation for adding products to a collection.
   *
   * Handles the process of adding multiple products to a collection
   * with authentication and authorization checks.
   *
   * Attributes:
   *     success (graphene.Boolean): Indicates whether the products were added successfully.
   *
   * Arguments:
   *     collection_id (graphene.ID): ID of the collection to add products to.
   *     product_ids (list): IDs of the products to add.
   *     default_domain (str): Domain of the store.
   */
  addProductsToCollection?: Maybe<AddProductsToCollection>;
  /**
   * GraphQL mutation for creating a new collection.
   *
   * Handles the process of creating a collection with its associated metadata.
   * Performs authentication and authorization checks.
   *
   * Attributes:
   *     collection (graphene.Field): The newly created collection.
   *
   * Arguments:
   *     default_domain (str): Domain of the store where the collection is being created.
   *     collection_inputs (CollectionInputs): Input data for creating the collection.
   */
  createCollection?: Maybe<CreateCollection>;
  createCustomer?: Maybe<CreateCustomerPayload>;
  /**
   * GraphQL mutation for creating a new product.
   *
   * Handles the process of creating a product with its first variant,
   * options, and associated metadata. Performs authentication and
   * authorization checks.
   *
   * Attributes:
   *     product (graphene.Field): The newly created product.
   *
   * Arguments:
   *     product (ProductInput): Input data for creating the product.
   *     default_domain (str): Domain of the store where the product is being created.
   */
  createProduct?: Maybe<CreateProduct>;
  /**
   * GraphQL mutation for creating a new product variant.
   *
   * Handles the process of adding a new variant to an existing product.
   * Performs authentication and authorization checks.
   *
   * Attributes:
   *     product_variant (graphene.Field): The newly created product variant.
   *
   * Arguments:
   *     product_id (graphene.ID): ID of the product to add the variant to.
   *     variant_inputs (ProductVariantInput): Input data for creating the variant.
   *     default_domain (str): Domain of the store where the variant is being created.
   */
  createProductVariant?: Maybe<CreateProductVariant>;
  /**
   * GraphQL mutation for deleting multiple collections.
   *
   * Handles the process of deleting collections with authentication
   * and authorization checks.
   *
   * Attributes:
   *     success (graphene.Boolean): Indicates whether the deletion was successful.
   *
   * Arguments:
   *     collection_ids (list): IDs of the collections to delete.
   *     default_domain (str): Domain of the store.
   */
  deleteCollections?: Maybe<DeleteCollections>;
  deleteCustomer?: Maybe<DeleteCustomerPayload>;
  /**
   * GraphQL mutation for removing products from a collection.
   *
   * Handles removing multiple products from a collection at once.
   * Performs authentication and authorization checks.
   *
   * Attributes:
   *     success (graphene.Boolean): Whether the removal was successful.
   *
   * Arguments:
   *     collection_id (graphene.ID): ID of the collection to remove products from.
   *     product_ids (graphene.List): IDs of the products to remove.
   *     default_domain (str): Domain of the store where the collection exists.
   */
  deleteProductsFromCollection?: Maybe<DeleteProductsFromCollection>;
  /**
   * GraphQL mutation for performing actions on product variants.
   *
   * Handles actions such as deleting variants.
   * Performs authentication and authorization checks.
   *
   * Attributes:
   *     success (graphene.Boolean): Whether the action was successful.
   *     message (graphene.String): A message describing the result of the action.
   *     errors (graphene.List): A list of error messages if the action failed.
   *
   * Arguments:
   *     action (VariantActions): The action to perform.
   *     variant_ids (graphene.List): IDs of the variants to perform the action on.
   *     default_domain (graphene.String): The domain of the store.
   */
  performActionOnVariants?: Maybe<PerformActionOnVariants>;
  /**
   * GraphQL mutation for removing images from a product.
   *
   * Handles removing images from a product's first variant.
   * Performs authentication and authorization checks.
   *
   * Attributes:
   *     product (graphene.Field): The product with the removed images.
   *
   * Arguments:
   *     default_domain (str): Domain of the store where the product exists.
   *     product_id (graphene.ID): ID of the product to remove images from.
   *     image_ids (graphene.List): IDs of the images to remove.
   */
  removeImagesProduct?: Maybe<RemoveImagesProduct>;
  /**
   * GraphQL mutation for updating an existing collection.
   *
   * Handles updating collection details and associated metadata.
   * Performs authentication and authorization checks.
   *
   * Attributes:
   *     collection (graphene.Field): The updated collection.
   *
   * Arguments:
   *     collection_id (graphene.ID): ID of the collection to update.
   *     collection_inputs (CollectionInputs): Input data for updating the collection.
   *     default_domain (str): Domain of the store where the collection exists.
   */
  updateCollection?: Maybe<UpdateCollection>;
  updateCustomer?: Maybe<UpdateCustomerPayload>;
  /**
   * GraphQL mutation for updating an existing product.
   *
   * Handles updating product details, variants, options, and metadata.
   * Performs authentication and authorization checks.
   *
   * Attributes:
   *     product (graphene.Field): The updated product.
   *
   * Arguments:
   *     id (graphene.ID): ID of the product to update.
   *     product (ProductInput): Input data for updating the product.
   *     default_domain (str): Domain of the store where the product exists.
   */
  updateProduct?: Maybe<UpdateProduct>;
  /**
   * GraphQL mutation for updating an existing product variant.
   *
   * Handles updating variant details and associated metadata.
   * Performs authentication and authorization checks.
   *
   * Attributes:
   *     product_variant (graphene.Field): The updated product variant.
   *
   * Arguments:
   *     variant_inputs (ProductVariantInput): Input data for updating the variant.
   *     default_domain (str): Domain of the store.
   */
  updateProductVariant?: Maybe<UpdateProductVariant>;
  updateStoreAddress?: Maybe<UpdateStoreAddress>;
  updateStoreProfile?: Maybe<UpdateStoreProfile>;
};


export type MutationAddImagesProductArgs = {
  defaultDomain: Scalars['String']['input'];
  imageIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  productId: Scalars['ID']['input'];
};


export type MutationAddProductsToCollectionArgs = {
  collectionId: Scalars['ID']['input'];
  defaultDomain: Scalars['String']['input'];
  productIds: Array<InputMaybe<Scalars['ID']['input']>>;
};


export type MutationCreateCollectionArgs = {
  collectionInputs: CollectionInputs;
  defaultDomain: Scalars['String']['input'];
};


export type MutationCreateCustomerArgs = {
  input: CreateCustomerInput;
};


export type MutationCreateProductArgs = {
  defaultDomain: Scalars['String']['input'];
  product: ProductInput;
};


export type MutationCreateProductVariantArgs = {
  defaultDomain: Scalars['String']['input'];
  productId: Scalars['ID']['input'];
  variantInputs: ProductVariantInput;
};


export type MutationDeleteCollectionsArgs = {
  collectionIds: Array<InputMaybe<Scalars['ID']['input']>>;
  defaultDomain: Scalars['String']['input'];
};


export type MutationDeleteCustomerArgs = {
  input: DeleteCustomerInput;
};


export type MutationDeleteProductsFromCollectionArgs = {
  collectionId: Scalars['ID']['input'];
  defaultDomain: Scalars['String']['input'];
  productIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


export type MutationPerformActionOnVariantsArgs = {
  action: VariantActions;
  defaultDomain: Scalars['String']['input'];
  variantIds: Array<InputMaybe<Scalars['ID']['input']>>;
};


export type MutationRemoveImagesProductArgs = {
  defaultDomain: Scalars['String']['input'];
  imageIds: Array<InputMaybe<Scalars['ID']['input']>>;
  productId: Scalars['ID']['input'];
};


export type MutationUpdateCollectionArgs = {
  collectionId: Scalars['ID']['input'];
  collectionInputs: CollectionInputs;
  defaultDomain: Scalars['String']['input'];
};


export type MutationUpdateCustomerArgs = {
  input: UpdateCustomerInput;
};


export type MutationUpdateProductArgs = {
  defaultDomain: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  product: ProductInput;
};


export type MutationUpdateProductVariantArgs = {
  defaultDomain: Scalars['String']['input'];
  variantInputs: ProductVariantInput;
};


export type MutationUpdateStoreAddressArgs = {
  defaultDomain: Scalars['String']['input'];
  input: StoreAddressInput;
};


export type MutationUpdateStoreProfileArgs = {
  defaultDomain: Scalars['String']['input'];
  input: StoreInput;
};

/** An object with an ID */
export type Node = {
  /** The ID of the object */
  id: Scalars['ID']['output'];
};

/**
 * Input type for creating or updating option values.
 *
 * Represents a single option value for a product, such as color or size.
 * Used in product variant and option configurations.
 *
 * Attributes:
 *     id (graphene.ID): Optional unique identifier for the option value.
 *     name (graphene.String): Required name of the option value.
 */
export type OptionValueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
};

/**
 * GraphQL object type representing an option value for a product.
 *
 * Converts the OptionValue Django model to a GraphQL type.
 * Used to represent specific values for product options like color or size.
 *
 * Attributes:
 *     id (graphene.ID): Unique identifier for the option value.
 *     name (graphene.String): Name of the option value.
 */
export type OptionValueType = {
  __typename?: 'OptionValueType';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

/**
 * GraphQL mutation for performing actions on product variants.
 *
 * Handles actions such as deleting variants.
 * Performs authentication and authorization checks.
 *
 * Attributes:
 *     success (graphene.Boolean): Whether the action was successful.
 *     message (graphene.String): A message describing the result of the action.
 *     errors (graphene.List): A list of error messages if the action failed.
 *
 * Arguments:
 *     action (VariantActions): The action to perform.
 *     variant_ids (graphene.List): IDs of the variants to perform the action on.
 *     default_domain (graphene.String): The domain of the store.
 */
export type PerformActionOnVariants = {
  __typename?: 'PerformActionOnVariants';
  errors?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

/**
 * Input type for creating or updating products.
 *
 * Comprehensive input for product details, including variants, options, and metadata.
 *
 * Attributes:
 *     title (graphene.String): Required title of the product.
 *     description (JSONString): Product description with support for rich text.
 *     status (graphene.String): Product status (e.g., draft, active).
 *     handle (graphene.String): URL-friendly product identifier.
 *     seo (SEOInput): Optional SEO metadata for the product.
 *     first_variant (ProductVariantInput): Required first product variant.
 *     options (graphene.List): Optional list of product options.
 *     collection_ids (graphene.List): Optional list of collection IDs the product belongs to.
 */
export type ProductInput = {
  collectionIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  /** Product description. */
  description?: InputMaybe<Scalars['JSONString']['input']>;
  firstVariant: ProductVariantInput;
  handle?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<Array<InputMaybe<ProductOptionInput>>>;
  seo?: InputMaybe<SeoInput>;
  status?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

/**
 * GraphQL node type representing a product.
 *
 * Converts the Product Django model to a GraphQL node type.
 * Provides comprehensive information about a product.
 *
 * Attributes:
 *     in_collection (graphene.Boolean): Indicates if the product is in a collection.
 *     product_id (graphene.Int): Unique identifier for the product.
 *     seo (graphene.Field): SEO metadata for the product.
 *     image (graphene.Field): Primary image for the product.
 *     first_variant (graphene.Field): First product variant.
 *     options (graphene.List): Product options.
 *     collections (graphene.List): Collections the product belongs to.
 *     description (JSONString): Detailed product description.
 */
export type ProductNode = Node & {
  __typename?: 'ProductNode';
  collections?: Maybe<Array<Maybe<CollectionNode>>>;
  createdAt: Scalars['DateTime']['output'];
  /** Description of the product. */
  description?: Maybe<Scalars['JSONString']['output']>;
  externalReference?: Maybe<Scalars['String']['output']>;
  firstVariant?: Maybe<ProductVariantNode>;
  handle?: Maybe<Scalars['String']['output']>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  image?: Maybe<ImageNode>;
  inCollection?: Maybe<Scalars['Boolean']['output']>;
  options?: Maybe<Array<Maybe<ProductOptionType>>>;
  productId?: Maybe<Scalars['Int']['output']>;
  seo?: Maybe<SeoType>;
  status: ProductProductStatusChoices;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  variants: ProductVariantNodeConnection;
};


/**
 * GraphQL node type representing a product.
 *
 * Converts the Product Django model to a GraphQL node type.
 * Provides comprehensive information about a product.
 *
 * Attributes:
 *     in_collection (graphene.Boolean): Indicates if the product is in a collection.
 *     product_id (graphene.Int): Unique identifier for the product.
 *     seo (graphene.Field): SEO metadata for the product.
 *     image (graphene.Field): Primary image for the product.
 *     first_variant (graphene.Field): First product variant.
 *     options (graphene.List): Product options.
 *     collections (graphene.List): Collections the product belongs to.
 *     description (JSONString): Detailed product description.
 */
export type ProductNodeVariantsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type ProductNodeConnection = {
  __typename?: 'ProductNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ProductNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `ProductNode` and its cursor. */
export type ProductNodeEdge = {
  __typename?: 'ProductNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ProductNode>;
};

/**
 * Input type for creating or updating product options.
 *
 * Represents a product option with its associated values, like 'Color' or 'Size'.
 *
 * Attributes:
 *     id (graphene.ID): Optional unique identifier for the product option.
 *     name (graphene.String): Required name of the product option.
 *     values (graphene.List): List of option values associated with this option.
 */
export type ProductOptionInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  values?: InputMaybe<Array<InputMaybe<OptionValueInput>>>;
};

/**
 * GraphQL object type representing a product option.
 *
 * Converts the ProductOption Django model to a GraphQL type.
 * Allows retrieving option details and associated values.
 *
 * Attributes:
 *     id (graphene.ID): Unique identifier for the product option.
 *     name (graphene.String): Name of the product option.
 *     values (graphene.List): List of option values associated with this option.
 */
export type ProductOptionType = {
  __typename?: 'ProductOptionType';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  values?: Maybe<Array<Maybe<OptionValueType>>>;
};

/** An enumeration. */
export enum ProductProductStatusChoices {
  /** ACTIVE */
  Active = 'ACTIVE',
  /** DRAFT */
  Draft = 'DRAFT'
}

/**
 * Input type for creating or updating product variants.
 *
 * Represents a specific variant of a product with its pricing and stock details.
 *
 * Attributes:
 *     variant_id (graphene.ID): Optional unique identifier for the variant.
 *     price (graphene.Decimal): Price of the product variant.
 *     compare_at_price (graphene.Decimal): Comparative price for marketing purposes.
 *     stock (graphene.Int): Available stock quantity.
 *     option_values (graphene.List): List of option value IDs for this variant.
 */
export type ProductVariantInput = {
  compareAtPrice?: InputMaybe<Scalars['Decimal']['input']>;
  optionValues?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  price?: InputMaybe<Scalars['Decimal']['input']>;
  stock?: InputMaybe<Scalars['Int']['input']>;
  variantId?: InputMaybe<Scalars['ID']['input']>;
};

/**
 * GraphQL node type representing a product variant.
 *
 * Converts the ProductVariant Django model to a GraphQL node type.
 * Provides detailed information about a specific product variant.
 *
 * Attributes:
 *     variant_id (graphene.Int): Unique identifier for the product variant.
 *     selected_options (graphene.List): List of selected option values for this variant.
 *     pricing (graphene.Field): Pricing information for the product variant.
 */
export type ProductVariantNode = Node & {
  __typename?: 'ProductVariantNode';
  compareAtPrice?: Maybe<Scalars['Decimal']['output']>;
  createdAt: Scalars['DateTime']['output'];
  externalReference?: Maybe<Scalars['String']['output']>;
  firstVariant?: Maybe<ProductNode>;
  /** The ID of the object */
  id: Scalars['ID']['output'];
  images: ImageNodeConnection;
  priceAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Price of the product variant. */
  pricing?: Maybe<Money>;
  product: ProductNode;
  selectedOptions?: Maybe<Array<Maybe<OptionValueType>>>;
  sku?: Maybe<Scalars['String']['output']>;
  sortOrder?: Maybe<Scalars['Int']['output']>;
  /** Available stock */
  stock: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  variantId?: Maybe<Scalars['Int']['output']>;
};


/**
 * GraphQL node type representing a product variant.
 *
 * Converts the ProductVariant Django model to a GraphQL node type.
 * Provides detailed information about a specific product variant.
 *
 * Attributes:
 *     variant_id (graphene.Int): Unique identifier for the product variant.
 *     selected_options (graphene.List): List of selected option values for this variant.
 *     pricing (graphene.Field): Pricing information for the product variant.
 */
export type ProductVariantNodeImagesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type ProductVariantNodeConnection = {
  __typename?: 'ProductVariantNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ProductVariantNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `ProductVariantNode` and its cursor. */
export type ProductVariantNodeEdge = {
  __typename?: 'ProductVariantNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<ProductVariantNode>;
};

export type Query = {
  __typename?: 'Query';
  allCollections?: Maybe<CollectionNodeConnection>;
  allMediaImages?: Maybe<ImageNodeConnection>;
  allProducts?: Maybe<ProductNodeConnection>;
  collectionById?: Maybe<CollectionNode>;
  collectionsFind?: Maybe<CollectionNodeConnection>;
  customerDetails?: Maybe<CustomerNode>;
  customerListAdmin?: Maybe<CustomerNodeConnection>;
  getImagesProduct?: Maybe<ImageNodeConnection>;
  product?: Maybe<ProductNode>;
  productDetailsVariants?: Maybe<ProductVariantNodeConnection>;
  productResourceCollection?: Maybe<ProductNodeConnection>;
  productsByCollection?: Maybe<ProductNodeConnection>;
  store?: Maybe<StoreType>;
};


export type QueryAllCollectionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  defaultDomain: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  title_Istartswith?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAllMediaImagesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  defaultDomain: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllProductsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  defaultDomain: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<ProductProductStatusChoices>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  title_Istartswith?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCollectionByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCollectionsFindArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  defaultDomain: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  title_Istartswith?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCustomerDetailsArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCustomerListAdminArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  defaultDomain: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryGetImagesProductArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  productId: Scalars['ID']['input'];
};


export type QueryProductArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductDetailsVariantsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  productId: Scalars['ID']['input'];
};


export type QueryProductResourceCollectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  collectionId: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<ProductProductStatusChoices>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  title_Istartswith?: InputMaybe<Scalars['String']['input']>;
};


export type QueryProductsByCollectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  collectionId: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<ProductProductStatusChoices>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  title_Istartswith?: InputMaybe<Scalars['String']['input']>;
};


export type QueryStoreArgs = {
  defaultDomain: Scalars['String']['input'];
};

/**
 * GraphQL mutation for removing images from a product.
 *
 * Handles removing images from a product's first variant.
 * Performs authentication and authorization checks.
 *
 * Attributes:
 *     product (graphene.Field): The product with the removed images.
 *
 * Arguments:
 *     default_domain (str): Domain of the store where the product exists.
 *     product_id (graphene.ID): ID of the product to remove images from.
 *     image_ids (graphene.List): IDs of the images to remove.
 */
export type RemoveImagesProduct = {
  __typename?: 'RemoveImagesProduct';
  product?: Maybe<ProductNode>;
};

/**
 * Input type for Search Engine Optimization (SEO) metadata.
 *
 * Used to provide SEO-related information for products and collections.
 *
 * Attributes:
 *     title (graphene.String): Optional SEO title.
 *     description (graphene.String): Optional SEO description.
 */
export type SeoInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

/**
 * GraphQL object type representing Search Engine Optimization (SEO) metadata.
 *
 * Converts the SEO Django model to a GraphQL type.
 * Used to provide SEO-related information for products and collections.
 *
 * Attributes:
 *     title (graphene.String): SEO title.
 *     description (graphene.String): SEO description.
 */
export type SeoType = {
  __typename?: 'SEOType';
  description?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type StoreAddressInput = {
  address1?: InputMaybe<Scalars['String']['input']>;
  address2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<CountryInput>;
  phone?: InputMaybe<Scalars['String']['input']>;
  provinceCode?: InputMaybe<Scalars['String']['input']>;
  zip?: InputMaybe<Scalars['String']['input']>;
};

export type StoreAddressType = {
  __typename?: 'StoreAddressType';
  address1?: Maybe<Scalars['String']['output']>;
  address2?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Country>;
  phone?: Maybe<Scalars['String']['output']>;
  provinceCode?: Maybe<Scalars['String']['output']>;
  zip?: Maybe<Scalars['String']['output']>;
};

export type StoreInput = {
  billingAddress?: InputMaybe<StoreAddressInput>;
  currencyCode?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type StoreType = {
  __typename?: 'StoreType';
  billingAddress?: Maybe<StoreAddressType>;
  collections: CollectionNodeConnection;
  currencyCode: Scalars['String']['output'];
  customers: CustomerNodeConnection;
  defaultDomain: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  enabledPresentmentCurrencies?: Maybe<Scalars['JSONString']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  productImages: ImageNodeConnection;
  products: ProductNodeConnection;
};


export type StoreTypeCollectionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  title_Istartswith?: InputMaybe<Scalars['String']['input']>;
};


export type StoreTypeCustomersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};


export type StoreTypeProductImagesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type StoreTypeProductsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<ProductProductStatusChoices>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  title_Istartswith?: InputMaybe<Scalars['String']['input']>;
};

/**
 * GraphQL mutation for updating an existing collection.
 *
 * Handles updating collection details and associated metadata.
 * Performs authentication and authorization checks.
 *
 * Attributes:
 *     collection (graphene.Field): The updated collection.
 *
 * Arguments:
 *     collection_id (graphene.ID): ID of the collection to update.
 *     collection_inputs (CollectionInputs): Input data for updating the collection.
 *     default_domain (str): Domain of the store where the collection exists.
 */
export type UpdateCollection = {
  __typename?: 'UpdateCollection';
  collection?: Maybe<CollectionNode>;
};

export type UpdateCustomerInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  customerInputs: CustomerInputs;
  id: Scalars['ID']['input'];
};

export type UpdateCustomerPayload = {
  __typename?: 'UpdateCustomerPayload';
  clientMutationId?: Maybe<Scalars['String']['output']>;
  customer?: Maybe<CustomerNode>;
};

/**
 * GraphQL mutation for updating an existing product.
 *
 * Handles updating product details, variants, options, and metadata.
 * Performs authentication and authorization checks.
 *
 * Attributes:
 *     product (graphene.Field): The updated product.
 *
 * Arguments:
 *     id (graphene.ID): ID of the product to update.
 *     product (ProductInput): Input data for updating the product.
 *     default_domain (str): Domain of the store where the product exists.
 */
export type UpdateProduct = {
  __typename?: 'UpdateProduct';
  product?: Maybe<ProductNode>;
};

/**
 * GraphQL mutation for updating an existing product variant.
 *
 * Handles updating variant details and associated metadata.
 * Performs authentication and authorization checks.
 *
 * Attributes:
 *     product_variant (graphene.Field): The updated product variant.
 *
 * Arguments:
 *     variant_inputs (ProductVariantInput): Input data for updating the variant.
 *     default_domain (str): Domain of the store.
 */
export type UpdateProductVariant = {
  __typename?: 'UpdateProductVariant';
  productVariant?: Maybe<ProductVariantNode>;
};

export type UpdateStoreAddress = {
  __typename?: 'UpdateStoreAddress';
  billingAddress?: Maybe<StoreAddressType>;
};

export type UpdateStoreProfile = {
  __typename?: 'UpdateStoreProfile';
  store?: Maybe<StoreType>;
};

/** Enum for actions that can be performed on product variants. */
export enum VariantActions {
  Delete = 'DELETE',
  UpdatePrice = 'UPDATE_PRICE'
}

export type UpdateStoreProfileMutationVariables = Exact<{
  input: StoreInput;
  defaultDomain: Scalars['String']['input'];
}>;


export type UpdateStoreProfileMutation = { __typename?: 'Mutation', updateStoreProfile?: { __typename?: 'UpdateStoreProfile', store?: { __typename?: 'StoreType', name: string, email?: string | null, billingAddress?: { __typename?: 'StoreAddressType', phone?: string | null } | null } | null } | null };

export type UpdateStoreAddressMutationVariables = Exact<{
  input: StoreAddressInput;
  defaultDomain: Scalars['String']['input'];
}>;


export type UpdateStoreAddressMutation = { __typename?: 'Mutation', updateStoreAddress?: { __typename?: 'UpdateStoreAddress', billingAddress?: { __typename?: 'StoreAddressType', address1?: string | null, address2?: string | null, city?: string | null, company?: string | null, zip?: string | null, country?: { __typename?: 'Country', name?: string | null, code?: string | null } | null } | null } | null };

export type CreateProductMutationMutationVariables = Exact<{
  product: ProductInput;
  defaultDomain: Scalars['String']['input'];
}>;


export type CreateProductMutationMutation = { __typename?: 'Mutation', createProduct?: { __typename?: 'CreateProduct', product?: { __typename?: 'ProductNode', id: string, productId?: number | null } | null } | null };

export type CreateProductVariantMutationVariables = Exact<{
  productId: Scalars['ID']['input'];
  variantInputs: ProductVariantInput;
  defaultDomain: Scalars['String']['input'];
}>;


export type CreateProductVariantMutation = { __typename?: 'Mutation', createProductVariant?: { __typename?: 'CreateProductVariant', productVariant?: { __typename?: 'ProductVariantNode', id: string } | null } | null };

export type UpdateProductVariantMutationVariables = Exact<{
  variantInputs: ProductVariantInput;
  defaultDomain: Scalars['String']['input'];
}>;


export type UpdateProductVariantMutation = { __typename?: 'Mutation', updateProductVariant?: { __typename?: 'UpdateProductVariant', productVariant?: { __typename?: 'ProductVariantNode', variantId?: number | null } | null } | null };

export type ProductSaveUpdateMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  defaultDomain: Scalars['String']['input'];
  product: ProductInput;
}>;


export type ProductSaveUpdateMutation = { __typename?: 'Mutation', updateProduct?: { __typename?: 'UpdateProduct', product?: { __typename?: 'ProductNode', id: string } | null } | null };

export type AddMediaImagesProductMutationVariables = Exact<{
  defaultDomain: Scalars['String']['input'];
  productId: Scalars['ID']['input'];
  imageIds: Array<InputMaybe<Scalars['ID']['input']>> | InputMaybe<Scalars['ID']['input']>;
}>;


export type AddMediaImagesProductMutation = { __typename?: 'Mutation', addImagesProduct?: { __typename?: 'AddImagesProduct', product?: { __typename?: 'ProductNode', id: string } | null } | null };

export type RemoveMediaImagesProductMutationVariables = Exact<{
  defaultDomain: Scalars['String']['input'];
  productId: Scalars['ID']['input'];
  imageIds: Array<InputMaybe<Scalars['ID']['input']>> | InputMaybe<Scalars['ID']['input']>;
}>;


export type RemoveMediaImagesProductMutation = { __typename?: 'Mutation', removeImagesProduct?: { __typename?: 'RemoveImagesProduct', product?: { __typename?: 'ProductNode', id: string } | null } | null };

export type PerformActionOnVariantsMutationVariables = Exact<{
  action: VariantActions;
  variantIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  defaultDomain: Scalars['String']['input'];
}>;


export type PerformActionOnVariantsMutation = { __typename?: 'Mutation', performActionOnVariants?: { __typename?: 'PerformActionOnVariants', success?: boolean | null, message?: string | null, errors?: Array<string | null> | null } | null };

export type AdminCreateCollectionMutationVariables = Exact<{
  collectionInputs: CollectionInputs;
  domain: Scalars['String']['input'];
}>;


export type AdminCreateCollectionMutation = { __typename?: 'Mutation', createCollection?: { __typename?: 'CreateCollection', collection?: { __typename?: 'CollectionNode', collectionId?: number | null } | null } | null };

export type UpdateCollectionMutationVariables = Exact<{
  collectionId: Scalars['ID']['input'];
  collectionInputs: CollectionInputs;
  domain: Scalars['String']['input'];
}>;


export type UpdateCollectionMutation = { __typename?: 'Mutation', updateCollection?: { __typename?: 'UpdateCollection', collection?: { __typename?: 'CollectionNode', title: string, description?: string | null, handle?: string | null, image?: { __typename?: 'ImageNode', image: string } | null, seo?: { __typename?: 'SEOType', title?: string | null, description?: string | null } | null } | null } | null };

export type AddProductsToCollectionMutationVariables = Exact<{
  collectionId: Scalars['ID']['input'];
  productIds: Array<InputMaybe<Scalars['ID']['input']>> | InputMaybe<Scalars['ID']['input']>;
  domain: Scalars['String']['input'];
}>;


export type AddProductsToCollectionMutation = { __typename?: 'Mutation', addProductsToCollection?: { __typename?: 'AddProductsToCollection', success?: boolean | null } | null };

export type DeleteProductsFromCollectionMutationVariables = Exact<{
  collectionId: Scalars['ID']['input'];
  productIds: Array<InputMaybe<Scalars['ID']['input']>> | InputMaybe<Scalars['ID']['input']>;
  domain: Scalars['String']['input'];
}>;


export type DeleteProductsFromCollectionMutation = { __typename?: 'Mutation', deleteProductsFromCollection?: { __typename?: 'DeleteProductsFromCollection', success?: boolean | null } | null };

export type AdminDeleteCollectionsMutationVariables = Exact<{
  collectionIds: Array<InputMaybe<Scalars['ID']['input']>> | InputMaybe<Scalars['ID']['input']>;
  domain: Scalars['String']['input'];
}>;


export type AdminDeleteCollectionsMutation = { __typename?: 'Mutation', deleteCollections?: { __typename?: 'DeleteCollections', success?: boolean | null } | null };

export type CreateCustomerMutationVariables = Exact<{
  customerInputs: CustomerInputs;
  defaultDomain: Scalars['String']['input'];
}>;


export type CreateCustomerMutation = { __typename?: 'Mutation', createCustomer?: { __typename?: 'CreateCustomerPayload', customer?: { __typename?: 'CustomerNode', customerId?: number | null } | null } | null };

export type UpdateCustomerMutationVariables = Exact<{
  customerInputs: CustomerInputs;
  id: Scalars['ID']['input'];
}>;


export type UpdateCustomerMutation = { __typename?: 'Mutation', updateCustomer?: { __typename?: 'UpdateCustomerPayload', customer?: { __typename?: 'CustomerNode', customerId?: number | null } | null } | null };

export type DeleteCustomerMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCustomerMutation = { __typename?: 'Mutation', deleteCustomer?: { __typename?: 'DeleteCustomerPayload', success?: boolean | null } | null };

export type SettingsGeneralQueryVariables = Exact<{
  domain: Scalars['String']['input'];
}>;


export type SettingsGeneralQuery = { __typename?: 'Query', store?: { __typename?: 'StoreType', name: string, email?: string | null, currencyCode: string, billingAddress?: { __typename?: 'StoreAddressType', phone?: string | null, address1?: string | null, address2?: string | null, city?: string | null, company?: string | null, zip?: string | null, country?: { __typename?: 'Country', name?: string | null, code?: string | null } | null } | null } | null };

export type ProductIndexQueryVariables = Exact<{
  domain: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  after: Scalars['String']['input'];
  search: Scalars['String']['input'];
  status?: InputMaybe<ProductProductStatusChoices>;
}>;


export type ProductIndexQuery = { __typename?: 'Query', allProducts?: { __typename?: 'ProductNodeConnection', edges: Array<{ __typename?: 'ProductNodeEdge', node?: { __typename?: 'ProductNode', id: string, title: string, status: ProductProductStatusChoices, productId?: number | null, image?: { __typename?: 'ImageNode', image: string } | null } | null } | null>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean } } | null };

export type GetProductByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProductByIdQuery = { __typename?: 'Query', product?: { __typename?: 'ProductNode', title: string, description?: any | null, status: ProductProductStatusChoices, handle?: string | null, collections?: Array<{ __typename?: 'CollectionNode', title: string, collectionId?: number | null } | null> | null, seo?: { __typename?: 'SEOType', title?: string | null, description?: string | null } | null, firstVariant?: { __typename?: 'ProductVariantNode', compareAtPrice?: any | null, stock: number, pricing?: { __typename?: 'Money', amount: number, currency: string } | null } | null, options?: Array<{ __typename?: 'ProductOptionType', id: string, name: string, values?: Array<{ __typename?: 'OptionValueType', id: string, name: string } | null> | null } | null> | null } | null };

export type GetMediaImagesQueryVariables = Exact<{
  domain: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  after: Scalars['String']['input'];
}>;


export type GetMediaImagesQuery = { __typename?: 'Query', allMediaImages?: { __typename?: 'ImageNodeConnection', edges: Array<{ __typename?: 'ImageNodeEdge', node?: { __typename?: 'ImageNode', image: string, id: string, imageId?: number | null } | null } | null>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean } } | null };

export type GetMediaProductQueryVariables = Exact<{
  productId: Scalars['ID']['input'];
  after: Scalars['String']['input'];
}>;


export type GetMediaProductQuery = { __typename?: 'Query', getImagesProduct?: { __typename?: 'ImageNodeConnection', edges: Array<{ __typename?: 'ImageNodeEdge', node?: { __typename?: 'ImageNode', image: string, id: string, imageId?: number | null } | null } | null>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean } } | null };

export type AdminProductDetailsVariantsQueryVariables = Exact<{
  productId: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  after: Scalars['String']['input'];
}>;


export type AdminProductDetailsVariantsQuery = { __typename?: 'Query', productDetailsVariants?: { __typename?: 'ProductVariantNodeConnection', edges: Array<{ __typename?: 'ProductVariantNodeEdge', node?: { __typename?: 'ProductVariantNode', id: string, variantId?: number | null, stock: number, pricing?: { __typename?: 'Money', amount: number, currency: string } | null, selectedOptions?: Array<{ __typename?: 'OptionValueType', id: string, name: string } | null> | null } | null } | null>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean } } | null };

export type AdminCollectionsListQueryVariables = Exact<{
  domain: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  after: Scalars['String']['input'];
}>;


export type AdminCollectionsListQuery = { __typename?: 'Query', allCollections?: { __typename?: 'CollectionNodeConnection', edges: Array<{ __typename?: 'CollectionNodeEdge', node?: { __typename?: 'CollectionNode', id: string, collectionId?: number | null, title: string, description?: string | null, productsCount?: number | null, image?: { __typename?: 'ImageNode', image: string } | null, seo?: { __typename?: 'SEOType', title?: string | null, description?: string | null } | null } | null } | null>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean } } | null };

export type AdminCollectionByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AdminCollectionByIdQuery = { __typename?: 'Query', collectionById?: { __typename?: 'CollectionNode', collectionId?: number | null, title: string, description?: string | null, productsCount?: number | null, handle?: string | null, seo?: { __typename?: 'SEOType', title?: string | null, description?: string | null } | null, image?: { __typename?: 'ImageNode', image: string, imageId?: number | null } | null } | null };

export type AdminProductsByCollectionQueryVariables = Exact<{
  collectionId: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  after: Scalars['String']['input'];
}>;


export type AdminProductsByCollectionQuery = { __typename?: 'Query', productsByCollection?: { __typename?: 'ProductNodeConnection', edges: Array<{ __typename?: 'ProductNodeEdge', node?: { __typename?: 'ProductNode', id: string, productId?: number | null, title: string, status: ProductProductStatusChoices } | null } | null>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean } } | null };

export type AdminProductResourceCollectionQueryVariables = Exact<{
  collectionId: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  after: Scalars['String']['input'];
  search: Scalars['String']['input'];
}>;


export type AdminProductResourceCollectionQuery = { __typename?: 'Query', productResourceCollection?: { __typename?: 'ProductNodeConnection', edges: Array<{ __typename?: 'ProductNodeEdge', node?: { __typename?: 'ProductNode', id: string, productId?: number | null, title: string, inCollection?: boolean | null } | null } | null> } | null };

export type AdminCollectionsFindQueryVariables = Exact<{
  domain: Scalars['String']['input'];
  search: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AdminCollectionsFindQuery = { __typename?: 'Query', collectionsFind?: { __typename?: 'CollectionNodeConnection', edges: Array<{ __typename?: 'CollectionNodeEdge', node?: { __typename?: 'CollectionNode', id: string, title: string, collectionId?: number | null } | null } | null> } | null };

export type CustomerListAdminQueryVariables = Exact<{
  domain: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  after: Scalars['String']['input'];
}>;


export type CustomerListAdminQuery = { __typename?: 'Query', customerListAdmin?: { __typename?: 'CustomerNodeConnection', edges: Array<{ __typename?: 'CustomerNodeEdge', node?: { __typename?: 'CustomerNode', id: string, customerId?: number | null, fullName?: string | null, defaultAddress?: { __typename?: 'AddressType', country?: { __typename?: 'Country', name?: string | null } | null } | null } | null } | null>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean } } | null };

export type CustomerDetailsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CustomerDetailsQuery = { __typename?: 'Query', customerDetails?: { __typename?: 'CustomerNode', firstName?: string | null, lastName?: string | null, email?: string | null, defaultAddress?: { __typename?: 'AddressType', address1?: string | null, address2?: string | null, city?: string | null, phone?: string | null, company?: string | null, zip?: string | null, country?: { __typename?: 'Country', name?: string | null, code?: string | null } | null } | null } | null };


export const UpdateStoreProfileDocument = gql`
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
export type UpdateStoreProfileMutationFn = Apollo.MutationFunction<UpdateStoreProfileMutation, UpdateStoreProfileMutationVariables>;

/**
 * __useUpdateStoreProfileMutation__
 *
 * To run a mutation, you first call `useUpdateStoreProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStoreProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStoreProfileMutation, { data, loading, error }] = useUpdateStoreProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *      defaultDomain: // value for 'defaultDomain'
 *   },
 * });
 */
export function useUpdateStoreProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStoreProfileMutation, UpdateStoreProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateStoreProfileMutation, UpdateStoreProfileMutationVariables>(UpdateStoreProfileDocument, options);
      }
export type UpdateStoreProfileMutationHookResult = ReturnType<typeof useUpdateStoreProfileMutation>;
export type UpdateStoreProfileMutationResult = Apollo.MutationResult<UpdateStoreProfileMutation>;
export type UpdateStoreProfileMutationOptions = Apollo.BaseMutationOptions<UpdateStoreProfileMutation, UpdateStoreProfileMutationVariables>;
export const UpdateStoreAddressDocument = gql`
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
export type UpdateStoreAddressMutationFn = Apollo.MutationFunction<UpdateStoreAddressMutation, UpdateStoreAddressMutationVariables>;

/**
 * __useUpdateStoreAddressMutation__
 *
 * To run a mutation, you first call `useUpdateStoreAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStoreAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStoreAddressMutation, { data, loading, error }] = useUpdateStoreAddressMutation({
 *   variables: {
 *      input: // value for 'input'
 *      defaultDomain: // value for 'defaultDomain'
 *   },
 * });
 */
export function useUpdateStoreAddressMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStoreAddressMutation, UpdateStoreAddressMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateStoreAddressMutation, UpdateStoreAddressMutationVariables>(UpdateStoreAddressDocument, options);
      }
export type UpdateStoreAddressMutationHookResult = ReturnType<typeof useUpdateStoreAddressMutation>;
export type UpdateStoreAddressMutationResult = Apollo.MutationResult<UpdateStoreAddressMutation>;
export type UpdateStoreAddressMutationOptions = Apollo.BaseMutationOptions<UpdateStoreAddressMutation, UpdateStoreAddressMutationVariables>;
export const CreateProductMutationDocument = gql`
    mutation CreateProductMutation($product: ProductInput!, $defaultDomain: String!) {
  createProduct(product: $product, defaultDomain: $defaultDomain) {
    product {
      id
      productId
    }
  }
}
    `;
export type CreateProductMutationMutationFn = Apollo.MutationFunction<CreateProductMutationMutation, CreateProductMutationMutationVariables>;

/**
 * __useCreateProductMutationMutation__
 *
 * To run a mutation, you first call `useCreateProductMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProductMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProductMutationMutation, { data, loading, error }] = useCreateProductMutationMutation({
 *   variables: {
 *      product: // value for 'product'
 *      defaultDomain: // value for 'defaultDomain'
 *   },
 * });
 */
export function useCreateProductMutationMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductMutationMutation, CreateProductMutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductMutationMutation, CreateProductMutationMutationVariables>(CreateProductMutationDocument, options);
      }
export type CreateProductMutationMutationHookResult = ReturnType<typeof useCreateProductMutationMutation>;
export type CreateProductMutationMutationResult = Apollo.MutationResult<CreateProductMutationMutation>;
export type CreateProductMutationMutationOptions = Apollo.BaseMutationOptions<CreateProductMutationMutation, CreateProductMutationMutationVariables>;
export const CreateProductVariantDocument = gql`
    mutation CreateProductVariant($productId: ID!, $variantInputs: ProductVariantInput!, $defaultDomain: String!) {
  createProductVariant(
    productId: $productId
    variantInputs: $variantInputs
    defaultDomain: $defaultDomain
  ) {
    productVariant {
      id
    }
  }
}
    `;
export type CreateProductVariantMutationFn = Apollo.MutationFunction<CreateProductVariantMutation, CreateProductVariantMutationVariables>;

/**
 * __useCreateProductVariantMutation__
 *
 * To run a mutation, you first call `useCreateProductVariantMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProductVariantMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProductVariantMutation, { data, loading, error }] = useCreateProductVariantMutation({
 *   variables: {
 *      productId: // value for 'productId'
 *      variantInputs: // value for 'variantInputs'
 *      defaultDomain: // value for 'defaultDomain'
 *   },
 * });
 */
export function useCreateProductVariantMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductVariantMutation, CreateProductVariantMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductVariantMutation, CreateProductVariantMutationVariables>(CreateProductVariantDocument, options);
      }
export type CreateProductVariantMutationHookResult = ReturnType<typeof useCreateProductVariantMutation>;
export type CreateProductVariantMutationResult = Apollo.MutationResult<CreateProductVariantMutation>;
export type CreateProductVariantMutationOptions = Apollo.BaseMutationOptions<CreateProductVariantMutation, CreateProductVariantMutationVariables>;
export const UpdateProductVariantDocument = gql`
    mutation UpdateProductVariant($variantInputs: ProductVariantInput!, $defaultDomain: String!) {
  updateProductVariant(
    variantInputs: $variantInputs
    defaultDomain: $defaultDomain
  ) {
    productVariant {
      variantId
    }
  }
}
    `;
export type UpdateProductVariantMutationFn = Apollo.MutationFunction<UpdateProductVariantMutation, UpdateProductVariantMutationVariables>;

/**
 * __useUpdateProductVariantMutation__
 *
 * To run a mutation, you first call `useUpdateProductVariantMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductVariantMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductVariantMutation, { data, loading, error }] = useUpdateProductVariantMutation({
 *   variables: {
 *      variantInputs: // value for 'variantInputs'
 *      defaultDomain: // value for 'defaultDomain'
 *   },
 * });
 */
export function useUpdateProductVariantMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductVariantMutation, UpdateProductVariantMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductVariantMutation, UpdateProductVariantMutationVariables>(UpdateProductVariantDocument, options);
      }
export type UpdateProductVariantMutationHookResult = ReturnType<typeof useUpdateProductVariantMutation>;
export type UpdateProductVariantMutationResult = Apollo.MutationResult<UpdateProductVariantMutation>;
export type UpdateProductVariantMutationOptions = Apollo.BaseMutationOptions<UpdateProductVariantMutation, UpdateProductVariantMutationVariables>;
export const ProductSaveUpdateDocument = gql`
    mutation ProductSaveUpdate($id: ID!, $defaultDomain: String!, $product: ProductInput!) {
  updateProduct(id: $id, defaultDomain: $defaultDomain, product: $product) {
    product {
      id
    }
  }
}
    `;
export type ProductSaveUpdateMutationFn = Apollo.MutationFunction<ProductSaveUpdateMutation, ProductSaveUpdateMutationVariables>;

/**
 * __useProductSaveUpdateMutation__
 *
 * To run a mutation, you first call `useProductSaveUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProductSaveUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [productSaveUpdateMutation, { data, loading, error }] = useProductSaveUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      defaultDomain: // value for 'defaultDomain'
 *      product: // value for 'product'
 *   },
 * });
 */
export function useProductSaveUpdateMutation(baseOptions?: Apollo.MutationHookOptions<ProductSaveUpdateMutation, ProductSaveUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ProductSaveUpdateMutation, ProductSaveUpdateMutationVariables>(ProductSaveUpdateDocument, options);
      }
export type ProductSaveUpdateMutationHookResult = ReturnType<typeof useProductSaveUpdateMutation>;
export type ProductSaveUpdateMutationResult = Apollo.MutationResult<ProductSaveUpdateMutation>;
export type ProductSaveUpdateMutationOptions = Apollo.BaseMutationOptions<ProductSaveUpdateMutation, ProductSaveUpdateMutationVariables>;
export const AddMediaImagesProductDocument = gql`
    mutation AddMediaImagesProduct($defaultDomain: String!, $productId: ID!, $imageIds: [ID]!) {
  addImagesProduct(
    defaultDomain: $defaultDomain
    productId: $productId
    imageIds: $imageIds
  ) {
    product {
      id
    }
  }
}
    `;
export type AddMediaImagesProductMutationFn = Apollo.MutationFunction<AddMediaImagesProductMutation, AddMediaImagesProductMutationVariables>;

/**
 * __useAddMediaImagesProductMutation__
 *
 * To run a mutation, you first call `useAddMediaImagesProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddMediaImagesProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addMediaImagesProductMutation, { data, loading, error }] = useAddMediaImagesProductMutation({
 *   variables: {
 *      defaultDomain: // value for 'defaultDomain'
 *      productId: // value for 'productId'
 *      imageIds: // value for 'imageIds'
 *   },
 * });
 */
export function useAddMediaImagesProductMutation(baseOptions?: Apollo.MutationHookOptions<AddMediaImagesProductMutation, AddMediaImagesProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddMediaImagesProductMutation, AddMediaImagesProductMutationVariables>(AddMediaImagesProductDocument, options);
      }
export type AddMediaImagesProductMutationHookResult = ReturnType<typeof useAddMediaImagesProductMutation>;
export type AddMediaImagesProductMutationResult = Apollo.MutationResult<AddMediaImagesProductMutation>;
export type AddMediaImagesProductMutationOptions = Apollo.BaseMutationOptions<AddMediaImagesProductMutation, AddMediaImagesProductMutationVariables>;
export const RemoveMediaImagesProductDocument = gql`
    mutation RemoveMediaImagesProduct($defaultDomain: String!, $productId: ID!, $imageIds: [ID]!) {
  removeImagesProduct(
    defaultDomain: $defaultDomain
    productId: $productId
    imageIds: $imageIds
  ) {
    product {
      id
    }
  }
}
    `;
export type RemoveMediaImagesProductMutationFn = Apollo.MutationFunction<RemoveMediaImagesProductMutation, RemoveMediaImagesProductMutationVariables>;

/**
 * __useRemoveMediaImagesProductMutation__
 *
 * To run a mutation, you first call `useRemoveMediaImagesProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveMediaImagesProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeMediaImagesProductMutation, { data, loading, error }] = useRemoveMediaImagesProductMutation({
 *   variables: {
 *      defaultDomain: // value for 'defaultDomain'
 *      productId: // value for 'productId'
 *      imageIds: // value for 'imageIds'
 *   },
 * });
 */
export function useRemoveMediaImagesProductMutation(baseOptions?: Apollo.MutationHookOptions<RemoveMediaImagesProductMutation, RemoveMediaImagesProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveMediaImagesProductMutation, RemoveMediaImagesProductMutationVariables>(RemoveMediaImagesProductDocument, options);
      }
export type RemoveMediaImagesProductMutationHookResult = ReturnType<typeof useRemoveMediaImagesProductMutation>;
export type RemoveMediaImagesProductMutationResult = Apollo.MutationResult<RemoveMediaImagesProductMutation>;
export type RemoveMediaImagesProductMutationOptions = Apollo.BaseMutationOptions<RemoveMediaImagesProductMutation, RemoveMediaImagesProductMutationVariables>;
export const PerformActionOnVariantsDocument = gql`
    mutation PerformActionOnVariants($action: VariantActions!, $variantIds: [ID!]!, $defaultDomain: String!) {
  performActionOnVariants(
    action: $action
    variantIds: $variantIds
    defaultDomain: $defaultDomain
  ) {
    success
    message
    errors
  }
}
    `;
export type PerformActionOnVariantsMutationFn = Apollo.MutationFunction<PerformActionOnVariantsMutation, PerformActionOnVariantsMutationVariables>;

/**
 * __usePerformActionOnVariantsMutation__
 *
 * To run a mutation, you first call `usePerformActionOnVariantsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePerformActionOnVariantsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [performActionOnVariantsMutation, { data, loading, error }] = usePerformActionOnVariantsMutation({
 *   variables: {
 *      action: // value for 'action'
 *      variantIds: // value for 'variantIds'
 *      defaultDomain: // value for 'defaultDomain'
 *   },
 * });
 */
export function usePerformActionOnVariantsMutation(baseOptions?: Apollo.MutationHookOptions<PerformActionOnVariantsMutation, PerformActionOnVariantsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PerformActionOnVariantsMutation, PerformActionOnVariantsMutationVariables>(PerformActionOnVariantsDocument, options);
      }
export type PerformActionOnVariantsMutationHookResult = ReturnType<typeof usePerformActionOnVariantsMutation>;
export type PerformActionOnVariantsMutationResult = Apollo.MutationResult<PerformActionOnVariantsMutation>;
export type PerformActionOnVariantsMutationOptions = Apollo.BaseMutationOptions<PerformActionOnVariantsMutation, PerformActionOnVariantsMutationVariables>;
export const AdminCreateCollectionDocument = gql`
    mutation AdminCreateCollection($collectionInputs: CollectionInputs!, $domain: String!) {
  createCollection(collectionInputs: $collectionInputs, defaultDomain: $domain) {
    collection {
      collectionId
    }
  }
}
    `;
export type AdminCreateCollectionMutationFn = Apollo.MutationFunction<AdminCreateCollectionMutation, AdminCreateCollectionMutationVariables>;

/**
 * __useAdminCreateCollectionMutation__
 *
 * To run a mutation, you first call `useAdminCreateCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminCreateCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminCreateCollectionMutation, { data, loading, error }] = useAdminCreateCollectionMutation({
 *   variables: {
 *      collectionInputs: // value for 'collectionInputs'
 *      domain: // value for 'domain'
 *   },
 * });
 */
export function useAdminCreateCollectionMutation(baseOptions?: Apollo.MutationHookOptions<AdminCreateCollectionMutation, AdminCreateCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AdminCreateCollectionMutation, AdminCreateCollectionMutationVariables>(AdminCreateCollectionDocument, options);
      }
export type AdminCreateCollectionMutationHookResult = ReturnType<typeof useAdminCreateCollectionMutation>;
export type AdminCreateCollectionMutationResult = Apollo.MutationResult<AdminCreateCollectionMutation>;
export type AdminCreateCollectionMutationOptions = Apollo.BaseMutationOptions<AdminCreateCollectionMutation, AdminCreateCollectionMutationVariables>;
export const UpdateCollectionDocument = gql`
    mutation UpdateCollection($collectionId: ID!, $collectionInputs: CollectionInputs!, $domain: String!) {
  updateCollection(
    collectionId: $collectionId
    collectionInputs: $collectionInputs
    defaultDomain: $domain
  ) {
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
export type UpdateCollectionMutationFn = Apollo.MutationFunction<UpdateCollectionMutation, UpdateCollectionMutationVariables>;

/**
 * __useUpdateCollectionMutation__
 *
 * To run a mutation, you first call `useUpdateCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCollectionMutation, { data, loading, error }] = useUpdateCollectionMutation({
 *   variables: {
 *      collectionId: // value for 'collectionId'
 *      collectionInputs: // value for 'collectionInputs'
 *      domain: // value for 'domain'
 *   },
 * });
 */
export function useUpdateCollectionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCollectionMutation, UpdateCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCollectionMutation, UpdateCollectionMutationVariables>(UpdateCollectionDocument, options);
      }
export type UpdateCollectionMutationHookResult = ReturnType<typeof useUpdateCollectionMutation>;
export type UpdateCollectionMutationResult = Apollo.MutationResult<UpdateCollectionMutation>;
export type UpdateCollectionMutationOptions = Apollo.BaseMutationOptions<UpdateCollectionMutation, UpdateCollectionMutationVariables>;
export const AddProductsToCollectionDocument = gql`
    mutation AddProductsToCollection($collectionId: ID!, $productIds: [ID]!, $domain: String!) {
  addProductsToCollection(
    collectionId: $collectionId
    productIds: $productIds
    defaultDomain: $domain
  ) {
    success
  }
}
    `;
export type AddProductsToCollectionMutationFn = Apollo.MutationFunction<AddProductsToCollectionMutation, AddProductsToCollectionMutationVariables>;

/**
 * __useAddProductsToCollectionMutation__
 *
 * To run a mutation, you first call `useAddProductsToCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddProductsToCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addProductsToCollectionMutation, { data, loading, error }] = useAddProductsToCollectionMutation({
 *   variables: {
 *      collectionId: // value for 'collectionId'
 *      productIds: // value for 'productIds'
 *      domain: // value for 'domain'
 *   },
 * });
 */
export function useAddProductsToCollectionMutation(baseOptions?: Apollo.MutationHookOptions<AddProductsToCollectionMutation, AddProductsToCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddProductsToCollectionMutation, AddProductsToCollectionMutationVariables>(AddProductsToCollectionDocument, options);
      }
export type AddProductsToCollectionMutationHookResult = ReturnType<typeof useAddProductsToCollectionMutation>;
export type AddProductsToCollectionMutationResult = Apollo.MutationResult<AddProductsToCollectionMutation>;
export type AddProductsToCollectionMutationOptions = Apollo.BaseMutationOptions<AddProductsToCollectionMutation, AddProductsToCollectionMutationVariables>;
export const DeleteProductsFromCollectionDocument = gql`
    mutation DeleteProductsFromCollection($collectionId: ID!, $productIds: [ID]!, $domain: String!) {
  deleteProductsFromCollection(
    collectionId: $collectionId
    productIds: $productIds
    defaultDomain: $domain
  ) {
    success
  }
}
    `;
export type DeleteProductsFromCollectionMutationFn = Apollo.MutationFunction<DeleteProductsFromCollectionMutation, DeleteProductsFromCollectionMutationVariables>;

/**
 * __useDeleteProductsFromCollectionMutation__
 *
 * To run a mutation, you first call `useDeleteProductsFromCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProductsFromCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProductsFromCollectionMutation, { data, loading, error }] = useDeleteProductsFromCollectionMutation({
 *   variables: {
 *      collectionId: // value for 'collectionId'
 *      productIds: // value for 'productIds'
 *      domain: // value for 'domain'
 *   },
 * });
 */
export function useDeleteProductsFromCollectionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProductsFromCollectionMutation, DeleteProductsFromCollectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProductsFromCollectionMutation, DeleteProductsFromCollectionMutationVariables>(DeleteProductsFromCollectionDocument, options);
      }
export type DeleteProductsFromCollectionMutationHookResult = ReturnType<typeof useDeleteProductsFromCollectionMutation>;
export type DeleteProductsFromCollectionMutationResult = Apollo.MutationResult<DeleteProductsFromCollectionMutation>;
export type DeleteProductsFromCollectionMutationOptions = Apollo.BaseMutationOptions<DeleteProductsFromCollectionMutation, DeleteProductsFromCollectionMutationVariables>;
export const AdminDeleteCollectionsDocument = gql`
    mutation AdminDeleteCollections($collectionIds: [ID]!, $domain: String!) {
  deleteCollections(collectionIds: $collectionIds, defaultDomain: $domain) {
    success
  }
}
    `;
export type AdminDeleteCollectionsMutationFn = Apollo.MutationFunction<AdminDeleteCollectionsMutation, AdminDeleteCollectionsMutationVariables>;

/**
 * __useAdminDeleteCollectionsMutation__
 *
 * To run a mutation, you first call `useAdminDeleteCollectionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminDeleteCollectionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminDeleteCollectionsMutation, { data, loading, error }] = useAdminDeleteCollectionsMutation({
 *   variables: {
 *      collectionIds: // value for 'collectionIds'
 *      domain: // value for 'domain'
 *   },
 * });
 */
export function useAdminDeleteCollectionsMutation(baseOptions?: Apollo.MutationHookOptions<AdminDeleteCollectionsMutation, AdminDeleteCollectionsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AdminDeleteCollectionsMutation, AdminDeleteCollectionsMutationVariables>(AdminDeleteCollectionsDocument, options);
      }
export type AdminDeleteCollectionsMutationHookResult = ReturnType<typeof useAdminDeleteCollectionsMutation>;
export type AdminDeleteCollectionsMutationResult = Apollo.MutationResult<AdminDeleteCollectionsMutation>;
export type AdminDeleteCollectionsMutationOptions = Apollo.BaseMutationOptions<AdminDeleteCollectionsMutation, AdminDeleteCollectionsMutationVariables>;
export const CreateCustomerDocument = gql`
    mutation CreateCustomer($customerInputs: CustomerInputs!, $defaultDomain: String!) {
  createCustomer(
    input: {customerInputs: $customerInputs, defaultDomain: $defaultDomain}
  ) {
    customer {
      customerId
    }
  }
}
    `;
export type CreateCustomerMutationFn = Apollo.MutationFunction<CreateCustomerMutation, CreateCustomerMutationVariables>;

/**
 * __useCreateCustomerMutation__
 *
 * To run a mutation, you first call `useCreateCustomerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCustomerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCustomerMutation, { data, loading, error }] = useCreateCustomerMutation({
 *   variables: {
 *      customerInputs: // value for 'customerInputs'
 *      defaultDomain: // value for 'defaultDomain'
 *   },
 * });
 */
export function useCreateCustomerMutation(baseOptions?: Apollo.MutationHookOptions<CreateCustomerMutation, CreateCustomerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCustomerMutation, CreateCustomerMutationVariables>(CreateCustomerDocument, options);
      }
export type CreateCustomerMutationHookResult = ReturnType<typeof useCreateCustomerMutation>;
export type CreateCustomerMutationResult = Apollo.MutationResult<CreateCustomerMutation>;
export type CreateCustomerMutationOptions = Apollo.BaseMutationOptions<CreateCustomerMutation, CreateCustomerMutationVariables>;
export const UpdateCustomerDocument = gql`
    mutation UpdateCustomer($customerInputs: CustomerInputs!, $id: ID!) {
  updateCustomer(input: {customerInputs: $customerInputs, id: $id}) {
    customer {
      customerId
    }
  }
}
    `;
export type UpdateCustomerMutationFn = Apollo.MutationFunction<UpdateCustomerMutation, UpdateCustomerMutationVariables>;

/**
 * __useUpdateCustomerMutation__
 *
 * To run a mutation, you first call `useUpdateCustomerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCustomerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCustomerMutation, { data, loading, error }] = useUpdateCustomerMutation({
 *   variables: {
 *      customerInputs: // value for 'customerInputs'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUpdateCustomerMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCustomerMutation, UpdateCustomerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCustomerMutation, UpdateCustomerMutationVariables>(UpdateCustomerDocument, options);
      }
export type UpdateCustomerMutationHookResult = ReturnType<typeof useUpdateCustomerMutation>;
export type UpdateCustomerMutationResult = Apollo.MutationResult<UpdateCustomerMutation>;
export type UpdateCustomerMutationOptions = Apollo.BaseMutationOptions<UpdateCustomerMutation, UpdateCustomerMutationVariables>;
export const DeleteCustomerDocument = gql`
    mutation DeleteCustomer($id: ID!) {
  deleteCustomer(input: {id: $id}) {
    success
  }
}
    `;
export type DeleteCustomerMutationFn = Apollo.MutationFunction<DeleteCustomerMutation, DeleteCustomerMutationVariables>;

/**
 * __useDeleteCustomerMutation__
 *
 * To run a mutation, you first call `useDeleteCustomerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCustomerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCustomerMutation, { data, loading, error }] = useDeleteCustomerMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCustomerMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCustomerMutation, DeleteCustomerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCustomerMutation, DeleteCustomerMutationVariables>(DeleteCustomerDocument, options);
      }
export type DeleteCustomerMutationHookResult = ReturnType<typeof useDeleteCustomerMutation>;
export type DeleteCustomerMutationResult = Apollo.MutationResult<DeleteCustomerMutation>;
export type DeleteCustomerMutationOptions = Apollo.BaseMutationOptions<DeleteCustomerMutation, DeleteCustomerMutationVariables>;
export const SettingsGeneralDocument = gql`
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

/**
 * __useSettingsGeneralQuery__
 *
 * To run a query within a React component, call `useSettingsGeneralQuery` and pass it any options that fit your needs.
 * When your component renders, `useSettingsGeneralQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSettingsGeneralQuery({
 *   variables: {
 *      domain: // value for 'domain'
 *   },
 * });
 */
export function useSettingsGeneralQuery(baseOptions: Apollo.QueryHookOptions<SettingsGeneralQuery, SettingsGeneralQueryVariables> & ({ variables: SettingsGeneralQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SettingsGeneralQuery, SettingsGeneralQueryVariables>(SettingsGeneralDocument, options);
      }
export function useSettingsGeneralLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SettingsGeneralQuery, SettingsGeneralQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SettingsGeneralQuery, SettingsGeneralQueryVariables>(SettingsGeneralDocument, options);
        }
export function useSettingsGeneralSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SettingsGeneralQuery, SettingsGeneralQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SettingsGeneralQuery, SettingsGeneralQueryVariables>(SettingsGeneralDocument, options);
        }
export type SettingsGeneralQueryHookResult = ReturnType<typeof useSettingsGeneralQuery>;
export type SettingsGeneralLazyQueryHookResult = ReturnType<typeof useSettingsGeneralLazyQuery>;
export type SettingsGeneralSuspenseQueryHookResult = ReturnType<typeof useSettingsGeneralSuspenseQuery>;
export type SettingsGeneralQueryResult = Apollo.QueryResult<SettingsGeneralQuery, SettingsGeneralQueryVariables>;
export const ProductIndexDocument = gql`
    query ProductIndex($domain: String!, $first: Int, $after: String!, $search: String!, $status: ProductProductStatusChoices) {
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

/**
 * __useProductIndexQuery__
 *
 * To run a query within a React component, call `useProductIndexQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductIndexQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductIndexQuery({
 *   variables: {
 *      domain: // value for 'domain'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      search: // value for 'search'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useProductIndexQuery(baseOptions: Apollo.QueryHookOptions<ProductIndexQuery, ProductIndexQueryVariables> & ({ variables: ProductIndexQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductIndexQuery, ProductIndexQueryVariables>(ProductIndexDocument, options);
      }
export function useProductIndexLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductIndexQuery, ProductIndexQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductIndexQuery, ProductIndexQueryVariables>(ProductIndexDocument, options);
        }
export function useProductIndexSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ProductIndexQuery, ProductIndexQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ProductIndexQuery, ProductIndexQueryVariables>(ProductIndexDocument, options);
        }
export type ProductIndexQueryHookResult = ReturnType<typeof useProductIndexQuery>;
export type ProductIndexLazyQueryHookResult = ReturnType<typeof useProductIndexLazyQuery>;
export type ProductIndexSuspenseQueryHookResult = ReturnType<typeof useProductIndexSuspenseQuery>;
export type ProductIndexQueryResult = Apollo.QueryResult<ProductIndexQuery, ProductIndexQueryVariables>;
export const GetProductByIdDocument = gql`
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
      pricing {
        amount
        currency
      }
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

/**
 * __useGetProductByIdQuery__
 *
 * To run a query within a React component, call `useGetProductByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProductByIdQuery(baseOptions: Apollo.QueryHookOptions<GetProductByIdQuery, GetProductByIdQueryVariables> & ({ variables: GetProductByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProductByIdQuery, GetProductByIdQueryVariables>(GetProductByIdDocument, options);
      }
export function useGetProductByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProductByIdQuery, GetProductByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProductByIdQuery, GetProductByIdQueryVariables>(GetProductByIdDocument, options);
        }
export function useGetProductByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProductByIdQuery, GetProductByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProductByIdQuery, GetProductByIdQueryVariables>(GetProductByIdDocument, options);
        }
export type GetProductByIdQueryHookResult = ReturnType<typeof useGetProductByIdQuery>;
export type GetProductByIdLazyQueryHookResult = ReturnType<typeof useGetProductByIdLazyQuery>;
export type GetProductByIdSuspenseQueryHookResult = ReturnType<typeof useGetProductByIdSuspenseQuery>;
export type GetProductByIdQueryResult = Apollo.QueryResult<GetProductByIdQuery, GetProductByIdQueryVariables>;
export const GetMediaImagesDocument = gql`
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

/**
 * __useGetMediaImagesQuery__
 *
 * To run a query within a React component, call `useGetMediaImagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMediaImagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMediaImagesQuery({
 *   variables: {
 *      domain: // value for 'domain'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useGetMediaImagesQuery(baseOptions: Apollo.QueryHookOptions<GetMediaImagesQuery, GetMediaImagesQueryVariables> & ({ variables: GetMediaImagesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMediaImagesQuery, GetMediaImagesQueryVariables>(GetMediaImagesDocument, options);
      }
export function useGetMediaImagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMediaImagesQuery, GetMediaImagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMediaImagesQuery, GetMediaImagesQueryVariables>(GetMediaImagesDocument, options);
        }
export function useGetMediaImagesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMediaImagesQuery, GetMediaImagesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMediaImagesQuery, GetMediaImagesQueryVariables>(GetMediaImagesDocument, options);
        }
export type GetMediaImagesQueryHookResult = ReturnType<typeof useGetMediaImagesQuery>;
export type GetMediaImagesLazyQueryHookResult = ReturnType<typeof useGetMediaImagesLazyQuery>;
export type GetMediaImagesSuspenseQueryHookResult = ReturnType<typeof useGetMediaImagesSuspenseQuery>;
export type GetMediaImagesQueryResult = Apollo.QueryResult<GetMediaImagesQuery, GetMediaImagesQueryVariables>;
export const GetMediaProductDocument = gql`
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

/**
 * __useGetMediaProductQuery__
 *
 * To run a query within a React component, call `useGetMediaProductQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMediaProductQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMediaProductQuery({
 *   variables: {
 *      productId: // value for 'productId'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useGetMediaProductQuery(baseOptions: Apollo.QueryHookOptions<GetMediaProductQuery, GetMediaProductQueryVariables> & ({ variables: GetMediaProductQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMediaProductQuery, GetMediaProductQueryVariables>(GetMediaProductDocument, options);
      }
export function useGetMediaProductLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMediaProductQuery, GetMediaProductQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMediaProductQuery, GetMediaProductQueryVariables>(GetMediaProductDocument, options);
        }
export function useGetMediaProductSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMediaProductQuery, GetMediaProductQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMediaProductQuery, GetMediaProductQueryVariables>(GetMediaProductDocument, options);
        }
export type GetMediaProductQueryHookResult = ReturnType<typeof useGetMediaProductQuery>;
export type GetMediaProductLazyQueryHookResult = ReturnType<typeof useGetMediaProductLazyQuery>;
export type GetMediaProductSuspenseQueryHookResult = ReturnType<typeof useGetMediaProductSuspenseQuery>;
export type GetMediaProductQueryResult = Apollo.QueryResult<GetMediaProductQuery, GetMediaProductQueryVariables>;
export const AdminProductDetailsVariantsDocument = gql`
    query AdminProductDetailsVariants($productId: ID!, $first: Int, $after: String!) {
  productDetailsVariants(productId: $productId, first: $first, after: $after) {
    edges {
      node {
        id
        variantId
        pricing {
          amount
          currency
        }
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

/**
 * __useAdminProductDetailsVariantsQuery__
 *
 * To run a query within a React component, call `useAdminProductDetailsVariantsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminProductDetailsVariantsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminProductDetailsVariantsQuery({
 *   variables: {
 *      productId: // value for 'productId'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useAdminProductDetailsVariantsQuery(baseOptions: Apollo.QueryHookOptions<AdminProductDetailsVariantsQuery, AdminProductDetailsVariantsQueryVariables> & ({ variables: AdminProductDetailsVariantsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AdminProductDetailsVariantsQuery, AdminProductDetailsVariantsQueryVariables>(AdminProductDetailsVariantsDocument, options);
      }
export function useAdminProductDetailsVariantsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminProductDetailsVariantsQuery, AdminProductDetailsVariantsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AdminProductDetailsVariantsQuery, AdminProductDetailsVariantsQueryVariables>(AdminProductDetailsVariantsDocument, options);
        }
export function useAdminProductDetailsVariantsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AdminProductDetailsVariantsQuery, AdminProductDetailsVariantsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AdminProductDetailsVariantsQuery, AdminProductDetailsVariantsQueryVariables>(AdminProductDetailsVariantsDocument, options);
        }
export type AdminProductDetailsVariantsQueryHookResult = ReturnType<typeof useAdminProductDetailsVariantsQuery>;
export type AdminProductDetailsVariantsLazyQueryHookResult = ReturnType<typeof useAdminProductDetailsVariantsLazyQuery>;
export type AdminProductDetailsVariantsSuspenseQueryHookResult = ReturnType<typeof useAdminProductDetailsVariantsSuspenseQuery>;
export type AdminProductDetailsVariantsQueryResult = Apollo.QueryResult<AdminProductDetailsVariantsQuery, AdminProductDetailsVariantsQueryVariables>;
export const AdminCollectionsListDocument = gql`
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

/**
 * __useAdminCollectionsListQuery__
 *
 * To run a query within a React component, call `useAdminCollectionsListQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminCollectionsListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminCollectionsListQuery({
 *   variables: {
 *      domain: // value for 'domain'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useAdminCollectionsListQuery(baseOptions: Apollo.QueryHookOptions<AdminCollectionsListQuery, AdminCollectionsListQueryVariables> & ({ variables: AdminCollectionsListQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AdminCollectionsListQuery, AdminCollectionsListQueryVariables>(AdminCollectionsListDocument, options);
      }
export function useAdminCollectionsListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminCollectionsListQuery, AdminCollectionsListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AdminCollectionsListQuery, AdminCollectionsListQueryVariables>(AdminCollectionsListDocument, options);
        }
export function useAdminCollectionsListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AdminCollectionsListQuery, AdminCollectionsListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AdminCollectionsListQuery, AdminCollectionsListQueryVariables>(AdminCollectionsListDocument, options);
        }
export type AdminCollectionsListQueryHookResult = ReturnType<typeof useAdminCollectionsListQuery>;
export type AdminCollectionsListLazyQueryHookResult = ReturnType<typeof useAdminCollectionsListLazyQuery>;
export type AdminCollectionsListSuspenseQueryHookResult = ReturnType<typeof useAdminCollectionsListSuspenseQuery>;
export type AdminCollectionsListQueryResult = Apollo.QueryResult<AdminCollectionsListQuery, AdminCollectionsListQueryVariables>;
export const AdminCollectionByIdDocument = gql`
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

/**
 * __useAdminCollectionByIdQuery__
 *
 * To run a query within a React component, call `useAdminCollectionByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminCollectionByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminCollectionByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAdminCollectionByIdQuery(baseOptions: Apollo.QueryHookOptions<AdminCollectionByIdQuery, AdminCollectionByIdQueryVariables> & ({ variables: AdminCollectionByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AdminCollectionByIdQuery, AdminCollectionByIdQueryVariables>(AdminCollectionByIdDocument, options);
      }
export function useAdminCollectionByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminCollectionByIdQuery, AdminCollectionByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AdminCollectionByIdQuery, AdminCollectionByIdQueryVariables>(AdminCollectionByIdDocument, options);
        }
export function useAdminCollectionByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AdminCollectionByIdQuery, AdminCollectionByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AdminCollectionByIdQuery, AdminCollectionByIdQueryVariables>(AdminCollectionByIdDocument, options);
        }
export type AdminCollectionByIdQueryHookResult = ReturnType<typeof useAdminCollectionByIdQuery>;
export type AdminCollectionByIdLazyQueryHookResult = ReturnType<typeof useAdminCollectionByIdLazyQuery>;
export type AdminCollectionByIdSuspenseQueryHookResult = ReturnType<typeof useAdminCollectionByIdSuspenseQuery>;
export type AdminCollectionByIdQueryResult = Apollo.QueryResult<AdminCollectionByIdQuery, AdminCollectionByIdQueryVariables>;
export const AdminProductsByCollectionDocument = gql`
    query AdminProductsByCollection($collectionId: ID!, $first: Int, $after: String!) {
  productsByCollection(collectionId: $collectionId, first: $first, after: $after) {
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

/**
 * __useAdminProductsByCollectionQuery__
 *
 * To run a query within a React component, call `useAdminProductsByCollectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminProductsByCollectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminProductsByCollectionQuery({
 *   variables: {
 *      collectionId: // value for 'collectionId'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useAdminProductsByCollectionQuery(baseOptions: Apollo.QueryHookOptions<AdminProductsByCollectionQuery, AdminProductsByCollectionQueryVariables> & ({ variables: AdminProductsByCollectionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AdminProductsByCollectionQuery, AdminProductsByCollectionQueryVariables>(AdminProductsByCollectionDocument, options);
      }
export function useAdminProductsByCollectionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminProductsByCollectionQuery, AdminProductsByCollectionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AdminProductsByCollectionQuery, AdminProductsByCollectionQueryVariables>(AdminProductsByCollectionDocument, options);
        }
export function useAdminProductsByCollectionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AdminProductsByCollectionQuery, AdminProductsByCollectionQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AdminProductsByCollectionQuery, AdminProductsByCollectionQueryVariables>(AdminProductsByCollectionDocument, options);
        }
export type AdminProductsByCollectionQueryHookResult = ReturnType<typeof useAdminProductsByCollectionQuery>;
export type AdminProductsByCollectionLazyQueryHookResult = ReturnType<typeof useAdminProductsByCollectionLazyQuery>;
export type AdminProductsByCollectionSuspenseQueryHookResult = ReturnType<typeof useAdminProductsByCollectionSuspenseQuery>;
export type AdminProductsByCollectionQueryResult = Apollo.QueryResult<AdminProductsByCollectionQuery, AdminProductsByCollectionQueryVariables>;
export const AdminProductResourceCollectionDocument = gql`
    query AdminProductResourceCollection($collectionId: ID!, $first: Int, $after: String!, $search: String!) {
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

/**
 * __useAdminProductResourceCollectionQuery__
 *
 * To run a query within a React component, call `useAdminProductResourceCollectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminProductResourceCollectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminProductResourceCollectionQuery({
 *   variables: {
 *      collectionId: // value for 'collectionId'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      search: // value for 'search'
 *   },
 * });
 */
export function useAdminProductResourceCollectionQuery(baseOptions: Apollo.QueryHookOptions<AdminProductResourceCollectionQuery, AdminProductResourceCollectionQueryVariables> & ({ variables: AdminProductResourceCollectionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AdminProductResourceCollectionQuery, AdminProductResourceCollectionQueryVariables>(AdminProductResourceCollectionDocument, options);
      }
export function useAdminProductResourceCollectionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminProductResourceCollectionQuery, AdminProductResourceCollectionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AdminProductResourceCollectionQuery, AdminProductResourceCollectionQueryVariables>(AdminProductResourceCollectionDocument, options);
        }
export function useAdminProductResourceCollectionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AdminProductResourceCollectionQuery, AdminProductResourceCollectionQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AdminProductResourceCollectionQuery, AdminProductResourceCollectionQueryVariables>(AdminProductResourceCollectionDocument, options);
        }
export type AdminProductResourceCollectionQueryHookResult = ReturnType<typeof useAdminProductResourceCollectionQuery>;
export type AdminProductResourceCollectionLazyQueryHookResult = ReturnType<typeof useAdminProductResourceCollectionLazyQuery>;
export type AdminProductResourceCollectionSuspenseQueryHookResult = ReturnType<typeof useAdminProductResourceCollectionSuspenseQuery>;
export type AdminProductResourceCollectionQueryResult = Apollo.QueryResult<AdminProductResourceCollectionQuery, AdminProductResourceCollectionQueryVariables>;
export const AdminCollectionsFindDocument = gql`
    query AdminCollectionsFind($domain: String!, $search: String!, $first: Int) {
  collectionsFind(defaultDomain: $domain, title_Icontains: $search, first: $first) {
    edges {
      node {
        id
        title
        collectionId
      }
    }
  }
}
    `;

/**
 * __useAdminCollectionsFindQuery__
 *
 * To run a query within a React component, call `useAdminCollectionsFindQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminCollectionsFindQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminCollectionsFindQuery({
 *   variables: {
 *      domain: // value for 'domain'
 *      search: // value for 'search'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useAdminCollectionsFindQuery(baseOptions: Apollo.QueryHookOptions<AdminCollectionsFindQuery, AdminCollectionsFindQueryVariables> & ({ variables: AdminCollectionsFindQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AdminCollectionsFindQuery, AdminCollectionsFindQueryVariables>(AdminCollectionsFindDocument, options);
      }
export function useAdminCollectionsFindLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminCollectionsFindQuery, AdminCollectionsFindQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AdminCollectionsFindQuery, AdminCollectionsFindQueryVariables>(AdminCollectionsFindDocument, options);
        }
export function useAdminCollectionsFindSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AdminCollectionsFindQuery, AdminCollectionsFindQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AdminCollectionsFindQuery, AdminCollectionsFindQueryVariables>(AdminCollectionsFindDocument, options);
        }
export type AdminCollectionsFindQueryHookResult = ReturnType<typeof useAdminCollectionsFindQuery>;
export type AdminCollectionsFindLazyQueryHookResult = ReturnType<typeof useAdminCollectionsFindLazyQuery>;
export type AdminCollectionsFindSuspenseQueryHookResult = ReturnType<typeof useAdminCollectionsFindSuspenseQuery>;
export type AdminCollectionsFindQueryResult = Apollo.QueryResult<AdminCollectionsFindQuery, AdminCollectionsFindQueryVariables>;
export const CustomerListAdminDocument = gql`
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

/**
 * __useCustomerListAdminQuery__
 *
 * To run a query within a React component, call `useCustomerListAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useCustomerListAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCustomerListAdminQuery({
 *   variables: {
 *      domain: // value for 'domain'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useCustomerListAdminQuery(baseOptions: Apollo.QueryHookOptions<CustomerListAdminQuery, CustomerListAdminQueryVariables> & ({ variables: CustomerListAdminQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CustomerListAdminQuery, CustomerListAdminQueryVariables>(CustomerListAdminDocument, options);
      }
export function useCustomerListAdminLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CustomerListAdminQuery, CustomerListAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CustomerListAdminQuery, CustomerListAdminQueryVariables>(CustomerListAdminDocument, options);
        }
export function useCustomerListAdminSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CustomerListAdminQuery, CustomerListAdminQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CustomerListAdminQuery, CustomerListAdminQueryVariables>(CustomerListAdminDocument, options);
        }
export type CustomerListAdminQueryHookResult = ReturnType<typeof useCustomerListAdminQuery>;
export type CustomerListAdminLazyQueryHookResult = ReturnType<typeof useCustomerListAdminLazyQuery>;
export type CustomerListAdminSuspenseQueryHookResult = ReturnType<typeof useCustomerListAdminSuspenseQuery>;
export type CustomerListAdminQueryResult = Apollo.QueryResult<CustomerListAdminQuery, CustomerListAdminQueryVariables>;
export const CustomerDetailsDocument = gql`
    query CustomerDetails($id: ID!) {
  customerDetails(id: $id) {
    firstName
    lastName
    email
    defaultAddress {
      address1
      address2
      city
      phone
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

/**
 * __useCustomerDetailsQuery__
 *
 * To run a query within a React component, call `useCustomerDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCustomerDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCustomerDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCustomerDetailsQuery(baseOptions: Apollo.QueryHookOptions<CustomerDetailsQuery, CustomerDetailsQueryVariables> & ({ variables: CustomerDetailsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CustomerDetailsQuery, CustomerDetailsQueryVariables>(CustomerDetailsDocument, options);
      }
export function useCustomerDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CustomerDetailsQuery, CustomerDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CustomerDetailsQuery, CustomerDetailsQueryVariables>(CustomerDetailsDocument, options);
        }
export function useCustomerDetailsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CustomerDetailsQuery, CustomerDetailsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CustomerDetailsQuery, CustomerDetailsQueryVariables>(CustomerDetailsDocument, options);
        }
export type CustomerDetailsQueryHookResult = ReturnType<typeof useCustomerDetailsQuery>;
export type CustomerDetailsLazyQueryHookResult = ReturnType<typeof useCustomerDetailsLazyQuery>;
export type CustomerDetailsSuspenseQueryHookResult = ReturnType<typeof useCustomerDetailsSuspenseQuery>;
export type CustomerDetailsQueryResult = Apollo.QueryResult<CustomerDetailsQuery, CustomerDetailsQueryVariables>;