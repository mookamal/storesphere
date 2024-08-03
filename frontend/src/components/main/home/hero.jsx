import { FaArrowRight } from "react-icons/fa";
import Link from 'next/link';
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/nextAuth";
export default async function Hero() {
  const session = await getServerSession(authOptions);
  console.log(session);
  return (
    <section className="bg-center bg-no-repeat bg-[url('/assets/images/hero.jpg')] bg-gray-700 bg-blend-multiply">
      <div className="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">We invest in the world’s potential</h1>
        <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">Here at Flowbite we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.</p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
          {session ? (
            <Link href="http://accounts.nour.com/api/auth/signout" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center  dark:bg-black text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
              Logout
            </Link>
          )
            : (

              <>
                <Link href="http://accounts.nour.com/signup" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center  dark:bg-black text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
                  Get started
                  <FaArrowRight className="ml-3" />
                </Link>
                <Link href="http://accounts.nour.com/login" className="inline-flex justify-center hover:text-gray-900 items-center py-3 px-5 sm:ms-4 text-base font-medium text-center text-white rounded-lg border border-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-400">
                  Login
                </Link>
              </>
            )}
        </div>
      </div>
    </section>
  );
}
