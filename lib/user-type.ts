export type User = {
  user_id: number | string;
  account_id: number | string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  birthday: string | null; // ISO format date string or null
  age: number;
  image: string | null;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
};
