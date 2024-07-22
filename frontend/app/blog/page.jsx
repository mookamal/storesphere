import PostCard from "../../components/main/blog/PostCard";
import { fetchPosts } from "../api/main/blog/post";
import StructureMetadata from '../../helper/structureMetadata';
import SiteInfo from "../../helper/core"
export async function generateMetadata() {
    const siteInfo = await SiteInfo()
    return StructureMetadata({
      title: `Ecommerce Growth Strategies - Tips, Tools, and Techniques for Expanding Your Online Store - ${siteInfo.name}`,
      description: "Explore essential strategies and tools for growing your e-commerce store. Get actionable tips on expanding your online presence, boosting sales, and leveraging the latest trends in e-commerce.",
      image: siteInfo.logo,
    });
  }

export default async function Blog() {
    const posts = await fetchPosts();

  return (
    <>
    <div className="container mt-5 mb-5">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            
            {posts.map(post => (
                <div className="col" key={post.slug}>
                    <PostCard post={post} />
                </div>
            ))}
            
        </div>
    </div>
    </>
  )
}
