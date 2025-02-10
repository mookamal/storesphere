import PostCard from "../../components/main/blog/PostCard";
import { fetchPosts } from "../api/main/blog/post";
import StructureMetadata from "@/lib/structureMetadata";
import siteInfo from "@/data/siteInfo";
export  function generateMetadata() {

    return StructureMetadata({
      title: `Ecommerce Growth Strategies - Tips, Tools, and Techniques for Expanding Your Online Store - ${siteInfo.name}`,
      description: "Explore essential strategies and tools for growing your e-commerce store. Get actionable tips on expanding your online presence, boosting sales, and leveraging the latest trends in e-commerce.",
      image: siteInfo.logo,
    });
  }

export default async function Blog() {
    const posts = await fetchPosts();

  return (
      <main>
        <div className="container mx-auto p-4">
            <div className="grid md:grid-cols-3 lg:grid-cols-4 ms:grid-cols-1 gap-4">
                {posts.map(post => (
                    <div key={post.slug}>
                        <PostCard post={post} />
                    </div>
                ))}
            </div>
        </div>
      </main>
  )
}
