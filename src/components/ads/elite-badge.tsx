import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native"

import { IconSymbol } from "~/components/ui/icon-symbol"
import { Colors } from "~/constants/theme"
import { useColorScheme } from "~/hooks/use-color-scheme"

import { ThemedText } from "../themed-text"
import { ThemedView } from "../themed-view"

export function EliteBadge() {
  const { t } = useTranslation()
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]

  return (
    <ThemedView style={[styles.badge, { backgroundColor: colors.eliteBadge }]}>
      <IconSymbol name="star.fill" size={10} color={colors.eliteBadgeText} />
      <ThemedText style={[styles.text, { color: colors.eliteBadgeText }]}>
        {t("ad.elite")}
      </ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
})
