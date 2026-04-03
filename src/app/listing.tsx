import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { AdsList } from "~/components/ads/ads-list"
import { FilterChipRow } from "~/components/filters/filter-chip-row"
import { ResultsHeader } from "~/components/filters/results-header"
import { ThemedView } from "~/components/themed-view"
import { IconSymbol } from "~/components/ui/icon-symbol"
import { Pressable } from "~/components/ui/pressable"
import { SearchBar } from "~/components/ui/search-bar"
import { Colors } from "~/constants/theme"
import { getAdsTotal, useAds } from "~/hooks/use-ads"
import { useColorScheme } from "~/hooks/use-color-scheme"
import { useFilterStore } from "~/stores/filter.store"

export default function ListingScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]

  const params = useLocalSearchParams<{
    categoryId?: string
    categoryName?: string
    search?: string
  }>()

  const { filters, setFilter } = useFilterStore()

  // Seed filter from URL params on mount
  useEffect(() => {
    if (params.categoryId) {
      setFilter("categoryId", params.categoryId)
      setFilter("categoryName", params.categoryName ?? null)
    }
    if (params.search) {
      setFilter("searchText", params.search)
    }
  }, [params.categoryId, params.categoryName, params.search, setFilter])

  const { data } = useAds(filters)
  const total = getAdsTotal(data?.pages)

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      {/* Header: back + search */}
      <ThemedView style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </Pressable>
        <ThemedView style={styles.searchWrapper}>
          <SearchBar
            placeholder={t("home.searchPlaceholder")}
            value={filters.searchText || undefined}
            onPress={() => {
              /* inline search — handled by filter store */
            }}
          />
        </ThemedView>
      </ThemedView>

      {/* Active filter chips */}
      <FilterChipRow onOpenFilters={() => router.push("/filters")} />

      {/* Result count */}
      <ResultsHeader
        total={total}
        categoryName={filters.categoryName ?? undefined}
      />

      {/* Ads feed */}
      <AdsList filters={filters} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  searchWrapper: {
    flex: 1,
  },
})
