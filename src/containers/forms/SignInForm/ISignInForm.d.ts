export interface ISignInFormValues {
  email: string;
  password: string;
}

export interface ISignInFormSuccess {
  userId: string;
  twoFactorRequired: boolean;
  jwt: string;
}

export interface ISignInForm {
  onSuccess: (data: ISignInFormSuccess) => void;
}
