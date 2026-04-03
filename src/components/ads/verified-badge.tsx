import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native"

import { IconSymbol } from "~/components/ui/icon-symbol"
import { Colors } from "~/constants/theme"
import { useColorScheme } from "~/hooks/use-color-scheme"

import { ThemedText } from "../themed-text"
import { ThemedView } from "../themed-view"

export function VerifiedBadge() {
  const { t } = useTranslation()
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]

  return (
    <ThemedView
      style={[
        styles.badge,
        { backgroundColor: colors.chip, borderColor: colors.border },
      ]}
    >
      <IconSymbol name="checkmark.seal.fill" size={11} color={colors.text} />
      <ThemedText style={styles.text}>{t("ad.verified")}</ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 11,
    fontWeight: "600",
  },
})
