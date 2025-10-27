"use client";

import { useTokenRefresh } from "@/hooks/useTokenRefresh";

export function TokenRefreshProvider() {
  useTokenRefresh();
  return null;
}
