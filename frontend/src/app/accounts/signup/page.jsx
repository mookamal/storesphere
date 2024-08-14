'use client';

import AuthContainer from "../../../components/accounts/AuthContainer";
import Link from "next/link";
import { Button , Label , TextInput} from "flowbite-react";
import { useState } from "react";
import { ImGoogle3 } from "react-icons/im";
import { HiCheckCircle } from "react-icons/hi";
import { formatMsgServer } from "../../../lib/utilities";
import axios from 'axios';
const  SIGNUP_URL = "/auth/signup"

export default function Signup() {
  const [password , setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
        setPasswordError('Passwords do not match');
        return;
    }

    setPassword('');
    setConfirmPassword('');
    setPasswordError('');

    const formData = new FormData(e.target);
    const objectFromForm = Object.fromEntries(formData);
    const jsonData = JSON.stringify(objectFromForm);

    try {

        const response = await axios.post(SIGNUP_URL, jsonData);

        if (response.statusText === "OK") {
          setSuccessMessage(response.data.success);
        } else {
          setFormErrors({general:'Registration failed. Please try again.'});
        }

    } catch (error) {
      const errorMessage = error.response.data.error.user;
      const err = formatMsgServer(errorMessage);
      setFormErrors(err);
    }
    setIsLoading(false);
}


  return (
        <AuthContainer>
          {successMessage && <div className="w-72 p-3 mx-auto my-2 rounded-md bg-green-200 flex items-center justify-center">
            <HiCheckCircle /> 
            <p className="font-bold mx-2">{successMessage}</p>
          </div>}

          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <form className="space-y-4 md:space-y-6" action="#" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Your username
                </Label>
                <TextInput 
                  type="text"
                  name="username"
                  id="username"
                  placeholder="username"
                  required
                />
              </div>
              {formErrors.username && <p className="text-red-500 text-sm">{formErrors.username}</p>}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <TextInput 
                  type="email"
                  name="email"
                  id="email"
                  placeholder="name@company.com"
                  required
                />
              </div>
              {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <TextInput
                  type="password"
                  name="password1"
                  id="password1"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm password
                </label>
                <TextInput
                  type="password"
                  name="password2"
                  id="password2"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
              {formErrors.password1 && <p className="text-red-500 text-sm">{formErrors.password1}</p>}
              {formErrors.non_field_errors && <p className="text-red-500 text-sm">{formErrors.non_field_errors}</p>}
              {formErrors.general && <p className="text-red-500 text-sm">{formErrors.general}</p>}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <TextInput
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="terms"
                    className="font-light text-gray-500 dark:text-gray-300"
                  >
                    I accept the{" "}
                    <a
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                      href="#"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              <Button
              isProcessing={isLoading}
              size="lg"
              type="submit"
              className="w-full text-gray-900 bg-white border border-gray-200 focus:outline-none hover:bg-green-300 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                Create an account
              </Button>
            
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </AuthContainer>
  );
}
