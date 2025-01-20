"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Store, ShoppingCart } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6 text-center lg:text-start"
        >
          <div className="inline-flex items-center bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full text-purple-800 dark:text-purple-200 text-sm font-medium mb-4 mx-auto lg:mx-0">
            <Store className="w-4 h-4 mr-2" />
            Most Advanced Multi-Store Platform
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
            Create Your Online Store 
            <span className="block text-purple-600 mt-2">Easily and Professionally</span>
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
            Comprehensive platform for managing multiple stores. Powerful tools, 
            flexible designs, and advanced payment options to grow your business 
            quickly and efficiently.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Start Your Store Now
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              Learn More
              <ArrowRight className="w-5 h-5 mr-2" />
            </Button>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex justify-center items-center"
        >
        <Image 
          src="/assets/images/shopping.svg" 
          alt="Multi-Store Management Platform" 
          width={800} 
          height={600} 
          priority
          className="rounded-xl shadow-2xl border dark:border-gray-800"
        />
        </motion.div>
      </div>

      {/* Light animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl animate-pulse"></div>
      </div>
    </section>
  );
}