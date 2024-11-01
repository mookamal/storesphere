import Logo from "@/components/my/Logo";
import { buttonVariants } from "@/components/ui/button";

import Link from "next/link";
export default function MainNavbar() {
  return (
    <header className="w-full bg-white dark:bg-black text-black dark:text-white md:px-8 px-2 flex items-center justify-between">
      <Logo />

      <div className="flex items-center gap-2">
        <Link
          className={buttonVariants({ variant: "outline" })}
          href={`${process.env.NEXTAUTH_URL}/login`}
        >
          Login
        </Link>
        <Link
          className={buttonVariants({ variant: "default" })}
          href={`${process.env.NEXTAUTH_URL}/signup`}
        >
          Start free trial
        </Link>
      </div>
    </header>
  );
}
