import React from 'react'
import Image from 'next/image';
export default function FeatureBanner() {
  return (
    <section className="text-center bg-color-white p-5">
        <div className="container">

            <h3 className='text-dark'>Your brand, your vision.</h3>
            
            <Image 
                src='/assets/images/online-shop.jpg'
                className="img-fluid mt-4"
                width={600}
                height={400}
                alt='Your brand, your vision'
            />
        </div>
    </section>
  )
}
