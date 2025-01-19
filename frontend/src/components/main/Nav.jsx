"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn, Star, Moon, Sun } from "lucide-react";
import Logo from "@/components/my/Logo";
import { ModeToggle } from "../ModeToggle";

export default function MainNavbar() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 inset-x-0 z-50 w-full bg-gradient-to-br from-white/80 to-white/95 dark:from-gray-900/80 dark:to-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Logo />
          <nav className="hidden md:flex items-center space-x-4 text-gray-600 dark:text-gray-300">
            <Link 
              href="/features" 
              className="hover:text-purple-600 transition-colors"
            >
              Features
            </Link>
            <Link 
              href="/pricing" 
              className="hover:text-purple-600 transition-colors"
            >
              Pricing
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Star className="w-4 h-4 mr-2" />
              Start Free Trial
            </Button>
          </div>

          <ModeToggle />
        </div>
      </div>
    </motion.header>
  );
}