"use client";

import Logo from "@/components/my/Logo";
import Link from "next/link";
import { ModeToggle } from "../ModeToggle";
import { signOut } from "next-auth/react";
import AvatarByLetter from "./Avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
export default function AdminNavbar() {
  return (
    <header className="w-full  dark:bg-zinc-900 bg-gray-100 text-black dark:text-white py-2 md:px-8 px-2 flex items-center justify-between  border-b">
      <div className="flex gap-3 items-center justify-between">
        <SidebarTrigger />
        <Logo />
      </div>

      <div className="flex items-center gap-2">
        <ModeToggle />
      </div>
    </header>
  );
}
