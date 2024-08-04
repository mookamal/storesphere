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
        <>
            <section className="bg-gray-100 dark:bg-black py-10">
                <div className="container mx-auto">
                    <h1 className="text-center text-blue-800 dark:text-gray-50 font-bold text-4xl">{category.name}</h1>
                    <p className='text-center my-3 text-gray-500 dark:text-gray-100 font-extralight text-lg'>{category.description}</p>
                </div>
            </section>
            <div className="container mx-auto text-center">
                {category.posts.map(post => (
                    <dev key={post.slug}>
                        <Link key={post.slug} href={`/blog/${post.slug}`}>
                            <h5 className="text-3xl text-blue-500 dark:text-gray-50 my-3 font-bold hover:text-blue-900 dark:hover:text-blue-700">{post.title}</h5>
                        </Link>
                        <hr className='shadow my-5'></hr>
                    </dev>
                ))}
            </div>
        </>
    )
}
