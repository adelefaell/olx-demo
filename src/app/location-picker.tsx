import { useRouter } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { ThemedText } from "~/components/themed-text"
import { ThemedView } from "~/components/themed-view"
import { IconSymbol } from "~/components/ui/icon-symbol"
import { Pressable } from "~/components/ui/pressable"
import { Colors } from "~/constants/theme"
import { useColorScheme } from "~/hooks/use-color-scheme"
import { useGovernorates } from "~/hooks/use-locations"
import { useFilterStore } from "~/stores/filter.store"
import { useLanguageStore } from "~/stores/language.store"
import type { Location } from "~/types/ad"

export default function LocationPickerScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]
  const isRTL = useLanguageStore((s) => s.isRTL)
  const { setFilter } = useFilterStore()

  const [search, setSearch] = useState("")
  const { data: locations = [], isLoading } = useGovernorates()

  const filtered = search.trim()
    ? locations.filter((l) =>
        l.name.toLowerCase().includes(search.toLowerCase()),
      )
    : locations

  const handleSelect = (location: Location) => {
    setFilter("locationId", location.externalID)
    setFilter("locationName", location.name)
    router.back()
  }

  const handleClear = () => {
    setFilter("locationId", null)
    setFilter("locationName", null)
    router.back()
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
          {t("filters.location")}
        </ThemedText>
        <Pressable onPress={handleClear}>
          <ThemedText style={[styles.clearBtn, { color: colors.muted }]}>
            {t("filters.clearAll")}
          </ThemedText>
        </Pressable>
      </ThemedView>

      {/* Search input */}
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
          placeholder={t("locationPicker.searchPlaceholder")}
          placeholderTextColor={colors.muted}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")}>
            <ThemedText style={[styles.clearSearch, { color: colors.muted }]}>
              {t("common.cancel")}
            </ThemedText>
          </Pressable>
        )}
      </ThemedView>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} color={colors.muted} />
      ) : (
        <FlatList
          style={styles.list}
          data={filtered}
          keyExtractor={(item) => item.externalID}
          ListHeaderComponent={
            <ThemedText style={[styles.sectionHeader, { color: colors.muted }]}>
              {t("locationPicker.governorates").toUpperCase()}
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
        />
      )}
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
  clearBtn: {
    fontSize: 14,
    fontWeight: "500",
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
  clearSearch: {
    fontSize: 14,
    paddingHorizontal: 4,
  },
  loader: {
    marginTop: 40,
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
