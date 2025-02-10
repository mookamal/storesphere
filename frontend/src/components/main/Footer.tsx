"use client";

import Link from "next/link";
import Logo from "@/components/my/Logo";
import { FC, memo } from "react";


interface FooterLinkItem {
  name: string;
  href: string;
}


const productLinks: FooterLinkItem[] = [
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "Integrations", href: "/integrations" },
  { name: "Demo", href: "/demo" },
];

const companyLinks: FooterLinkItem[] = [
  { name: "About", href: "/about" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
  { name: "Blog", href: "/blog" },
];

const MainFooter: FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Empowering businesses with cutting-edge multi-store solutions. 
              Grow, manage, and scale your online presence effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {productLinks.map(({ name, href }) => (
                  <li key={name}>
                    <Link 
                      href={href} 
                      className="hover:text-purple-600 transition-colors"
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Company
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {companyLinks.map(({ name, href }) => (
                  <li key={name}>
                    <Link 
                      href={href} 
                      className="hover:text-purple-600 transition-colors"
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              Stay Updated
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Subscribe to our newsletter for the latest updates.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-3 py-2 text-sm border rounded-l-lg dark:bg-gray-800 dark:border-gray-700"
              />
              <button 
                className="bg-purple-600 text-white px-4 py-2 text-sm rounded-r-lg hover:bg-purple-700 transition-colors"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Your Company. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};


export default memo(MainFooter);