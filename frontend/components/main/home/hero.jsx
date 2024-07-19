import React from 'react'

export default function Hero({info}) {
  return (
    <section className="text-center bg-color-primary p-5">
        <div className="container ">

            <h1 className='fw-bold my-text-secondary'>{info.name}</h1>
            
            <div className="row justify-content-center">
                <div className="col-12 col-md-6">
                    <p className="fw-bold mt-5 my-text-secondary">{info.desc}</p>
                </div>
            </div>

        </div>
    </section>
  )
}
