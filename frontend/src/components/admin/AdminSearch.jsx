import { FaSearchLocation } from "react-icons/fa";
import { MdOutlineScreenSearchDesktop } from "react-icons/md";

export default function Search() {
    return (
        <form className="flex items-center md:w-full max-w-96 w-52 mx-auto">
            <label htmlFor="simple-search" className="sr-only">Search</label>
            <div className="relative w-full">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <MdOutlineScreenSearchDesktop />
                </div>
                <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-900" placeholder="Search" required />
            </div>
            <button type="submit" className="p-2.5 ms-2 text-sm font-medium text-white bg-slate-700 rounded-lg border border-blue-300 dark:border-slate-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-slate-900 dark:hover:bg-black dark:focus:ring-blue-800">
                <FaSearchLocation />
                <span className="sr-only">Search</span>
            </button>
        </form>

    )
}
