"use client";

import { Sidebar } from "flowbite-react";
import { usePathname } from 'next/navigation'
import { IoSettings, IoHome } from "react-icons/io5";
import Link from "next/link";
const customTheme = {
    root: {
        inner: "h-full overflow-y-auto overflow-x-hidden bg-m-white px-3 py-4 dark:bg-gray-800"
    }
}

export default function AdminSidebar() {
    const pathname = usePathname();
    const storeDomain = pathname.split('/')[2];
    const currentPath = pathname.split('/')[3] || "";
 
    const adminLinksList = [
        { title: "Home", path: `/store/${storeDomain}`, icon: IoHome },
        { title: "Settings", path: `/store/${storeDomain}/settings/general`, icon: IoSettings },
    ];
    return (
        <Sidebar
            aria-label="Sidebar"
            id="default-sidebar"
            theme={customTheme}
            className="fixed top-0 left-0 z-40 w-64 h-screen pt-16  transition-transform -translate-x-full sm:translate-x-0 border-r border-gray-200 dark:border-gray-700 shadow-sm"
        >

            <div className="flex h-full flex-col justify-between">
                <Sidebar.Items>
                    <Sidebar.ItemGroup>
                        {adminLinksList.map((link, index) => (
                            <li key={index}>
                                <Link
                                    className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group gap-2 ${currentPath === link.title.toLowerCase() ? 'active' : ''} ${currentPath === "" && link.path === `/store/${storeDomain}` ? 'active' : ''}`}
                                    href={link.path}
                                >
                                    <link.icon />
                                    {link.title}
                                </Link>
                            </li>
                        ))}
                    </Sidebar.ItemGroup>
                </Sidebar.Items>
            </div>
        </Sidebar>
    )
}
