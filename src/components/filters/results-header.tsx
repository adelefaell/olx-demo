import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native"

import { Colors } from "~/constants/theme"
import { useColorScheme } from "~/hooks/use-color-scheme"
import { useLanguageStore } from "~/stores/language.store"

import { ThemedText } from "../themed-text"
import { ThemedView } from "../themed-view"

interface ResultsHeaderProps {
  total: number
  categoryName?: string
}

export function ResultsHeader({ total, categoryName }: ResultsHeaderProps) {
  const { t } = useTranslation()
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]
  const isRTL = useLanguageStore((s) => s.isRTL)

  const label = categoryName
    ? t("listing.results", { count: total, category: categoryName })
    : `${total} ${t("listing.allAds")}`

  return (
    <ThemedView
      style={[
        styles.container,
        {
          borderBottomColor: colors.border,
          flexDirection: isRTL ? "row-reverse" : "row",
        },
      ]}
    >
      <ThemedView style={styles.left}>
        <ThemedText style={[styles.showing, { color: colors.muted }]}>
          {t("listing.showing")}
        </ThemedText>
        <ThemedText style={styles.count}>{label}</ThemedText>
      </ThemedView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 1,
    flexWrap: "wrap",
  },
  showing: {
    fontSize: 13,
  },
  count: {
    fontSize: 13,
    fontWeight: "600",
    flexShrink: 1,
  },
})
