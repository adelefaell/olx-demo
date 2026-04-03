import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native"

import { Pressable } from "~/components/ui/pressable"
import { Colors } from "~/constants/theme"
import { useColorScheme } from "~/hooks/use-color-scheme"
import { useLanguageStore } from "~/stores/language.store"

import { ThemedText } from "../themed-text"
import { ThemedView } from "../themed-view"

interface SectionHeaderProps {
  title: string
  onSeeAll?: () => void
}

export function SectionHeader({ title, onSeeAll }: SectionHeaderProps) {
  const { t } = useTranslation()
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]
  const isRTL = useLanguageStore((s) => s.isRTL)

  return (
    <ThemedView
      style={[
        styles.container,
        { flexDirection: isRTL ? "row-reverse" : "row" },
      ]}
    >
      <ThemedText style={styles.title}>{title}</ThemedText>
      {onSeeAll && (
        <Pressable onPress={onSeeAll}>
          <ThemedText style={[styles.seeAll, { color: colors.muted }]}>
            {t("home.seeAll")}
          </ThemedText>
        </Pressable>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "500",
  },
})
