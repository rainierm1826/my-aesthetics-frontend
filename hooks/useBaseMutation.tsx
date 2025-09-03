"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface MutationConfig<TData = unknown, TVariables = unknown> {
  createFn?: (payload?: TVariables) => Promise<TData>;
  updateFn?: (payload: TVariables) => Promise<TData>;
  deleteFn?: (payload: TVariables) => Promise<TData>;
  queryKey: string | string[];
  successMessages?: {
    create?: string;
    update?: string;
    delete?: string;
  };
  onSuccess?: (data: TData, method: "post" | "patch" | "delete") => void;
  shouldResetOnCreate?: boolean;
}

export const useBaseMutation = <TData=unknown, TVariables=void>(
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: Array.isArray(config.queryKey)
          ? config.queryKey
          : [config.queryKey],
        type: "all",
      });
      const messages = config.successMessages;
      const message = method === "post" ? messages?.create : messages?.update === "patch" ? messages.update : messages?.delete;
      toast.success(message);
      config.onSuccess?.(data, method);
    },
    onError: (error: Error) => {
      toast.error(`${error}`);
    },
  });
};
