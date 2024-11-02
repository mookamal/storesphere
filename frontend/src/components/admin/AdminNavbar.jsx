"use client";

import Logo from "@/components/my/Logo";
import Link from "next/link";
import { ModeToggle } from "../ModeToggle";
import { signOut } from "next-auth/react";
import AvatarByLetter from "./Avatar";

export default function AdminNavbar() {
  return (
    <header className="w-full fixed z-20 top-0 start-0 bg-white dark:bg-black text-black dark:text-white py-2 md:px-8 px-2 flex items-center justify-between  border-b shadow">
      <Logo />

      <div className="flex items-center gap-2">
        <ModeToggle />
      </div>
    </header>
  );
}
