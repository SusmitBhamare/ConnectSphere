"use client"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod';
import { signupSchema, SignupSchema } from '@/lib/schemas/signupSchema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {toast} from 'sonner';
import { doesUserExist, register } from '../client/userClient';
import Image from 'next/image';
import { generateQuote } from '../utils/randomQuoteGenerator';
import register_image from '../../assets/images/register.jpg';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';

const Register = () => {
  const [quote, setQuote] = useState<{ quote: string; author: string }>({quote : "" , author : ""});
  const router = useRouter();
  const form = useForm<SignupSchema>({
    resolver : zodResolver(signupSchema)
  })

  const registerHandler: SubmitHandler<SignupSchema> = async ( data ) => {
    const isUser = await doesUserExist(data.username);
    if(isUser){
      toast.error('Username already taken');
      return;
    }
    if(await register(data)){
      form.reset({
        name: "",
        username: "",
        email: "",
        password: ""
      })
      router.push('/login');
    }
  }

  
  useEffect(() => {
    setQuote(generateQuote());
  }, []);

  return (
    <div className="min-h-screen max-w-screen  flex flex-row justify-center items-center ">
      <div className="hidden md:block p-4 ">
        <div className="relative rounded-md p-2 ring-1 ring-primary-foreground/10 shadow-2xl">
          <Image
            src={register_image}
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
    <div className="px-4 w-full md:w-1/3">
        <h1 className="text-xl md:text-2xl  lg:text-3xl font-semibold my-4">
          Register
        </h1>
        <Form {...form}>
          <form
            className="px-2 w-full"
            onSubmit={form.handleSubmit(registerHandler)}
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 w-full"
                      id="name"
                      placeholder="Enter your name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  <FormDescription>
                    This will be your public display name
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="mt-2 w-full"
                      id="email"
                      placeholder="Enter your email"
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
              Register
            </Button>
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-medium underline-offset-1 underline"
              >
                Login
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Register