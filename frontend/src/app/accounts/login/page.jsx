"use client";

import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import AuthContainer from "../../../components/accounts/AuthContainer";
import { useState } from "react";
import { isEmail } from "../../../lib/utilities";

export default function Login() {
  const [isLoading , setIsLoading] = useState(false);
  const [error , setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const isEmailInput = isEmail(e.target.userInput.value);
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: isEmailInput ? e.target.userInput.value : "",
          username: !isEmailInput ? e.target.userInput.value : "",
          password: e.target.password1.value
        }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        setError("One or more details is incorrect");
      } else {
        console.log("Lon in successfully");
      }


    } catch (error) {
      setError('Failed to login');
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
            <TextInput id="userInput" type="text" placeholder="email or username" required />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password1" value="Your password" />
            </div>
            <TextInput id="password1" type="password" required />
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
