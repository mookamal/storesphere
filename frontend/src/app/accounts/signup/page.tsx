"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoReload } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useCallback } from "react";
import Logo from "@/components/my/Logo";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import ROUTES from "@/data/links";

const SIGNUP_URL = "/auth/signup";

const formSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password1: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
        message: "Password must include both letters and numbers",
      }),
    password2: z.string(),
  })
  .refine((data) => data.password1 === data.password2, {
    message: "Passwords do not match",
    path: ["password2"],
  });


type SignupFormValues = z.infer<typeof formSchema>;

export default function Signup(): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const router = useRouter();


  const form = useForm<SignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password1: "",
      password2: "",
    },
  });


  const onSubmit = useCallback(async (values: SignupFormValues): Promise<void> => {
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post(SIGNUP_URL, {
        email: values.email,
        password1: values.password1,
        password2: values.password2,
      });

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Account created successfully. Redirecting...");
        form.reset();
        
        setTimeout(() => {
          router.push(ROUTES.login.url);
        }, 2000);
      }
    } catch (err: any) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        const errorList = err.response.data.error;
        
        if (errorList.email) {
          form.setError("email", { message: errorList.email[0] });
        }
        if (errorList.password) {
          form.setError("password1", { message: errorList.password[0] });
        }
        
        setError(errorList.email?.[0] || "Registration failed. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [form, router]);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 bg-gray-50 dark:bg-gray-900"
    >
      <div className="w-full rounded-lg md:mt-0 sm:max-w-md xl:p-0">
        <Card className="shadow-xl dark:border dark:border-gray-700">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Create Your Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-gray-300">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="you@example.com" 
                          {...field}
                          className="dark:bg-gray-800 dark:border-gray-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-gray-300">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="dark:bg-gray-800 dark:border-gray-700"
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        At least 8 characters, including both letters and numbers
                      </p>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-gray-300">Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="dark:bg-gray-800 dark:border-gray-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm">
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-2 rounded-md text-sm">
                    {successMessage}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <IoReload className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Register
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="text-center justify-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link 
                href={ROUTES.login.path} 
                className="text-purple-600 hover:underline"
              >
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </motion.section>
  );
}
