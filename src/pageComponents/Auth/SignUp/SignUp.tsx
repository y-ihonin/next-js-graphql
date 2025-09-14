"use client";

import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

// hooks
import useUserProfile from '@/hooks/useUserProfile';
import { useToast } from "@/hooks/use-toast"

// components
import { cn } from "@/lib/utils"

// containers
import SignUpForm, { ISignUpFormSuccess } from "@/containers/forms/SignUpForm";

// types
import { ISignUp } from "./ISignUp";

const SignUp = ({ className, ...props }: ISignUp) => {
  const { refetch } = useUserProfile();
  const { toast } = useToast();
  const { push } = useRouter();

  const onSuccessSignUp = async (data: ISignUpFormSuccess) => {
    try {
      // Set JWT cookie for automatic sign-in
      await setCookie("jwt", data.jwt, {
        path: "/",
        maxAge: 60 * 60 * 8760, // 1 year
      });

      // Refetch user profile to update the app state
      await refetch();

      // Show success message
      toast({
        title: "Account Created Successfully!",
        description: `Welcome ${data.user.username}! You have been automatically signed in.`,
        duration: 5000,
      });

      // Redirect to home page
      push("/");
    } catch (error) {
      console.error("Error during automatic sign-in:", error);
      
      toast({
        title: "Account Created",
        description: "Your account was created successfully, but there was an issue signing you in. Please try signing in manually.",
        variant: "destructive",
        duration: 5000,
      });

      // Redirect to sign-in page as fallback
      push("/sign-in");
    }
  }

  // render
  return (
    <div className="flex justify-center items-center h-screen">
      <div className={cn("flex flex-col gap-6 max-w-[600px] w-full", className)} {...props}>
        <SignUpForm onSuccess={onSuccessSignUp} />
      </div>
    </div>
  )
}

export default SignUp;
