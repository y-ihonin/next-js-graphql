"use client";

import { Controller } from 'react-hook-form';
import { useMutation } from "@apollo/client";
import Link from "next/link";

// components
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// hooks
import useSignUpForm from "./useForm";
import { useToast } from "@/hooks/use-toast"

// utils
import apolloErrorHandler from '@/utils/apolloErrorHandler';

// graphql
import { signUpMutation } from "@/graphql/mutations/signUp";

// types
import { ISignUpForm, ISignUpFormValues } from './ISignUpForm';

const SignUpForm = ({ onSuccess }: ISignUpForm) => {
  const { control, handleSubmit, errors } = useSignUpForm();
  const { toast } = useToast()

  const [register, { loading }] = useMutation(signUpMutation, {
    onCompleted: (data) => {
      onSuccess(data.register);
    },
    onError: (err) => {
      const errorMessage = apolloErrorHandler(err);

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      })
    }
  });

  const onSubmit = (data: ISignUpFormValues) => {
    const payload = {
      username: data.username,
      email: data.email,
      password: data.password,
    }

    register({ variables: { input: payload } })
  };

  // render  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Create your account to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <Input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    required
                    {...field}
                  />
                )}
              />
              {errors.username && (
                <p className="text-red-500">{errors.username.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    {...field}
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input id="password" type="password" required {...field} />
                )}
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/sign-in" className="underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default SignUpForm;
