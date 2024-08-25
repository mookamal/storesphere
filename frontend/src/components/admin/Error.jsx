"use client";

import { BiSolidMessageSquareError } from "react-icons/bi";
import { Button } from "flowbite-react";
import { useRouter } from 'next/navigation'
export default function Error() {
    const router = useRouter();

    return (
        <div className="fixed inset-0 flex items-center flex-col bg-white z-50">
            <div className="border p-5 text-center flex items-center justify-center mt-10">
                <BiSolidMessageSquareError size={70} className="text-gray-600" />
                <h1 className="text-center text-gray-800 p-4">
                    Oops, something went wrong! Please try again later.
                </h1>
            </div>
            <Button.Group className="mt-5">
                <Button color="gray" onClick={() => window.location.reload()}>Reload this page</Button>
                <Button color="gray" onClick={() => router.push("/")}>Return to Stores List</Button>
            </Button.Group>
        </div>
      );
}
