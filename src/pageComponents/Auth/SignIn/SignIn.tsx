"use client";

import { useState } from 'react';
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

// hooks
import useUserProfile from '@/hooks/useUserProfile';

// components
import { cn } from "@/lib/utils"

// containers
import SignInForm, { ISignInFormSuccess} from "@/containers/forms/SignInForm";
import Verify2FALogin, { IVerify2FALoginSuccess } from "@/containers/forms/Verify2FALogin";

// types
import { ISignIn } from "./ISignIn";

const SignIn = ({ className, ...props }: ISignIn) => {
  const [isTwoFactorAuth, setIsTwoFactorAuth] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const { refetch } = useUserProfile();

  const { push } = useRouter();

  const onSuccessLogin = async (data: ISignInFormSuccess) => {
    if (data.twoFactorRequired) {
      setIsTwoFactorAuth(true);
      setUserId(data.userId);

      return;
    }

    await setCookie("jwt", data.jwt, {
      path: "/",
      maxAge: 60 * 60 * 8760,
    });

    await refetch();

    push("/");
  }

  const onSuccessVerify2FALogin = async (data: IVerify2FALoginSuccess) => {
    await setCookie("jwt", data.jwt, {
      path: "/",
      maxAge: 60 * 60 * 8760,
    });

    await refetch();

    push("/");
  }

  // render
  return (
    <div className="flex justify-center items-center h-screen">
      <div className={cn("flex flex-col gap-6 max-w-[600px] w-full", className)} {...props}>
        {
          isTwoFactorAuth ? (
            <Verify2FALogin userId={userId || ""} onSuccess={onSuccessVerify2FALogin} />
          ) : (
            <SignInForm onSuccess={onSuccessLogin} />
          )
        }
      </div>
    </div>
  )
}

export default SignIn;
