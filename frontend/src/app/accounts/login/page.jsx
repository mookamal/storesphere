"use client";

import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import AuthContainer from "../../../components/accounts/AuthContainer";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function Login() {
  const [isLoading , setIsLoading] = useState(false);
  const [error , setError] = useState('');


  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    const form = e.target;
    const email = form.userInput.value;
    const password = form.password1.value;
  
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result.ok) {
      console.log("User signed in successfully");
      window.location.href = "/admin";
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  }
  
  return (
    <AuthContainer>
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Log in
        </h1>
        <form className="flex max-w-md flex-col gap-4" onSubmit={handleLogin}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="userInput" value="Your email or username" />
            </div>
            <TextInput id="userInput"  type="text" placeholder="email or username" required />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password1" value="Your password" />
            </div>
            <TextInput id="password1"  type="password" required />
          </div>
          <div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <Button type="submit" className="my-3" isProcessing={isLoading}>Login</Button>
        </form>
      </div>
    </AuthContainer>
  )
}
