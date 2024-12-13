import { fetchPostById } from "../../api/main/blog/post";
import { format } from "date-fns";
import { Button, Card } from "flowbite-react";
import StructureMetadata from "../../../helper/structureMetadata";
import { MdKeyboardArrowRight } from "react-icons/md";
import Link from "next/link";
export async function generateMetadata({ params }) {
  const post = await fetchPostById(params.post_slug);

  return StructureMetadata({
    title: post.title,
    description: post.description,
    image: post.image,
  });
}

export default async function PostDetail({ params }) {
  const post = await fetchPostById(params.post_slug);
  const formattedDate = format(new Date(post.published_date), "MMM dd, yyyy");

  return (
    <article className="container mx-auto p-5">
      {/* breadcrumb */}
      <nav className="flex pb-5" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <MdKeyboardArrowRight />
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
            >
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <MdKeyboardArrowRight />
              <Link
                href="/blog"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
              >
                Blog
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <MdKeyboardArrowRight />
              <span className="hidden sm:inline-block ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                {post.title}
              </span>
            </div>
          </li>
        </ol>
      </nav>
      {/* End breadcrumb */}
      {/* Top wrapper */}
      <div aria-label="top-wrapper">
        <h1 className="text-4xl font-bold text-blue-800 dark:text-gray-50">
          {post.title}
        </h1>
        <Link
          href={`/blog/topics/${post.category.slug}`}
          className="inline-block"
        >
          <Button color="light" className="my-3">
            {post.category.name}
          </Button>
        </Link>
        <p className="font-medium text-sm dark:text-white">{formattedDate}</p>
      </div>
      {/* End Top wrapper */}
      {/* Content */}
      <div
        className="container mx-auto  flex flex-col md:flex-row my-5"
        aria-label="content"
      >
        <div className="w-full md:w-3/4 px-4" aria-label="post content">
          <img
            className="h-auto max-w-full rounded-sm shadow-sm dark:shadow-gray-800"
            src={post.image}
            alt={post.title}
          />
          <div
            className="mt-10 post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
        </div>
        <div
          className="w-full md:w-1/4 px-4 mt-3 md:mt-0"
          aria-label="right content"
        >
          <Card>
            <p>
              Use this example to apply rounded corners to the image by using
              the rounded class where the size can be anything from small to
              extra large.
            </p>
          </Card>
        </div>
      </div>
      {/* End Content */}
    </article>
  );
}

{
  /* <div dangerouslySetInnerHTML={{ __html: post.content }}></div> */
}
