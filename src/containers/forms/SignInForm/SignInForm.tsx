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
import useSignInForm from "./useForm";
import { useToast } from "@/hooks/use-toast"

// utils
import apolloErrorHandler from '@/utils/apolloErrorHandler';

// graphql
import { signInMutation } from "@/graphql/mutations/signIn";

// types
import { ISignInForm, ISignInFormValues } from './ISignInForm';

const SignInForm = ({ onSuccess }: ISignInForm) => {
  const { control, handleSubmit, errors } = useSignInForm();
  const { toast } = useToast()

  const [login, { loading }] = useMutation(signInMutation, {
    onCompleted: (data) => {
      onSuccess(data.login);
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

  const onSubmit = (data: ISignInFormValues) => {
    const payload = {
      identifier: data.email,
      password: data.password,
    }

    login({ variables: { input: payload } })
  };

  // render  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    id="email"
                    type="email"
                    placeholder="mail@example.com"
                    data-testid="email-input"
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
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {/* <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link> */}
              </div>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    id="password"
                    type="password"
                    required
                    data-testid="password-input"
                    {...field}
                  />
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
              data-testid="login-button"
            >
              {loading ? 'Loading...' : 'Login'}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default SignInForm;
