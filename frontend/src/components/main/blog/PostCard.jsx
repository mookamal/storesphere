import { Card } from "flowbite-react";
import Link from 'next/link';
import { format } from 'date-fns';

export default function PostCard({ post }) {
  const formattedDate = format(new Date(post.published_date), 'MMMM dd, yyyy');
  return (
    <Card className="max-w-sm h-full shadow-sm" imgAlt={post.title} imgSrc={post.image}>
      <Link href={`/blog/${post.slug}`}>
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white hover:text-blue-500">
          {post.title}
        </h5>
      </Link>
    <div className="flex flex-row justify-around">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {formattedDate}
      </p>
      <Link href={`/blog/topics/${post.category.slug}`} className='text-decoration-none'>
        <p className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500">
          {post.category.name}
        </p>
      </Link>
    </div>
    </Card>
  );
}