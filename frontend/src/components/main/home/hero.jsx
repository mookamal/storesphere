"use client";
import Lottie from "lottie-react";
import storeManAnimation from "@/assets/animation/store_man.json";
export default function Hero() {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div className="mr-auto place-self-center lg:col-span-7">
          <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
            Build Your <span className="text-purple-400">Online Store</span>{" "}
            Effortlessly and Start Selling Today!
          </h1>
          <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
            Create and manage your{" "}
            <span className="text-purple-400 font-bold">Online Store</span> with
            ease. Powerful tools, flexible designs, and seamless payment
            options—all you need to grow your business faster.
          </p>
        </div>
        <div className="lg:mt-0 lg:col-span-5 lg:flex">
          <Lottie animationData={storeManAnimation} loop={true} speed={0.5} />
        </div>
      </div>
    </section>
  );
}
