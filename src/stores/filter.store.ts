import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { DEFAULT_FILTERS, type FilterState } from "~/types/filters"

const FilterStorage = createMMKV({ id: "filter-store" })

interface FilterStore {
  filters: FilterState

  setFilter: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) => void
  setDynamicFilter: (fieldName: string, value: string | string[] | null) => void
  resetFilters: () => void
  activeFilterCount: () => number
}

export const useFilterStore = create<FilterStore>()(
  persist(
    (set, get) => ({
      filters: { ...DEFAULT_FILTERS },

      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),

      setDynamicFilter: (fieldName, value) =>
        set((state) => ({
          filters: {
            ...state.filters,
            dynamicFilters: {
              ...state.filters.dynamicFilters,
              [fieldName]: value,
            },
          },
        })),

      resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),

      activeFilterCount: () => {
        const { filters } = get()
        let count = 0
        if (filters.categoryId) count++
        if (filters.locationId) count++
        if (filters.priceMin !== null || filters.priceMax !== null) count++
        if (filters.searchText) count++
        for (const v of Object.values(filters.dynamicFilters)) {
          if (v !== null && v !== undefined && v !== "") count++
        }
        return count
      },
    }),
    {
      name: "filter-store",
      storage: createJSONStorage(() => ({
        getItem: (name) => FilterStorage.getString(name) ?? null,
        setItem: (name, value) => FilterStorage.set(name, value),
        removeItem: (name) => FilterStorage.remove(name),
      })),
    },
  ),
)
