import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { DynamicField } from "~/components/filters/dynamic-field"
import { FilterSection } from "~/components/filters/filter-section"
import { PriceRange } from "~/components/filters/price-range"
import { ThemedText } from "~/components/themed-text"
import { ThemedView } from "~/components/themed-view"
import { IconSymbol } from "~/components/ui/icon-symbol"
import { Pressable } from "~/components/ui/pressable"
import { Colors } from "~/constants/theme"
import { getAdsTotal, useAds } from "~/hooks/use-ads"
import { useCategoryById } from "~/hooks/use-categories"
import { useCategoryFields } from "~/hooks/use-category-fields"
import { useColorScheme } from "~/hooks/use-color-scheme"
import { useFilterStore } from "~/stores/filter.store"
import { useLanguageStore } from "~/stores/language.store"
import { DEFAULT_FILTERS, type FilterState } from "~/types/filters"

export default function FiltersScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]
  const isRTL = useLanguageStore((s) => s.isRTL)

  const params = useLocalSearchParams<{
    categoryId?: string
    categoryName?: string
  }>()

  const {
    filters: committed,
    setFilter,
    setDynamicFilter,
    resetFilters,
  } = useFilterStore()

  // Local draft state — only committed on "Apply"
  // Pre-populate from route params when coming from quick-filters
  const [draft, setDraft] = useState<FilterState>({
    ...committed,
    ...(params.categoryId
      ? {
          categoryId: params.categoryId,
          categoryName: params.categoryName ?? null,
          subCategoryId: null,
          subCategoryName: null,
        }
      : {}),
  })

  // Sync category & location back from store when returning from pickers
  useFocusEffect(
    useCallback(() => {
      setDraft((prev) => ({
        ...prev,
        categoryId: committed.categoryId,
        categoryName: committed.categoryName,
        categoryIds: committed.categoryIds,
        subCategoryId: committed.subCategoryId,
        subCategoryName: committed.subCategoryName,
        locationId: committed.locationId,
        locationName: committed.locationName,
      }))
    }, [
      committed.categoryId,
      committed.categoryName,
      committed.categoryIds,
      committed.subCategoryId,
      committed.subCategoryName,
      committed.locationId,
      committed.locationName,
    ]),
  )

  const setDraftFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) => setDraft((prev) => ({ ...prev, [key]: value }))

  const setDraftDynamic = (name: string, value: string | string[] | null) =>
    setDraft((prev) => ({
      ...prev,
      dynamicFilters: { ...prev.dynamicFilters, [name]: value },
    }))

  const selectedCategory = useCategoryById(draft.categoryId)
  const hasSubcategories = (selectedCategory?.children.length ?? 0) > 0

  const dynamicFields = useCategoryFields(draft.categoryId)

  // Live result count preview using draft filters
  const { data: previewData, isLoading: isCountLoading } = useAds(draft)
  const previewCount = getAdsTotal(previewData?.pages)

  const handleApply = () => {
    // Commit scalar fields individually (avoids key-value correlation loss from Object.entries)
    setFilter("categoryId", draft.categoryId)
    setFilter("categoryName", draft.categoryName)
    setFilter("categoryIds", draft.categoryIds)
    setFilter("subCategoryId", draft.subCategoryId)
    setFilter("subCategoryName", draft.subCategoryName)
    setFilter("locationId", draft.locationId)
    setFilter("locationName", draft.locationName)
    setFilter("priceMin", draft.priceMin)
    setFilter("priceMax", draft.priceMax)
    setFilter("searchText", draft.searchText)
    for (const [k, v] of Object.entries(draft.dynamicFilters)) {
      setDynamicFilter(k, v)
    }
    router.back()
  }

  const handleClearAll = () => {
    setDraft({ ...DEFAULT_FILTERS })
    resetFilters()
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "bottom"]}
    >
      {/* Header */}
      <ThemedView
        style={[
          styles.header,
          {
            borderBottomColor: colors.border,
            flexDirection: isRTL ? "row-reverse" : "row",
          },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.headerClose}>
          <IconSymbol name="xmark" size={18} color={colors.text} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>{t("filters.title")}</ThemedText>
        <Pressable onPress={handleClearAll}>
          <ThemedText style={[styles.headerClear, { color: colors.muted }]}>
            {t("filters.clearAll")}
          </ThemedText>
        </Pressable>
      </ThemedView>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Category row */}
        <FilterSection
          label={t("filters.category")}
          value={draft.categoryName ?? t("filters.any")}
          showArrow
          onPress={() =>
            router.push({
              pathname: "/quick-filters",
              params: { returnTarget: "filters" },
            })
          }
        />

        {/* Subcategory row — visible only when selected category has children */}
        {hasSubcategories && (
          <FilterSection
            label={t("filters.subCategory")}
            value={draft.subCategoryName ?? t("filters.any")}
            showArrow
            onPress={() =>
              router.push({
                pathname: "/quick-filters",
                params: {
                  parentId: draft.categoryId ?? "",
                  returnTarget: "filters-sub",
                },
              })
            }
          />
        )}

        {/* Location row */}
        <FilterSection
          label={t("filters.location")}
          value={draft.locationName ?? t("filters.allCountry")}
          showArrow
          onPress={() => router.push("/location-picker")}
        />

        {/* Price */}
        <FilterSection label={t("filters.price")}>
          <PriceRange
            min={draft.priceMin}
            max={draft.priceMax}
            onChangeMin={(v) => setDraftFilter("priceMin", v)}
            onChangeMax={(v) => setDraftFilter("priceMax", v)}
          />
        </FilterSection>

        {/* Dynamic fields from categoryFields API */}
        {dynamicFields.map((field) => (
          <FilterSection key={field.name} label={field.label}>
            <DynamicField
              field={field}
              value={draft.dynamicFilters[field.name] ?? null}
              onChange={(v) =>
                setDraftDynamic(field.name, v as string | string[] | null)
              }
            />
          </FilterSection>
        ))}
      </ScrollView>

      {/* Sticky CTA */}
      <ThemedView style={[styles.ctaBar, { borderTopColor: colors.border }]}>
        <Pressable
          style={[styles.ctaBtn, { backgroundColor: colors.ctaButton }]}
          onPress={handleApply}
        >
          {isCountLoading ? (
            <ActivityIndicator color={colors.ctaButtonText} />
          ) : (
            <ThemedText
              style={[styles.ctaBtnText, { color: colors.ctaButtonText }]}
            >
              {t("filters.seeResults", { count: previewCount })}
            </ThemedText>
          )}
        </Pressable>
      </ThemedView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerClose: {
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  headerClear: {
    fontSize: 14,
    fontWeight: "500",
  },
  scroll: { flex: 1 },
  ctaBar: {
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  ctaBtn: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  ctaBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },
})
