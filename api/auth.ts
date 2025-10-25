import {
  SignInResponse,
  SignOutResponse,
  SignUpResponse,
} from "@/lib/types/auth-type";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function signUp(data: unknown): Promise<SignUpResponse> {
  try {
    if (!backendUrl) {
      throw new Error(
        "NEXT_PUBLIC_BACKEND_URL environment variable is not defined"
      );
    }
    const response = await fetch(`${backendUrl}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status == 409) {
        throw new Error("Email already exist");
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: SignUpResponse = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function signUpAdmin(data: unknown): Promise<SignUpResponse> {
  try {
    if (!backendUrl) {
      throw new Error(
        "NEXT_PUBLIC_BACKEND_URL environment variable is not defined"
      );
    }
    const response = await fetch(`${backendUrl}/auth/admin-signup`, {
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

export async function verifyOTP(data: unknown): Promise<SignUpResponse> {
  try {
    if (!backendUrl) {
      throw new Error(
        "NEXT_PUBLIC_BACKEND_URL environment variable is not defined"
      );
    }
    const response = await fetch(`${backendUrl}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(body.message);
    }
    return body as SignUpResponse;
  } catch (error) {
    throw error;
  }
}

export async function resendOTP(data: unknown): Promise<SignUpResponse> {
  try {
    if (!backendUrl) {
      throw new Error(
        "NEXT_PUBLIC_BACKEND_URL environment variable is not defined"
      );
    }
    const response = await fetch(`${backendUrl}/auth/resend-otp`, {
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
    const response = await fetch(`${backendUrl}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(body.message);
    }

    return body as SignInResponse;
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
    const response = await fetch(`${backendUrl}/auth/signout`, {
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

export async function forgotPassword(data: unknown): Promise<SignUpResponse> {
  try {
    if (!backendUrl) {
      throw new Error(
        "NEXT_PUBLIC_BACKEND_URL environment variable is not defined"
      );
    }
    const response = await fetch(`${backendUrl}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(body.message || "Failed to request password reset");
    }
    return body as SignUpResponse;
  } catch (error) {
    throw error;
  }
}

export async function verifyOTPForgotPassword(data: unknown): Promise<SignUpResponse> {
  try {
    if (!backendUrl) {
      throw new Error(
        "NEXT_PUBLIC_BACKEND_URL environment variable is not defined"
      );
    }
    const response = await fetch(`${backendUrl}/auth/verify-otp-forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(body.message || "Failed to verify OTP");
    }
    return body as SignUpResponse;
  } catch (error) {
    throw error;
  }
}

export async function resetPassword(data: unknown): Promise<SignUpResponse> {
  try {
    if (!backendUrl) {
      throw new Error(
        "NEXT_PUBLIC_BACKEND_URL environment variable is not defined"
      );
    }
    const response = await fetch(`${backendUrl}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(body.message || "Failed to reset password");
    }
    return body as SignUpResponse;
  } catch (error) {
    throw error;
  }
}

export async function sendEmailVerificationOTP(data: unknown): Promise<SignUpResponse> {
  try {
    if (!backendUrl) {
      throw new Error(
        "NEXT_PUBLIC_BACKEND_URL environment variable is not defined"
      );
    }
    const response = await fetch(`${backendUrl}/auth/send-email-verification-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(body.message || "Failed to send verification code");
    }
    return body as SignUpResponse;
  } catch (error) {
    throw error;
  }
}

export async function verifyEmailOTP(data: unknown): Promise<SignUpResponse> {
  try {
    if (!backendUrl) {
      throw new Error(
        "NEXT_PUBLIC_BACKEND_URL environment variable is not defined"
      );
    }
    const response = await fetch(`${backendUrl}/auth/verify-email-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(body.message || "Failed to verify email");
    }
    return body as SignUpResponse;
  } catch (error) {
    throw error;
  }
}


