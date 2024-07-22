import Image from "next/image";
import Link from 'next/link';
export default function HomeSupport() {
  return (
    <section className="bg-color-primary p-5">
        <div className="container ">

            <h3 className="my-text-secondary text-center">The assistance you need, exactly when you need it</h3>

            <div className="row row-cols-1 row-cols-md-3 g-4 mt-3">
                <div className="col">
                    <Link href="/blog" className="text-decoration-none">
                        <div className="card p-4">
                            <h3 className="mb-4">Blog</h3>
                            <Image
                            src="/assets/icons/blog.png"
                            alt="Blog"
                            width={50}
                            height={50}
                            className="mb-4"
                            />
                            <p>Get all the marketing and business strategy advice you need to successfully manage your online business.</p>
                            <button className="btn btn-light col-6 col-md-3">Read <i className="bi bi-arrow-right-short"></i></button>
                        </div>
                    </Link>
                </div>
            </div>
            
        </div>
    </section>
  )
}
