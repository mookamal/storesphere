import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

export default function PostCard({ post }) {
  const formattedDate = format(new Date(post.published_date), 'MMMM dd, yyyy');
  return (
    <>
      <div className="card bg-transparent h-100 border-0" style={{ position: 'relative', width: '100%', height: 'auto' }}>
        <Link href={`/blog/${post.slug}`}>
          <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%' }}> 
              <Image
                src={post.image}
                alt={post.title}
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
              />
          </div>
        </Link>
        <div className="card-body">
          <Link href={`/blog/${post.slug}`} className='text-decoration-none'>
            <h2 className='my-text-secondary h5'>{post.title}</h2>
          </Link>
        </div>
        <div className="card-footer d-flex justify-content-between text-center border-0 bg-transparent">
            <p className='text-muted'>{formattedDate}</p>
            
            <Link href={`/blog/topics/${post.category.slug}`} className='text-decoration-none'>
              <p className='text-muted'>{post.category.name}</p>
            </Link>
        </div>
      </div>
    </>
  );
}
