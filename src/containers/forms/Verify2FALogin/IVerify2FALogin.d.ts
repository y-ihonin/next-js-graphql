export interface IVerify2FALoginValues {
  code: string;
}

export interface IVerify2FALoginSuccess {
  userId: string;
  jwt: string;
}

export interface IVerify2FALogin {
  userId: string;
  onSuccess: (data: IVerify2FALoginSuccess) => void;
} 
