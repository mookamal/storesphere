const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchCategories() {
    const response = await fetch(`${API_BASE_URL}/blog/categories`, {
      next: {
          revalidate: 120,
      }
  });
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  }
  
  export async function fetchCategoryBySlug(slug) {
    const response = await fetch(`${API_BASE_URL}/blog/categories/${slug}`, {
      next: {
          revalidate: 120,
      }
  });
    if (!response.ok) {
      throw new Error('Failed to fetch category');
    }
    return response.json();
  }