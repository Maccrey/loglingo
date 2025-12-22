import { useQuery } from "@tanstack/react-query";

export interface AggregateSnapshot {
  average: {
    diaries7d: number;
    archivesTotal: number;
    adviceOpen: number;
    level: string;
    score: number;
  };
  target: {
    diaries7d: number;
    archivesTotal: number;
    adviceOpen: number;
    level: string;
    score: number;
  };
}

async function fetchAggregate(): Promise<AggregateSnapshot> {
  const res = await fetch("/api/learning/aggregate", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("aggregate_failed");
  }
  return res.json();
}

export function useLearningAggregate(enabled = true) {
  return useQuery<AggregateSnapshot>({
    queryKey: ["learning-aggregate"],
    queryFn: fetchAggregate,
    enabled,
    staleTime: 60_000,
  });
}
