"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@apollo/client";

// hooks
import useUserProfile from "@/hooks/useUserProfile";
import { useToast } from "@/hooks/use-toast";

// utils
import apolloErrorHandler from '@/utils/apolloErrorHandler';

// graphql
import { get2FAInfoQuery } from "@/graphql/queries/get2FAInfo";
import { generate2FASecretMutation } from "@/graphql/mutations/generate2FA";
import { enable2FAMutation } from "@/graphql/mutations/enable2FA";

// components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { disable2FAMutation } from "@/graphql/mutations/enable2FA copy";

// validation schema
const profileSchema = z.object({
  twoFactorCode: z.string().min(6, "2FA code must be 6 digits").max(6, "2FA code must be 6 digits"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile = () => {
  const { data: userData } = useUserProfile();
  const { toast } = useToast();

  const { data: twoFAData, loading: twoFADataLoading, refetch: refetchTwoFAData } = useQuery(get2FAInfoQuery, {
    fetchPolicy: "network-only",
  });
  
  const [generate2FASecret, { loading: generate2FASecretLoading }] = useMutation(generate2FASecretMutation, {
    onCompleted: () => {
      refetchTwoFAData();
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

  const [enable2FA] = useMutation(enable2FAMutation, {
    onCompleted: (data) => {
      refetchTwoFAData();

      toast({
        title: "Success",
        description: data.enable2FA.message,
        variant: "default",
        duration: 5000,
      })
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

  const [disable2FA] = useMutation(disable2FAMutation, {
    onCompleted: (data) => {
      refetchTwoFAData();

      toast({
        title: "Success",
        description: data.disable2FA.message,
        variant: "default",
        duration: 5000,
      })
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

  const { get2FAInfo: { qrCodeUrl, twoFactorRequired } = {} } = twoFAData || {};
  const buttonText = twoFactorRequired ? "Disable 2FA" : "Enable 2FA";

  const {
    
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const twoFactorCode = watch("twoFactorCode");

  // methods
  const onSubmit = async (data: ProfileFormData) => {
    if (!twoFactorRequired) {
      enable2FA({
        variables: {
          input: {
            verificationCode: data.twoFactorCode,
          },
        },
      });

      return;
    }

    disable2FA({
      variables: {
        input: {
          verificationCode: data.twoFactorCode,
        },
      },
    });
  };

  // effects
  useEffect(() => {
    if (!twoFAData?.twoFASecret) {
      generate2FASecret()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [twoFAData?.twoFASecret]);

  // render
  if (twoFADataLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Manage your account settings and security preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Info */}
          <div className="space-y-2">
            <Label className="text-base font-medium">User Information</Label>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Email:</span> {userData?.email || "Loading..."}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Username:</span> {userData?.username || "Loading..."}
              </p>
            </div>
          </div>

          {/* 2FA Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              {/* <Switch
                checked={showQRCode}
                onCheckedChange={handle2FAToggle}
                disabled={isLoading}
              /> */}
            </div>

            {/* 2FA Status */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    twoFactorRequired ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                <span className="text-sm font-medium">
                  { twoFactorRequired ? "2FA Enabled" : "2FA Disabled"}
                </span>
              </div>
            </div>

            {/* QR Code Display */}
            {true && (
              <div className="space-y-4 rounded-lg border p-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Scan QR Code</Label>
                  <p className="text-sm text-muted-foreground">
                    Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                  </p>
                </div>
                <div className="flex justify-center">
                  {
                    qrCodeUrl && (
                      <Image
                        src={qrCodeUrl || ""}
                        alt="2FA QR Code"
                        className="h-48 w-48 rounded-lg border"
                        width={192}
                        height={192}
                      />
                    )
                  }
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twoFactorCode" className="text-sm font-medium">
                    Enter 6-digit code from your authenticator app
                  </Label>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                      id="twoFactorCode"
                      type="text"
                      placeholder="123456"
                      maxLength={6}
                      {...register("twoFactorCode")}
                      className={errors.twoFactorCode ? "border-red-500" : ""}
                    />
                    {errors.twoFactorCode && (
                      <p className="text-sm text-red-500">
                        {errors.twoFactorCode.message}
                      </p>
                    )}
                    <div className="flex space-x-2">
                      <Button
                        type="submit"
                        variant={twoFactorRequired ? "destructive" : "default"}
                        disabled={!twoFactorCode || twoFactorCode.length !== 6 || generate2FASecretLoading}
                        className="flex-1"
                      >
                        {buttonText}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          reset();
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Disable 2FA Button */}
            {/* {twoFactorRequired && (
              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  onClick={handleDisable2FA}
                  // disabled={setup2FALoading}
                >
                  {isLoading ? "Disabling..." : "Disable 2FA"}
                </Button>
              </div>
            )} */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
