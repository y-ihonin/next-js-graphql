export interface ISignUpFormValues {
  username: string;
  email: string;
  password: string;
}

export interface ISignUpFormSuccess {
  jwt: string;
  user: {
    blocked: boolean;
    confirmed: boolean;
    documentId: string;
    id: string;
    email: string;
    username: string;
  };
}

export interface ISignUpForm {
  onSuccess: (data: ISignUpFormSuccess) => void;
}
