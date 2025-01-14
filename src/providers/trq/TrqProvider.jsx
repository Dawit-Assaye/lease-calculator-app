"use client";

import React from "react";
import { parseErrorMessageToJSON } from "../../utilities/object.util";
import { toast } from "react-hot-toast";
import {
  defaultShouldDehydrateQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import SuperJSON from "superjson";
import { Icon } from "@iconify/react";

function handleThrowOnError(error) {
  if (error instanceof Error) {
    const parsedError = parseErrorMessageToJSON(error);

    toast.error(
      <div className="flex flex-col gap-1">
        {parsedError.message.map((message, index) => (
          <div className="flex gap-1 items-center">
            <Icon
              className="text-destructive"
              icon="ion:close-circle"
              width={20}
            />
            <span className="text-destructive" key={index}>
              {message}
            </span>
          </div>
        ))}
      </div>
    );

    return false;
  }
  return true;
}
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: Infinity,

      throwOnError: handleThrowOnError,
    },
    mutations: {
      onError: handleThrowOnError,
    },
    dehydrate: {
      serializeData: SuperJSON.serialize,
      shouldDehydrateQuery: (query) =>
        defaultShouldDehydrateQuery(query) || query.state.status === "pending",
    },
    hydrate: {
      deserializeData: SuperJSON.deserialize,
    },
  },
});

export default function TrqProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
