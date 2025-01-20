"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn, Star } from "lucide-react";
import Logo from "@/components/my/Logo";
import { ModeToggle } from "../ModeToggle";
import ROUTES from "@/data/links";

export default function MainNavbar() {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed w-full z-50 top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
    >
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <div className="flex items-center space-x-4">
          <Logo />
          <div className="hidden md:flex space-x-6 text-gray-600 dark:text-gray-300">
            {[
              { name: "Features", href: ROUTES.features.path },
              { name: "Pricing", href: ROUTES.pricing.path },
              { name: "Blog", href: ROUTES.blog.path }
            ].map(({ name, href }) => (
              <Link 
                key={name} 
                href={href} 
                className="hover:text-purple-600 transition-colors"
              >
                {name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <ModeToggle />
          
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/50"
              onClick={() => window.location.href = ROUTES.login.url}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>

            <Button 
              variant="default" 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => window.location.href = ROUTES.signup.url}
            >
              <Star className="w-4 h-4 mr-2" />
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}