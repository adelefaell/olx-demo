import type { LangCodeType } from "~/i18n/language.constants"
import type { FilterState } from "~/types/filters"

export const queryKeys = {
  categories: (lang: LangCodeType) => ["categories", lang] as const,
  categoryFields: () => ["categoryFields"] as const,
  ads: (filters: FilterState) => ["ads", filters] as const,
  adDetail: (id: string) => ["ad", id] as const,
  locations: (hierarchyId: string, level: number) =>
    ["locations", hierarchyId, level] as const,
}
