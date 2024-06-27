"use client"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod';
import { signupSchema, SignupSchema } from '@/lib/schemas/signupSchema';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {toast} from 'sonner';
import { doesUserExist, register } from './registerClient';

const Register = () => {
  const form = useForm<SignupSchema>({
    resolver : zodResolver(signupSchema)
  })

  const registerHandler: SubmitHandler<SignupSchema> = async ( data ) => {
    const isUser = await doesUserExist(data.username);
    if(isUser){
      toast.error('User already exists');
      return;
    }
    await register(data);
  }

  return (
    <div className="min-h-screen max-w-screen flex flex-col justify-center items-center ">
      <h1 className="text-xl md:text-2xl  lg:text-3xl font-semibold my-4">
        Register
      </h1>
      <Form {...form}>
        <form
          className="px-2 w-full md:w-1/3"
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
          <FormField
            name="role"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="role">Role</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="MOD">Mod</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="my-4" type="submit">
            Register
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default Register