import { useQuery } from "@tanstack/react-query"

import { fetchCategoryFields } from "~/lib/api-client"
import { queryKeys } from "~/lib/query-keys"
import type { CategoryField } from "~/types/category"

export function useCategoryFields(categoryId: string | null): CategoryField[] {
  const { data } = useQuery({
    queryKey: queryKeys.categoryFields(),
    queryFn: fetchCategoryFields,
    staleTime: Number.POSITIVE_INFINITY,
    enabled: categoryId !== null,
  })
  if (!categoryId || !data) return []
  return data[categoryId] ?? []
}
