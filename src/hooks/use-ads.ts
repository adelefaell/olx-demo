import { useInfiniteQuery } from "@tanstack/react-query"

import { ADS_PAGE_SIZE } from "~/constants/apis"
import { searchAds } from "~/lib/api-client"
import { queryKeys } from "~/lib/query-keys"
import type { Ad } from "~/types/ad"
import type { FilterState } from "~/types/filters"

export function useAds(filters: FilterState) {
  return useInfiniteQuery({
    queryKey: queryKeys.ads(filters),
    queryFn: ({ pageParam }) =>
      searchAds({ filters, from: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const fetched = allPages.length * ADS_PAGE_SIZE
      return fetched < lastPage.total ? fetched : undefined
    },
  })
}

export function flattenAds(
  pages: Array<{ ads: Ad[]; total: number }> | undefined,
): Ad[] {
  return (pages ?? []).flatMap((p) => p.ads)
}

export function getAdsTotal(
  pages: Array<{ ads: Ad[]; total: number }> | undefined,
): number {
  return pages?.[0]?.total ?? 0
}
