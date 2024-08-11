'use client';
import Lottie from 'lottie-react';
import { Spinner } from "flowbite-react";
import storeAnimation from "../../../../public/assets/animation/store.json"
import AuthContainer from "../../../components/accounts/AuthContainer";
import { useState } from 'react';
export default function StoreCreate() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <AuthContainer>
      <div className="p-15">
        {isLoading && <div className="loading">
          <Lottie animationData={storeAnimation} loop={true} />
          <p className='text-center font-medium text-blue-800 my-5'>Creating your store, please wait <Spinner aria-label="Medium sized spinner example" size="md" /></p>
        </div>}
      </div>
    </AuthContainer>
  )
}
