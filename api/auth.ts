import {
  SignInResponse,
  SignOutResponse,
  SignUpResponse,
} from "@/lib/auth-type";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function signUp(data: unknown): Promise<SignUpResponse> {
  try {
    if (!backendUrl) {
      throw new Error(
        "NEXT_PUBLIC_BACKEND_URL environment variable is not defined"
      );
    }
    const response = await fetch(`${backendUrl}/auth/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: SignUpResponse = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function signIn(data: unknown): Promise<SignInResponse> {
  try {
    if (!backendUrl) {
      throw new Error(
        "NEXT_PUBLIC_BACKEND_URL environment variable is not defined"
      );
    }
    const response = await fetch(`${backendUrl}/auth/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: SignInResponse = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function signOut(): Promise<SignOutResponse> {
  try {
    if (!backendUrl) {
      throw new Error(
        "NEXT_PUBLIC_BACKEND_URL environment variable is not defined"
      );
    }
    const response = await fetch(`${backendUrl}/auth/sign-out`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: SignOutResponse = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}
