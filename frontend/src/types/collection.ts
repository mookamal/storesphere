import { Image } from "./common/image";
import { SEO } from "./common/seo";

export interface Collection  {
  title: string; 
  description?: string | null;
  image? : Image | null;
  imageId?: string | null;
  handle?: string | null;
  seo: SEO | null;
};
