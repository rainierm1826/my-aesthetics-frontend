import { useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "@/provider/store/authStore";
import { refreshToken } from "@/api/auth";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/provider/store/userStore";

const TOKEN_REFRESH_INTERVAL = 5 * 60 * 1000; // Refresh every 5 minutes
const TOKEN_CHECK_INTERVAL = 60 * 1000; // Check token validity every minute
let lastRefreshTime = 0;
let isRefreshing = false;

// Helper to decode JWT and check expiration
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    
    const payload = JSON.parse(atob(parts[1]));
    const exp = payload.exp;
    
    if (!exp) return false;
    
    // Check if token is expired (with 1 minute buffer)
    return exp * 1000 < Date.now() + 60000;
  } catch {
    return true;
  }
}

export const useTokenRefresh = () => {
  const { access_token, refreshAccessToken, clearAuth } = useAuthStore();
  const { clearUser } = useUserStore();
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitialized = useRef(false);

  const handleLogout = useCallback(() => {
    clearAuth();
    clearUser();
    router.push("/sign-in?message=Your session has expired. Please sign in again.");
  }, [clearAuth, clearUser, router]);

  const checkTokenValidity = useCallback(() => {
    if (!access_token) return;
    
    if (isTokenExpired(access_token)) {
      console.log("[TokenRefresh] Token expired, logging out...");
      handleLogout();
    }
  }, [access_token, handleLogout]);

  const attemptTokenRefresh = useCallback(async () => {
    if (!access_token || isRefreshing) return;

    // Check if token is expired before attempting refresh
    if (isTokenExpired(access_token)) {
      console.log("[TokenRefresh] Token expired, logging out...");
      handleLogout();
      return;
    }

    const now = Date.now();
    // Don't refresh more than once per minute
    if (now - lastRefreshTime < 60000) return;

    isRefreshing = true;
    lastRefreshTime = now;

    try {
      const response = await refreshToken();
      if (response.status && response.access_token) {
        refreshAccessToken(response.access_token);
        console.log("[TokenRefresh] Token refreshed successfully");
      }
    } catch (error) {
      console.error("[TokenRefresh] Token refresh failed:", error);
      // If refresh fails, log out the user
      handleLogout();
    } finally {
      isRefreshing = false;
    }
  }, [access_token, refreshAccessToken, handleLogout]);

  useEffect(() => {
    if (!access_token || hasInitialized.current) return;

    hasInitialized.current = true;

    // Check token validity immediately
    checkTokenValidity();

    // Set up interval to check token validity
    checkIntervalRef.current = setInterval(() => {
      checkTokenValidity();
    }, TOKEN_CHECK_INTERVAL);

    // Set up interval to refresh token periodically
    intervalRef.current = setInterval(() => {
      attemptTokenRefresh();
    }, TOKEN_REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [access_token, attemptTokenRefresh, checkTokenValidity]);
};

