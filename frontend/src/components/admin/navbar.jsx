"use client";

import { Avatar, Dropdown, Navbar } from "flowbite-react";
import infoData from "../../data/site.json";
import Search from "./search";

export default function AdminNavbar() {
  return (
    <Navbar fluid rounded>
    <Navbar.Brand>
      <img src={infoData.logo} className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
    </Navbar.Brand>
    <div className="flex md:order-2">
      <Dropdown
        arrowIcon={false}
        inline
        label={
          <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" />
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
