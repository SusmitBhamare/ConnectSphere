"use client";
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
import { loginSchema, LoginSchema } from "@/lib/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { login } from "../client/userClient";
import Link from "next/link";
import Image from "next/image";
import "../globals.css";
import login_image from "../../assets/images/login.jpg";
import { generateQuote } from "../utils/randomQuoteGenerator";
import { useRouter } from "next/navigation";
import useUserStore from "../zustand/store";

const Login = () => {
  const {token , setOnlineMembers} = useUserStore();
  const [quote, setQuote] = useState<{ quote: string; author: string }>({
    quote: "",
    author: "",
  });
  const router = useRouter();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const loginHandler: SubmitHandler<LoginSchema> = async (data) => {
    await login(data);
    form.reset({
      username: "",
      password: "",
    });
    
    router.push("/chat");
  };

  useEffect(() => {
    setQuote(generateQuote());
  }, [quote]);

  return (
    <div className="min-h-screen max-w-screen flex flex-row justify-center items-center">
      <div className="hidden md:block p-4 ">
        <div className="relative rounded-md p-2 ring-1 ring-primary-foreground/10 shadow-2xl">
          <Image
            src={login_image}
            width={600}
            height={600}
            alt="Login"
            placeholder="blur"
            blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            className="rounded-md"
          />
          {quote.quote.length > 0 && (
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-3/4 ring-2 ring-foreground/10 shadow-xl p-4 backdrop-blur-md text-center bg-black/50 text-white bg-opacity-75 rounded-md">
              {quote.quote}
              <div className="font-display"> - {quote.author}</div>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 w-full md:w-1/3 ">
        <h1 className="text-xl md:text-2xl  lg:text-3xl font-semibold mt-2 mb-4">
          Login
        </h1>
        <Form {...form}>
          <form
            className="px-2 w-full"
            onSubmit={form.handleSubmit(loginHandler)}
          >
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 w-full"
                      id="username"
                      placeholder="Enter your username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="mt-2 w-full"
                      id="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="my-4" type="submit">
              Login
            </Button>
            <p className="text-muted-foreground text-sm ">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-primary font-medium underline-offset-1 underline"
              >
                Register
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
