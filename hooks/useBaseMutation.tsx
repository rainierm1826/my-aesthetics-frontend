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
      // Normalize queryKey config:
      // - string -> [[string]]
      // - string[] (e.g. ["appointment","history"]) -> [["appointment"],["history"]]
      // - string[][] already treated as list of keys
      const q = config.queryKey as any;
      let normalized: string[][];
      if (Array.isArray(q)) {
        if (q.length > 0 && q.every((k) => typeof k === "string")) {
          normalized = (q as string[]).map((k) => [k]);
        } else if (Array.isArray(q[0])) {
          normalized = q as string[][];
        } else {
          normalized = [[JSON.stringify(q)]]; // fallback, unlikely
        }
      } else if (typeof q === "string") {
        normalized = [[q]];
      } else {
        normalized = [[JSON.stringify(q)]];
      }

      for (const key of normalized) {
        await queryClient.invalidateQueries({
          queryKey: key,
          exact: false,
        });
        await queryClient.refetchQueries({
          queryKey: key,
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

    onError: async (error: Error) => {
      // Normalize and invalidate on error as well
      const q = config.queryKey as any;
      let normalized: string[][];
      if (Array.isArray(q)) {
        if (q.length > 0 && q.every((k) => typeof k === "string")) {
          normalized = (q as string[]).map((k) => [k]);
        } else if (Array.isArray(q[0])) {
          normalized = q as string[][];
        } else {
          normalized = [[JSON.stringify(q)]];
        }
      } else if (typeof q === "string") {
        normalized = [[q]];
      } else {
        normalized = [[JSON.stringify(q)]];
      }

      for (const key of normalized) {
        await queryClient.invalidateQueries({
          queryKey: key,
          exact: false,
        });
        await queryClient.refetchQueries({
          queryKey: key,
          exact: false,
        });
      }
      
      toast.error(`${error.message}`);
    },
  });
};
