'use client';

import axios from 'axios';
import Lottie from 'lottie-react';
import { Spinner, Button, TextInput, Label } from "flowbite-react";
import storeAnimation from "../../../../public/assets/animation/store.json";
import AuthContainer from "../../../components/accounts/AuthContainer";
import { useState } from 'react';
const CREATE_STORE_URL = "/api/store-create"

export default  function StoreCreate() {
  const [isLoading, setIsLoading] = useState(false);

  

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const objectFromForm = Object.fromEntries(formData);
    const jsonData = JSON.stringify(objectFromForm);
    const response = await axios.post(CREATE_STORE_URL, jsonData);
    
    if (response.statusText === "OK") {
      const storeDomain = response.data.domain;
      window.location.href = `/admin/store/${storeDomain}/`;
    } else {
      console.error(response.data);
      setIsLoading(false);
      alert('Failed to create store. Please try again later.');
    }
  }

  return (
    <AuthContainer>
      <div className="p-15">
        {isLoading && <div className="loading">
          <Lottie animationData={storeAnimation} loop={true} />
          <p className='text-center font-medium text-blue-800 my-5'>Creating your store, please wait <Spinner aria-label="Medium sized spinner example" size="md" /></p>
        </div>}
        {!isLoading &&
          <form className="flex max-w-md flex-col gap-4 m-10 p-10" onSubmit={handleSubmit}>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="storeName" value="Your store name" />
              </div>
              <TextInput id="storeName" name='storeName' type="text" placeholder="My store" required />
            </div>
            <Button  type="submit">Submit</Button>
          </form>
        }
      </div>
    </AuthContainer>
  )
}
