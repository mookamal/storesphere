"use client";
import axios from "axios";
import Lottie from "lottie-react";
import storeAnimation from "@/assets/animation/store.json";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoReload } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import Logo from "@/components/my/Logo";
const CREATE_STORE_URL = "/api/store-create";

const formSchema = z.object({
  storeName: z.string().min(3, { message: "Please enter valid store name." }),
});

export default function StoreCreate() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storeName: "",
    },
  });
  async function onSubmit(values) {
    setIsLoading(true);
    setError("");
    const response = await axios.post(CREATE_STORE_URL, values);
    if (response.statusText === "OK") {
      window.location.href = `/admin/store/${response.data.domain}`;
    } else {
      setError("Failed to create store. Please try again.");
      setIsLoading(false);
    }
  }
  return (
    <section className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full rounded-lg  md:mt-0 sm:max-w-md xl:p-0">
        <Card>
          <CardHeader className="flex flex-col gap-3">
            <CardTitle className="w1/2">
              <Logo />
            </CardTitle>

            <CardTitle>Create store</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {isLoading ? (
              <div className="loading">
                <Lottie animationData={storeAnimation} loop={true} />

                <p className="text-sm text-center">Creating store...</p>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="storeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store name</FormLabel>
                        <FormControl>
                          <Input placeholder="Store name" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
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
                    Submit
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
