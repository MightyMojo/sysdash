"use client";

import { useCallback, useEffect, useState } from "react";
import { type DataError, toDataError } from "@/lib/errors";

export type RemoteState<T> =
  | { phase: "loading" }
  | { phase: "success"; data: T; updatedAt: Date }
  | { phase: "error"; error: DataError };

export type RemoteData<T> = {
  state: RemoteState<T>;
  /** True while a request is in flight (initial load AND refresh). */
  isFetching: boolean;
  refresh: () => void;
};

/**
 * Loads data on mount and on `refresh()`. Cancels in-flight requests on unmount or refresh,
 * so a slow old response can never overwrite a newer one.
 * `load` must be a stable reference (module-level function).
 */
export function useRemoteData<T>(load: (signal: AbortSignal) => Promise<T>): RemoteData<T> {
  const [state, setState] = useState<RemoteState<T>>({ phase: "loading" });
  const [isFetching, setIsFetching] = useState(true);
  const [requestId, setRequestId] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setIsFetching(true);
    // A retry after an error shows the skeleton again; after a success the old data stays visible.
    setState((previous) => (previous.phase === "error" ? { phase: "loading" } : previous));

    load(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setState({ phase: "success", data, updatedAt: new Date() });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({ phase: "error", error: toDataError(error) });
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsFetching(false);
      });

    return () => controller.abort();
  }, [load, requestId]);

  const refresh = useCallback(() => setRequestId((id) => id + 1), []);

  return { state, isFetching, refresh };
}
