import { Controller } from 'react-hook-form';
import { useMutation } from "@apollo/client";

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
import useVerify2FALoginForm from "./useForm";
import { useToast } from "@/hooks/use-toast"

// utils
import apolloErrorHandler from '@/utils/apolloErrorHandler';

// graphql
import { verify2FALoginMutation } from "@/graphql/mutations/verify2FALoginMutation";

// types
import { IVerify2FALogin, IVerify2FALoginValues } from "./IVerify2FALogin";



const Verify2FALogin = ({ userId, onSuccess }: IVerify2FALogin) => {
  const { control, handleSubmit, errors } = useVerify2FALoginForm();
  const { toast } = useToast()

  const [verify2FALogin, { loading }] = useMutation(verify2FALoginMutation, {
    onCompleted: (data) => {
      onSuccess(data.verify2FALogin);
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
    
  const onSubmit = (data: IVerify2FALoginValues) => {
    verify2FALogin({ variables: { input: { code: data.code, userId } } });
  }

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
                name="code"
                control={control}
                render={({ field }) => (
                  <Input
                    id="code"
                    type="text"
                    placeholder="123456"
                    required
                    {...field}
                  />
                )}
              />
              {errors.code && (
                <p className="text-red-500">{errors.code.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Verify'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default Verify2FALogin;
