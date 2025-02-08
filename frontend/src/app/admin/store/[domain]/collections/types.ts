export interface Collection {
    id: string;
    collectionId: string;
    title: string;
    productsCount: number;
  }
  
  export interface CollectionEdge {
    node: Collection;
  }
  
  export interface CollectionPageInfo {
    hasNextPage: boolean;
    endCursor: string;
  }
  
  export interface CollectionsData {
    allCollections: {
      __typename?: string;
      edges: CollectionEdge[];
      pageInfo: CollectionPageInfo;
    };
  }