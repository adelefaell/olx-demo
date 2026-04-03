import { useQuery } from "@tanstack/react-query"

import { fetchAdById } from "~/lib/api-client"
import { queryKeys } from "~/lib/query-keys"

export function useAdDetail(id: string | null) {
  return useQuery({
    queryKey: queryKeys.adDetail(id ?? ""),
    queryFn: () => fetchAdById(id!),
    enabled: id !== null && id !== "",
    staleTime: 1000 * 60 * 5,
  })
}
