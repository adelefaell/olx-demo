import { useQuery } from "@tanstack/react-query"

import type { LangCodeType } from "~/i18n/language.constants"
import { fetchCategories } from "~/lib/api-client"
import { queryKeys } from "~/lib/query-keys"
import { useLanguageStore } from "~/stores/language.store"
import type { Category } from "~/types/category"

export function useCategories() {
  const lang = useLanguageStore((s) => s.languageCode) as LangCodeType

  return useQuery({
    queryKey: queryKeys.categories(lang),
    queryFn: () => fetchCategories(lang),
    staleTime: Number.POSITIVE_INFINITY,
  })
}

export function useRootCategories(): Category[] {
  const { data } = useCategories()
  return (data ?? []).filter((c) => c.parentId === null)
}

export function useSubcategories(parentId: string | null): Category[] {
  const { data } = useCategories()
  if (!parentId) return []
  return (data ?? []).filter((c) => c.parentId === parentId)
}

export function useCategoryById(id: string | null): Category | undefined {
  const { data } = useCategories()
  if (!id) return undefined
  return (data ?? []).find((c) => c.id === id)
}

export function useFlatCategories(): Category[] {
  const { data } = useCategories()
  return data ?? []
}

function findDeep(list: Category[], id: string): Category | undefined {
  for (const cat of list) {
    if (cat.id === id) return cat
    const found = findDeep(cat.children, id)
    if (found) return found
  }
  return undefined
}

export function useCategoryByIdDeep(id: string | null): Category | undefined {
  const { data } = useCategories()
  if (!id || !data) return undefined
  return findDeep(data, id)
}
