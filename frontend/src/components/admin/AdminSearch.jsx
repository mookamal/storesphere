import { FaSearchLocation } from "react-icons/fa";

export default function Search() {
    return (
        <form className="flex items-center md:w-full max-w-96 w-52 md:mx-auto mx-2">
            <label htmlFor="simple-search" className="sr-only">Search</label>
            <div className="relative w-full">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <FaSearchLocation />
                </div>
                <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-900" placeholder="Search" required />
            </div>
        </form>

    )
}
