import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { FlatList, StyleSheet, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { ThemedText } from "~/components/themed-text"
import { ThemedView } from "~/components/themed-view"
import { IconSymbol } from "~/components/ui/icon-symbol"
import { Pressable } from "~/components/ui/pressable"
import { Colors } from "~/constants/theme"
import { useCategoryById, useRootCategories } from "~/hooks/use-categories"
import { useColorScheme } from "~/hooks/use-color-scheme"
import { useFilterStore } from "~/stores/filter.store"
import { useLanguageStore } from "~/stores/language.store"
import type { Category } from "~/types/category"

export default function QuickFiltersScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]
  const isRTL = useLanguageStore((s) => s.isRTL)
  const { setFilter } = useFilterStore()
  const params = useLocalSearchParams<{
    returnTarget?: string
    parentId?: string
  }>()

  const [search, setSearch] = useState("")
  const rootCategories = useRootCategories()
  const parentCategory = useCategoryById(params.parentId ?? null)
  const categories = params.parentId
    ? (parentCategory?.children ?? [])
    : rootCategories

  const filtered = search.trim()
    ? categories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()),
      )
    : categories

  const collectIds = (cat: Category): string[] => [
    cat.id,
    ...cat.children.flatMap(collectIds),
  ]

  const handleSelect = (category: Category) => {
    if (params.returnTarget === "filters-sub") {
      setFilter("subCategoryId", category.id)
      setFilter("subCategoryName", category.name)
      setFilter("categoryIds", collectIds(category))
      router.back()
    } else if (params.returnTarget === "filters") {
      setFilter("categoryId", category.id)
      setFilter("categoryName", category.name)
      setFilter("categoryIds", collectIds(category))
      setFilter("subCategoryId", null)
      setFilter("subCategoryName", null)
      router.back()
    } else {
      setFilter("categoryId", category.id)
      setFilter("categoryName", category.name)
      setFilter("categoryIds", collectIds(category))
      router.push({
        pathname: "/listing",
        params: { categoryId: category.id, categoryName: category.name },
      })
    }
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
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
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>
          {params.returnTarget === "filters-sub"
            ? t("filters.subCategory")
            : params.returnTarget === "filters"
              ? t("filters.category")
              : t("quickFilters.title")}
        </ThemedText>
        {/* Spacer to center the title — must remain View (no visible surface) */}
        <ThemedView style={styles.headerSpacer} />
      </ThemedView>

      {/* Search input — uses colors.input background, not the default theme bg */}
      <ThemedView
        style={[
          styles.searchRow,
          {
            backgroundColor: colors.input,
            borderColor: colors.inputBorder,
            flexDirection: isRTL ? "row-reverse" : "row",
          },
        ]}
      >
        <IconSymbol name="magnifyingglass" size={16} color={colors.muted} />
        <TextInput
          style={[
            styles.searchInput,
            { color: colors.text, textAlign: isRTL ? "right" : "left" },
          ]}
          placeholder={t("quickFilters.searchPlaceholder")}
          placeholderTextColor={colors.muted}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")}>
            <ThemedText style={[styles.clearBtn, { color: colors.muted }]}>
              {t("common.cancel")}
            </ThemedText>
          </Pressable>
        )}
      </ThemedView>

      {/* Category list */}
      <FlatList
        style={styles.list}
        data={filtered}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <ThemedText style={[styles.sectionHeader, { color: colors.muted }]}>
            {t("quickFilters.popularCategories").toUpperCase()}
          </ThemedText>
        }
        renderItem={({ item }) => (
          <Pressable
            style={[styles.row, { borderBottomColor: colors.border }]}
            onPress={() => handleSelect(item)}
          >
            <ThemedText style={styles.rowText}>{item.name}</ThemedText>
          </Pressable>
        )}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  backBtn: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
  },
  headerSpacer: {
    width: 18,
  },
  searchRow: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  clearBtn: {
    fontSize: 14,
    paddingHorizontal: 4,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  list: {
    flex: 1,
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowText: {
    fontSize: 16,
    fontWeight: "600",
  },
})
