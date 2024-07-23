import { fetchCategoryBySlug } from '../../../api/main/blog/category';
import { format } from 'date-fns';
import Link from 'next/link';
import StructureMetadata from '../../../../helper/structureMetadata';

export async function generateMetadata({ params }) {
    const category = await fetchCategoryBySlug(params.category_slug);
    return StructureMetadata({
        title: category.name,
        description: category.description,
        image: category.image,
    });
}

export default async function CategoryBySlug({ params }) {
    const category = await fetchCategoryBySlug(params.category_slug);
  return (
    <main className='flex-fill'>
        <section className="bg-white p-5 border-top">
            <div className="container text-center">
                <h1>{category.name}</h1>
                <p>{category.description}</p>
            </div>
        </section>
        <div className="container p-5">
            <div className="row">
                {category.posts.map(post => (
                    <div key={post.slug} className="card w-100">
                        <div className="card-body">
                            <Link href={`/blog/${post.slug}`} className='text-decoration-none'>
                                <h5 className="card-title">{post.title}</h5>
                            </Link>
                            <p className="card-text">{post.description}</p>
                            <p>{format(new Date(post.published_date), 'MMM dd, yyyy')}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </main>
  )
}
