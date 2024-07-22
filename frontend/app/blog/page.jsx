import PostCard from "../../components/main/blog/PostCard";
import { fetchPosts } from "../api/main/blog/post";
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
