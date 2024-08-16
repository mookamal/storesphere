"use client";

import { Avatar, Dropdown, Navbar } from "flowbite-react";
import infoData from "../../data/site.json";
import Search from "./AdminSearch";
import AvatarByLetter from "./Avatar";
import { DarkThemeToggle } from "flowbite-react";

export default function AdminNavbar() {
  return (
    <Navbar fluid rounded className="bg-slate-100 dark:bg-black">
    <Navbar.Brand>
      <img src={infoData.logo} className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
    </Navbar.Brand>
    <div className="flex md:order-2 gap-2">
      <DarkThemeToggle />
      <Dropdown
        arrowIcon={false}
        inline
        label={
          <AvatarByLetter storeName="my Store" />
        }
      >
        <Dropdown.Header>
          <span className="block text-sm">Bonnie Green</span>
          <span className="block truncate text-sm font-medium">name@flowbite.com</span>
        </Dropdown.Header>
        <Dropdown.Item>Dashboard</Dropdown.Item>
        <Dropdown.Item>Settings</Dropdown.Item>
        <Dropdown.Item>Earnings</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item>Sign out</Dropdown.Item>
      </Dropdown>
    </div>
    <Search />
  </Navbar>
  )
}
