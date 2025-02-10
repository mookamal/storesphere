import { Image } from "./common/image";
import { SEO } from "./common/seo";

export interface Collection  {
  id?: string;
  title: string; 
  description?: string | null;
  collectionId?: string;
  image? : Image | null;
  imageId?: number | null;
  handle?: string | null;
  seo?: SEO | null;
  productsCount?: number;
};

export interface CollectionEdge {
  node: Collection;
};
