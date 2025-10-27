import { useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "@/provider/store/authStore";
import { refreshToken } from "@/api/auth";

const TOKEN_REFRESH_INTERVAL = 5 * 60 * 1000; // Refresh every 5 minutes
let lastRefreshTime = 0;
let isRefreshing = false;

export const useTokenRefresh = () => {
  const { access_token, refreshAccessToken } = useAuthStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitialized = useRef(false);

  const attemptTokenRefresh = useCallback(async () => {
    if (!access_token || isRefreshing) return;

    const now = Date.now();
    // Don't refresh more than once per minute
    if (now - lastRefreshTime < 60000) return;

    isRefreshing = true;
    lastRefreshTime = now;

    try {
      const response = await refreshToken(access_token);
      if (response.status && response.access_token) {
        refreshAccessToken(response.access_token);
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    } finally {
      isRefreshing = false;
    }
  }, [access_token, refreshAccessToken]);

  useEffect(() => {
    if (!access_token || hasInitialized.current) return;

    hasInitialized.current = true;

    // Set up interval to refresh token periodically
    intervalRef.current = setInterval(() => {
      attemptTokenRefresh();
    }, TOKEN_REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [access_token, attemptTokenRefresh]);
};

