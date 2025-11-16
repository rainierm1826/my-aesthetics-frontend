"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface MutationConfig<TData = unknown, TVariables = unknown> {
  // Fixed: Make payload required for all functions
  createFn?: (payload: TVariables) => Promise<TData>;
  updateFn?: (payload: TVariables) => Promise<TData>;
  deleteFn?: (payload: TVariables) => Promise<TData>;
  queryKey: string | string[] | (string | string[])[];
  successMessages?: {
    create?: string;
    update?: string;
    delete?: string;
  };
  onSuccess?: (data: TData, method: "post" | "patch" | "delete") => void;
  shouldResetOnCreate?: boolean;
}

export const useBaseMutation = <TData = unknown, TVariables = void>(
  method: "post" | "patch" | "delete",
  config: MutationConfig<TData, TVariables>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload?: TVariables): Promise<TData> => {
      if (method === "post" && config.createFn) {
        return config.createFn(payload as TVariables);
      }
      if (method === "patch" && config.updateFn) {
        return config.updateFn(payload as TVariables);
      }
      if (method === "delete" && config.deleteFn) {
        return config.deleteFn(payload as TVariables);
      }
      throw new Error(`No ${method} function provided`);
    },
    onSuccess: async (data) => {
      const keys = Array.isArray(config.queryKey[0])
        ? (config.queryKey as string[][])
        : [config.queryKey];

      for (const key of keys) {
        await queryClient.invalidateQueries({
          queryKey: Array.isArray(key) ? key : [key],
          exact: false, // invalidate nested queries too
        });
        // Force an immediate refetch
        await queryClient.refetchQueries({
          queryKey: Array.isArray(key) ? key : [key],
          exact: false,
        });
      }

      const messages = config.successMessages;
      const message =
        method === "post"
          ? messages?.create
          : method === "patch"
          ? messages?.update
          : messages?.delete;

      if (message) toast.success(message);
      config.onSuccess?.(data, method);
    },

    onError: async () => {
      // Also invalidate queries on error to ensure UI is in sync
      const keys = Array.isArray(config.queryKey[0])
        ? (config.queryKey as string[][])
        : [config.queryKey];

      for (const key of keys) {
        await queryClient.invalidateQueries({
          queryKey: Array.isArray(key) ? key : [key],
          exact: false,
        });
        await queryClient.refetchQueries({
          queryKey: Array.isArray(key) ? key : [key],
          exact: false,
        });
      }
      
      toast.error(`Please try again.`);
    },
  });
};
