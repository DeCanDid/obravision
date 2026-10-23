"use client";

import { useEffect } from "react";
import ErrorContent from "@/components/errors/ErrorContent";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorContent onRetry={reset} />;
}