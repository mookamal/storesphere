import { fetchCategories } from '../../api/main/blog/category';
import Link from 'next/link';
import Image from 'next/image';
import StructureMetadata from '../../../helper/structureMetadata';
import SiteInfo from "../../../helper/core";

export async function generateMetadata() {
    const siteInfo = await SiteInfo()
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
    <section className="bg-white p-5 border-top">
        <div className="container">
            <h1 className="text-center">Blog Topics</h1>
        </div>
    </section>

    <div className="container p-5">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {categories.map(category => (
                <div key={category.slug} className="col">
                    <div className="card bg-transparent h-100 border-0" style={{ position: 'relative', width: '100%', height: 'auto' }}>

                        <Link href={`/blog/topics/${category.slug}`}>
                        <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%' }}> 
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill 
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        </Link>

                        <div className="card-body">
                        <Link href={`/blog/topics/${category.slug}`} className='text-decoration-none'>
                            <h2 className='my-text-secondary h5'>{category.name}</h2>
                        </Link>
                        <p>{category.description}</p>
                        </div>

                    </div>
                </div>
            ))}
        </div>
    </div>
    </>
  )
}
