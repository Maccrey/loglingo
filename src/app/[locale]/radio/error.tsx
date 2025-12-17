"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Radio Page Error:", error);
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-white bg-black">
      <h2 className="text-xl font-bold">Something went wrong!</h2>
      <p className="text-white/60">{error.message}</p>
      <Button
        onClick={() => reset()}
        variant="secondary"
        className="border-white/20 text-white hover:bg-white/10"
      >
        Try again
      </Button>
    </div>
  );
}
