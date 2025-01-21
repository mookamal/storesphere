"use client";

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import Logo from "@/components/my/Logo";
import Link from 'next/link';
import ROUTES from "@/data/links";

export default function ConfirmEmail({ params }) {
  const router = useRouter();
  
  // فكّ الوعد (Promise) باستخدام React.use()
  const { token } = use(params);

  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function verifyEmail() {
      if (!token) {
        setStatus('error');
        setErrorMessage('Invalid confirmation link');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register/verify-email/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ key: decodeURIComponent(token) }),
        });

        const data = await response.json();

        if (response.ok && data.detail === 'ok') {
          setStatus('success');
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          setStatus('error');
          setErrorMessage(data.detail || 'Email verification failed');
        }
      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');
        setErrorMessage('Network error. Please try again.');
      }
    }

    verifyEmail();
  }, [token, router]);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 bg-gray-50 dark:bg-gray-900"
    >
      <div className="w-full rounded-lg md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8 bg-white rounded-lg shadow-xl dark:border dark:bg-gray-800 dark:border-gray-700">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          
          <div className="text-center">
            {status === 'loading' && (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Verifying your email...
                </p>
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center space-y-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
                <p className="text-xl text-green-600 dark:text-green-400 text-center">
                  Email confirmed successfully! 
                  <br />
                  Redirecting to login page...
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center space-y-4">
                <AlertTriangle className="h-16 w-16 text-red-500" />
                <p className="text-xl text-red-600 dark:text-red-400 text-center">
                  {errorMessage}
                </p>
                <Link 
                  href={ROUTES.signup.path}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Back to Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
