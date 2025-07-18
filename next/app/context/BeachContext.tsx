"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import type { Beach } from "@/app/types/beaches";
import type { ForecastData } from "@/app/types/forecast";
import type { BeachScoreMap } from "@/app/types/scores";
import type { FilterType } from "@/app/types/beaches";

interface BeachSort {
  field: string;
  direction: "asc" | "desc";
}

interface BeachContextType {
  // Core state
  beaches: Beach[];
  setBeaches: (beaches: Beach[]) => void;

  // Filter state
  filters: FilterType;
  setFilters: (filters: FilterType) => void;

  // Forecast state
  forecastData: ForecastData | null;
  setForecastData: (data: ForecastData | null) => void;

  // Scores state
  beachScores: BeachScoreMap;
  setBeachScores: (scores: BeachScoreMap) => void;

  // UI state
  currentPage: number;
  setCurrentPage: (page: number) => void;
  sort: BeachSort;
  setSort: (sort: BeachSort) => void;

  // Status flags
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Today's good beaches
  todayGoodBeaches: { beachId: string; region: string; score: number }[];
  setTodayGoodBeaches: (
    beaches: { beachId: string; region: string; score: number }[]
  ) => void;

  // Separate loading states for different data types
  loadingStates: {
    forecast: boolean;
    beaches: boolean;
    scores: boolean;
  };
  setLoadingState: (
    type: "forecast" | "beaches" | "scores",
    isLoading: boolean
  ) => void;
}

const BeachContext = createContext<BeachContextType | undefined>(undefined);

export function BeachProvider({
  children,
  initialBeaches,
  initialFilters,
}: {
  children: ReactNode;
  initialBeaches: Beach[];
  initialFilters?: FilterType;
}) {
  // Core data
  const [beaches, setBeaches] = useState<Beach[]>(initialBeaches);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [beachScores, setBeachScores] = useState<BeachScoreMap>({});

  // Memoize todayGoodBeaches to prevent unnecessary rerenders
  const [todayGoodBeaches, setTodayGoodBeaches] = useState<
    { beachId: string; region: string; score: number }[]
  >([]);

  // Filters and sorting
  const [filters, setFilters] = useState<FilterType>(
    initialFilters || {
      location: {
        region: "",
        regionId: "",
        country: "",
        continent: "",
      },
      waveType: [],
      difficulty: [],
      minPoints: 0,
      crimeLevel: [],
      sharkAttack: [],
      searchQuery: "",
      hasAttack: false,
    }
  );

  // Memoize the setFilters callback to prevent unnecessary rerenders
  const memoizedSetFilters = useCallback((newFilters: FilterType) => {
    setFilters(newFilters);
  }, []);

  const [sort, setSort] = useState<BeachSort>({
    field: "score",
    direction: "desc",
  });

  // UI state
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Add loading states
  const [loadingStates, setLoadingStates] = useState({
    forecast: false,
    beaches: false,
    scores: false,
  });

  const setLoadingState = useCallback(
    (type: "forecast" | "beaches" | "scores", isLoading: boolean) => {
      setLoadingStates((prev) => ({
        ...prev,
        [type]: isLoading,
      }));
    },
    []
  );

  // Memoize the setBeachScores callback to prevent unnecessary rerenders
  const memoizedSetBeachScores = useCallback((scores: BeachScoreMap) => {
    console.log("Setting beach scores:", scores); // Debug log
    setBeachScores(scores);
  }, []);

  // Context value (just state and setters)
  const value = useMemo<BeachContextType>(
    () => ({
      // Data
      beaches,
      setBeaches,
      forecastData,
      setForecastData,
      beachScores,
      setBeachScores: memoizedSetBeachScores,
      todayGoodBeaches,
      setTodayGoodBeaches,

      // Filters and UI
      filters,
      setFilters: memoizedSetFilters,
      sort,
      setSort,
      currentPage,
      setCurrentPage,

      // Status
      isLoading,
      setIsLoading,

      // Loading states
      loadingStates,
      setLoadingState,
    }),
    [
      beaches,
      forecastData,
      beachScores,
      todayGoodBeaches,
      filters,
      sort,
      currentPage,
      isLoading,
      loadingStates,
      memoizedSetFilters,
      setLoadingState,
      memoizedSetBeachScores,
    ]
  );

  return (
    <BeachContext.Provider value={value}>{children}</BeachContext.Provider>
  );
}

export function useBeach() {
  const context = useContext(BeachContext);
  if (context === undefined) {
    throw new Error("useBeach must be used within a BeachProvider");
  }
  return context;
}
