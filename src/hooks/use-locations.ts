import { useQuery } from "@tanstack/react-query"

import { searchLocations } from "~/lib/api-client"
import { queryKeys } from "~/lib/query-keys"

// Lebanon root hierarchy ID, level 2 = governorates
export const LEBANON_HIERARCHY_ID = "1-30"
export const GOVERNORATE_LEVEL = 2
export const DISTRICT_LEVEL = 3

export function useLocations(hierarchyId: string, level: number) {
  return useQuery({
    queryKey: queryKeys.locations(hierarchyId, level),
    queryFn: () => searchLocations(hierarchyId, level),
    staleTime: 1000 * 60 * 30,
  })
}

export function useGovernorates() {
  return useLocations(LEBANON_HIERARCHY_ID, GOVERNORATE_LEVEL)
}
