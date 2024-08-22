"use client";

import { Sidebar } from "flowbite-react";
import { FaHome , FaChartBar  } from "react-icons/fa";
import { usePathname } from 'next/navigation'
import Link from "next/link";

const customTheme = {
  root: {
    inner: ""
  }
}

export default function SettingsSidebar() {
  const pathname = usePathname();
  const storeDomain = pathname.split('/')[2];
  const currentPath = pathname.split('/').pop();
  
  const settingsLinksList = [
    { title: "General", path: `/store/${storeDomain}/settings/general`, icon: FaHome },
    { title: "Plan", path: `/store/${storeDomain}/settings/plan`, icon: FaChartBar },
  ];
  return (
    <Sidebar aria-label="Settings sidebar" theme={customTheme}>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {settingsLinksList.map((link, index) => (
            <li key={index}>
              <Link 
              className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group gap-2 ${currentPath === link.title.toLowerCase() ? 'active' : ''}`}
              href={link.path}
              >
                <link.icon /> 
                {link.title}
              </Link>
            </li>
          ))}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}
