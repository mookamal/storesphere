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
    <div className="container mt-5 mb-5">
      <h1 className='mt-text-secondary text-center'>{post.title}</h1>
      <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%' }}>
        <Image
          src={post.image}
          alt={post.title}
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="row mt-5">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
        </div>
        <div className="col-md-3"></div>
      </div>
    </div>
  );
}
