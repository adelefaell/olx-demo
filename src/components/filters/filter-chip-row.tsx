import { useTranslation } from "react-i18next"
import { ScrollView, StyleSheet } from "react-native"

import { IconSymbol } from "~/components/ui/icon-symbol"
import { Pressable } from "~/components/ui/pressable"
import { Colors } from "~/constants/theme"
import { useCategoryById } from "~/hooks/use-categories"
import { useColorScheme } from "~/hooks/use-color-scheme"
import { useFilterStore } from "~/stores/filter.store"
import type { Category } from "~/types/category"

import { ThemedText } from "../themed-text"

function collectIds(cat: Category): string[] {
  return [cat.id, ...cat.children.flatMap(collectIds)]
}

interface FilterChipRowProps {
  onOpenFilters: () => void
}

export function FilterChipRow({ onOpenFilters }: FilterChipRowProps) {
  const { t } = useTranslation()
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]
  const { filters, setFilter, activeFilterCount } = useFilterStore()
  const count = activeFilterCount()
  const parentCategory = useCategoryById(filters.categoryId)

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollView}
      contentContainerStyle={styles.row}
    >
      {/* Filters button */}
      <Pressable
        style={[
          styles.filterBtn,
          {
            backgroundColor: count > 0 ? colors.chipActive : colors.chip,
            borderColor: count > 0 ? colors.chipActive : colors.border,
          },
        ]}
        onPress={onOpenFilters}
      >
        <IconSymbol
          name="slider.horizontal.3"
          size={12}
          color={count > 0 ? colors.chipActiveText : colors.chipText}
        />
        <ThemedText
          numberOfLines={1}
          style={[
            styles.filterBtnText,
            { color: count > 0 ? colors.chipActiveText : colors.chipText },
          ]}
        >
          {t("filters.title")}
          {count > 0 ? ` (${count})` : ""}
        </ThemedText>
      </Pressable>

      {/* Active: Location chip */}
      {filters.locationId && (
        <Pressable
          style={[
            styles.chip,
            {
              backgroundColor: colors.chipActive,
              borderColor: colors.chipActive,
            },
          ]}
          onPress={() => {
            setFilter("locationId", null)
            setFilter("locationName", null)
          }}
        >
          <ThemedText
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.chipLabel, { color: colors.chipActiveText }]}
          >
            {filters.locationName ?? t("filters.location")}
          </ThemedText>
          <IconSymbol name="xmark" size={10} color={colors.chipActiveText} />
        </Pressable>
      )}

      {/* Active: Category chip */}
      {filters.categoryId && (
        <Pressable
          style={[
            styles.chip,
            {
              backgroundColor: colors.chipActive,
              borderColor: colors.chipActive,
            },
          ]}
          onPress={() => {
            setFilter("categoryId", null)
            setFilter("categoryName", null)
            setFilter("categoryIds", null)
            setFilter("subCategoryId", null)
            setFilter("subCategoryName", null)
          }}
        >
          <ThemedText
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.chipLabel, { color: colors.chipActiveText }]}
          >
            {filters.categoryName ?? t("filters.category")}
          </ThemedText>
          <IconSymbol name="xmark" size={10} color={colors.chipActiveText} />
        </Pressable>
      )}

      {/* Active: Subcategory chip */}
      {filters.subCategoryId && (
        <Pressable
          style={[
            styles.chip,
            {
              backgroundColor: colors.chipActive,
              borderColor: colors.chipActive,
            },
          ]}
          onPress={() => {
            setFilter("subCategoryId", null)
            setFilter("subCategoryName", null)
            setFilter(
              "categoryIds",
              parentCategory ? collectIds(parentCategory) : null,
            )
          }}
        >
          <ThemedText
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.chipLabel, { color: colors.chipActiveText }]}
          >
            {filters.subCategoryName ?? t("filters.subCategory")}
          </ThemedText>
          <IconSymbol name="xmark" size={10} color={colors.chipActiveText} />
        </Pressable>
      )}

      {/* Active: Price chip */}
      {(filters.priceMin !== null || filters.priceMax !== null) && (
        <Pressable
          style={[
            styles.chip,
            {
              backgroundColor: colors.chipActive,
              borderColor: colors.chipActive,
            },
          ]}
          onPress={() => {
            setFilter("priceMin", null)
            setFilter("priceMax", null)
          }}
        >
          <ThemedText
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.chipLabel, { color: colors.chipActiveText }]}
          >
            {filters.priceMin ?? "0"} – {filters.priceMax ?? "∞"}
          </ThemedText>
          <IconSymbol name="xmark" size={10} color={colors.chipActiveText} />
        </Pressable>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    minHeight: 52,
  },
  row: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 8,
    alignItems: "center",
    minHeight: 44,
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  filterBtnText: {
    fontSize: 13,
    fontWeight: "600",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: "500",
    flexShrink: 0,
  },
})
