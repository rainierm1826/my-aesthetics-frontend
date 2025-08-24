export type Account = {
  account_id: string;
  provider: string;
  provider_id: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
};

export type SignUpResponse = {
  user: Account;
  status: boolean;
  message: string;
};

export type SignInResponse = {
  status: boolean;
  message: string;
  user: Account;
  access_token: string;
};

export type SignOutResponse = {
  status: boolean;
  message: string;
};
