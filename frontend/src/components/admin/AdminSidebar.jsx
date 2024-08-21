"use client";

import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";

const customTheme = {
    root: {
      inner: "h-full overflow-y-auto overflow-x-hidden bg-m-white px-3 py-4 dark:bg-gray-800"
    }
  }

export default function AdminSidebar() {
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
                    <Sidebar.Item href="#" icon={HiChartPie}>
                        Dashboard
                    </Sidebar.Item>
                    <Sidebar.Item href="#" icon={HiViewBoards}>
                        Kanban
                    </Sidebar.Item>
                    <Sidebar.Item href="#" icon={HiInbox}>
                        Inbox
                    </Sidebar.Item>
                    <Sidebar.Item href="#" icon={HiUser}>
                        Users
                    </Sidebar.Item>
                    <Sidebar.Item href="#" icon={HiShoppingBag}>
                        Products
                    </Sidebar.Item>
                    <Sidebar.Item href="#" icon={HiArrowSmRight}>
                        Sign In
                    </Sidebar.Item>
                    <Sidebar.Item href="#" icon={HiTable}>
                        Sign Up
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
            </div>
        </Sidebar>
    )
}
