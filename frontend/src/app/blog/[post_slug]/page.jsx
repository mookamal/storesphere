import { fetchPostById } from '../../api/main/blog/post';
import { format } from 'date-fns';
import Image from 'next/image';
import StructureMetadata from '../../../helper/structureMetadata';
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
  const formattedDate = format(new Date(post.published_date), 'MMM dd, yyyy');

  return (
    <article className="container mx-auto p-5 text-center">
      <h1 className='mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white'>{post.title}</h1>
      <img className="h-auto max-w-full my-3" src={post.image} alt={post.title} />
      <div className='mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert' dangerouslySetInnerHTML={{ __html: post.content }}></div>
    </article>
  );
}