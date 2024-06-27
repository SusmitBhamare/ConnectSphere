"use client"
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
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { login } from "./loginClient";

const Login = () => {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const loginHandler: SubmitHandler<LoginSchema> = async (data) => {
    await login(data);
  };

  return (
    <div className="min-h-screen max-w-screen flex flex-col justify-center items-center ">
      <h1 className="text-xl md:text-2xl  lg:text-3xl font-semibold my-4">
        Login
      </h1>
      <Form {...form}>
        <form
          className="px-2 w-full md:w-1/3"
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
        </form>
      </Form>
    </div>
  );
};

export default Login;
