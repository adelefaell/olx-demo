import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native"

import { IconSymbol } from "~/components/ui/icon-symbol"
import { Pressable } from "~/components/ui/pressable"
import { Colors } from "~/constants/theme"
import { useColorScheme } from "~/hooks/use-color-scheme"

import { ThemedText } from "../themed-text"
import { ThemedView } from "../themed-view"

interface EmptyAdsProps {
  onRetry?: () => void
}

export function EmptyAds({ onRetry }: EmptyAdsProps) {
  const { t } = useTranslation()
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]

  return (
    <ThemedView style={styles.container}>
      <IconSymbol
        name="magnifyingglass"
        size={48}
        color={colors.muted}
        style={styles.icon}
      />
      <ThemedText style={styles.title}>{t("listing.noAds")}</ThemedText>
      <ThemedText style={[styles.subtitle, { color: colors.muted }]}>
        {t("listing.noAdsDescription")}
      </ThemedText>
      {onRetry && (
        <Pressable
          style={[styles.retryBtn, { borderColor: colors.border }]}
          onPress={onRetry}
        >
          <ThemedText style={styles.retryText}>{t("common.retry")}</ThemedText>
        </Pressable>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingTop: 64,
    gap: 8,
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  retryText: {
    fontSize: 15,
    fontWeight: "500",
  },
})
