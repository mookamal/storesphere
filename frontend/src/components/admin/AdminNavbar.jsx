"use client";

import { Avatar, Dropdown, Navbar } from "flowbite-react";
import infoData from "../../data/site.json";
import Search from "./AdminSearch";
import AvatarByLetter from "./Avatar";
import { DarkThemeToggle } from "flowbite-react";

export default function AdminNavbar() {
  return (
    <Navbar fluid className="sticky top-0">
      <div className="w-full p-1 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
          <Navbar.Brand>
            <img src={infoData.logo} className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
          </Navbar.Brand>
          </div>
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
        </div>
      </div>
  </Navbar>
  )
}
