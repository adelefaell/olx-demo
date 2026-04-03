import { Image } from "expo-image"
import { StyleSheet } from "react-native"

import { EliteBadge } from "~/components/ads/elite-badge"
import { Pressable } from "~/components/ui/pressable"
import { Colors } from "~/constants/theme"
import { useColorScheme } from "~/hooks/use-color-scheme"
import { useLanguageStore } from "~/stores/language.store"
import type { Ad } from "~/types/ad"
import { formatPrice } from "~/utils/format-number"
import { formatRelativeTime } from "~/utils/time-utils"

import { ThemedText } from "../themed-text"
import { ThemedView } from "../themed-view"

interface AdCardCompactProps {
  ad: Ad
  onPress?: () => void
}

export function AdCardCompact({ ad, onPress }: AdCardCompactProps) {
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]
  const isRTL = useLanguageStore((s) => s.isRTL)
  const thumbnail = ad.images[0]?.url

  return (
    <Pressable
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
      ]}
      onPress={onPress}
    >
      <ThemedView style={styles.imageWrapper}>
        {thumbnail ? (
          <Image
            source={{ uri: thumbnail }}
            style={styles.image}
            contentFit="cover"
          />
        ) : (
          <ThemedView
            style={[
              styles.imagePlaceholder,
              { backgroundColor: colors.surface },
            ]}
          />
        )}
        {ad.isElite && (
          <ThemedView style={styles.badgeOverlay}>
            <EliteBadge />
          </ThemedView>
        )}
      </ThemedView>
      <ThemedView style={styles.info}>
        <ThemedText
          style={[
            styles.price,
            { color: colors.price, textAlign: isRTL ? "right" : "left" },
          ]}
          numberOfLines={1}
        >
          {formatPrice(ad.price, ad.currency)}
        </ThemedText>
        <ThemedText
          style={[styles.title, { textAlign: isRTL ? "right" : "left" }]}
          numberOfLines={2}
        >
          {ad.title}
        </ThemedText>
        <ThemedText
          style={[
            styles.meta,
            { color: colors.muted, textAlign: isRTL ? "right" : "left" },
          ]}
          numberOfLines={1}
        >
          {ad.locationName} · {formatRelativeTime(ad.timestamp)}
        </ThemedText>
      </ThemedView>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    width: 160,
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 4 / 3,
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
  },
  badgeOverlay: {
    position: "absolute",
    top: 6,
    left: 6,
  },
  info: {
    padding: 8,
    gap: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
  },
  title: {
    fontSize: 13,
    lineHeight: 18,
  },
  meta: {
    fontSize: 11,
    marginTop: 2,
  },
})
