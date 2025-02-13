/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: { input: any; output: any; }
  /** The `Decimal` scalar type represents a python Decimal. */
  Decimal: { input: any; output: any; }
  /** Custom Scalar for validating email addresses */
  EmailScalar: { input: any; output: any; }
  JSONString: { input: any; output: any; }
  /** Custom Scalar for validating phone numbers */
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
