import { useMemo } from "react";
import { useBeach } from "@/app/context/BeachContext";
import type { BeachWithScore } from "@/app/types/scores";

export function useFilteredBeaches() {
  const { beaches, filters, beachScores, forecastData } = useBeach();

  return useMemo(() => {
    if (!beaches?.length) return [];

    // Add scores to beaches
    const beachesWithScores = beaches.map((beach) => ({
      ...beach,
      score: beachScores[beach.id]?.score || 0,
    })) as BeachWithScore[];

    // Filter beaches based on filters
    const filtered = beachesWithScores.filter((beach) => {
      // Search filter
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        const nameMatch = beach.name.toLowerCase().includes(searchLower);
        const regionMatch = beach.region?.name
          .toLowerCase()
          .includes(searchLower);
        const countryMatch = beach.region?.country?.name
          .toLowerCase()
          .includes(searchLower);

        if (!nameMatch && !regionMatch && !countryMatch) {
          return false;
        }
      }

      // Location filters
      if (
        filters.location.region &&
        beach.region?.name !== filters.location.region
      ) {
        return false;
      }

      // Type filters
      if (
        filters.waveType.length > 0 &&
        !filters.waveType.includes(beach.waveType)
      )
        return false;

      // Difficulty filters
      if (
        filters.difficulty.length > 0 &&
        !filters.difficulty.includes(beach.difficulty)
      )
        return false;

      // Crime level filters
      if (
        filters.crimeLevel.length > 0 &&
        !filters.crimeLevel.includes(beach.crimeLevel)
      )
        return false;

      // Shark attack filters
      if (
        filters.sharkAttack.length > 0 &&
        !filters.sharkAttack.includes(
          beach.sharkAttack?.hasAttack ? "true" : "false"
        )
      )
        return false;

      // Minimum points filter
      if (filters.minPoints > 0 && beach.score < filters.minPoints) {
        return false;
      }

      return true;
    });

    return filtered;
  }, [beaches, filters, beachScores, forecastData]);
}
