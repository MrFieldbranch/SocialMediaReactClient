import { useState, useEffect } from "react";
import { IFetchState } from "../types/IFetchState";

function useFetchData<T>(
  asyncFunction: (signal: AbortSignal) => Promise<T>,
  dependencies: any[] = []
): IFetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    asyncFunction(controller.signal)
      .then((result: T) => {
        setData(result);
        setError(null);
      })
      .catch((err: any) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : String(err));
        }
      });

    return () => {
      controller.abort();
    };
  }, dependencies);

  return { data, error };
}

export default useFetchData;
