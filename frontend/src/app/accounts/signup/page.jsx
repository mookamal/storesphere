"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoReload } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formatMsgServer } from "@/lib/utilities";
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
import { useState } from "react";
import Logo from "@/components/my/Logo";
import Link from "next/link";
const SIGNUP_URL = "/auth/signup";

const formSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    username: z.string().min(2, "Please enter a valid username"),
    password1: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    password2: z.string(),
  })
  .refine((data) => data.password1 === data.password2, {
    message: "Passwords do not match",
    path: ["password2"],
  });

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password1: "",
      password2: "",
    },
  });
  async function onSubmit(values) {
    setIsLoading(true);
    try {
      const response = await axios.post(SIGNUP_URL, values);
      if (response.statusText === "OK") {
        setIsLoading(false);
        setSuccessMessage(response.data.success);
        form.reset();
      } else {
        console.log("response error".response);
      }
    } catch (error) {
      if (error.response.data.error) {
        const errorList = error.response.data.error;
        if (errorList.email) {
          form.setError("email", { message: errorList.email[0] });
        }
        if (errorList.username) {
          form.setError("username", { message: errorList.username[0] });
        }
        if (errorList.password1) {
          form.setError("password1", { message: errorList.password1[0] });
        }
        if (errorList.password2) {
          form.setError("password2", { message: errorList.password2[0] });
        }
      }
    }
    setIsLoading(false);
  }
  return (
    <section className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full rounded-lg  md:mt-0 sm:max-w-md xl:p-0">
        <Card>
          <CardHeader className="flex flex-col gap-3">
            <CardTitle className="w1/2">
              <Logo />
            </CardTitle>

            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Username" {...field} />
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* button submit */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <IoReload className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Register
                </Button>
                {successMessage && (
                  <p className="text-green-500  font-bold">{successMessage}</p>
                )}
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <p>
              Already have an account? <Link href="/login"> Login</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
