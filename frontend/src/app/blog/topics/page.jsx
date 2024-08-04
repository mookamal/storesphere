import { fetchCategories } from '../../api/main/blog/category';
import Link from 'next/link';
import { Card } from "flowbite-react";
import StructureMetadata from '../../../helper/structureMetadata';
import siteInfo from "../../../data/site.json";

export function generateMetadata() {
    return StructureMetadata({
        title: `Trending Topics from the Ecommerce Marketing Blog - ${siteInfo.name}`,
        description: 'Discover the latest trends and insights in ecommerce marketing. Stay updated with our popular topics and expert advice to boost your online business success.',
        image: siteInfo.logo,
    });
}

export default async function Topics() {
    const categories = await fetchCategories();
  return (
    <>
    <section className="bg-gray-100 dark:bg-black py-10">
        <div className="container mx-auto">
            <h1 className="text-center text-blue-800 dark:text-gray-50 font-bold text-4xl">Blog Topics</h1>
        </div>
    </section>

    <div className="container mx-auto py-5">
        <div className="grid grid-cols-2 lg:grid-cols-5 px-2 md:px-0 gap-2">
            {categories.map(category => (
                <Link key={category.slug} href={`/blog/topics/${category.slug}`}>
                    <Card
                    imgAlt={category.name}
                    imgSrc={category.image}
                    className='h-full shadow-sm'
                    >
                        <h3 className='text-xl font-bold hover:text-blue-600 text-gray-700 dark:text-gray-50'>{category.name}</h3>
                    </Card>
                </Link>
            ))}
        </div>
    </div>
    </>
  )
}
