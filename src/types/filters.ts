export interface FilterState {
  categoryId: string | null
  categoryName: string | null
  categoryIds: string[] | null
  subCategoryId: string | null
  subCategoryName: string | null
  locationId: string | null
  locationName: string | null
  priceMin: number | null
  priceMax: number | null
  searchText: string
  dynamicFilters: Record<string, string | string[] | null>
}

export const DEFAULT_FILTERS: FilterState = {
  categoryId: null,
  categoryName: null,
  categoryIds: null,
  subCategoryId: null,
  subCategoryName: null,
  locationId: null,
  locationName: null,
  priceMin: null,
  priceMax: null,
  searchText: "",
  dynamicFilters: {},
}
