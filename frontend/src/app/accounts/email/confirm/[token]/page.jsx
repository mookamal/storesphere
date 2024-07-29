"use client"

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react';
import AuthContainer from "../../../../../components/accounts/AuthContainer";
export default function ConfirmEmail({params}) {
  const router = useRouter();
  const  key  = decodeURIComponent(params.token);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (key) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register/verify-email/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: key }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.detail === 'ok') {
            setStatus('success');
            setTimeout(() => {
              router.push('/login');
            }, 3000);
          } else {
            setStatus('error');
          }
        })
        .catch(() => setStatus('error'));
    }
  }, [key]);


  return (
    <AuthContainer>
      <div className='m-20'>
        {status === 'loading' && <p>Loading...</p>}
        {status === 'success' && <p>Email confirmed! Redirecting to login page...</p>}
        {status === 'error' && <p>Invalid or expired confirmation key.</p>}
      </div>
    </AuthContainer>
  );
};