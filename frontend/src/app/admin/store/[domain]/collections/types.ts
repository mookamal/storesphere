import { Collection, PageInfo } from "@/types";

  
  export interface CollectionEdge {
    node: Collection;
  }
  
  
  export interface CollectionsData {
    allCollections: {
      __typename?: string;
      edges: CollectionEdge[];
      pageInfo: PageInfo;
    };
  }