import next from "next";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchPosts() {
    const response = await fetch(`${API_BASE_URL}/blog/posts` , {
        next: {
            revalidate: 120,
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

    return response.json();
}

export async function fetchPostById(slug) {
    const response = await fetch(`${API_BASE_URL}/blog/posts/${slug}`, {
        next: {
            revalidate: 120,
        }
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch post');
    }
    
    return response.json();
}