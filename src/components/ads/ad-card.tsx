import { Image } from "expo-image"
import { useTranslation } from "react-i18next"
import { Linking, StyleSheet } from "react-native"

import { EliteBadge } from "~/components/ads/elite-badge"
import { VerifiedBadge } from "~/components/ads/verified-badge"
import { Pressable } from "~/components/ui/pressable"
import { Colors } from "~/constants/theme"
import { useColorScheme } from "~/hooks/use-color-scheme"
import { useLanguageStore } from "~/stores/language.store"
import type { Ad } from "~/types/ad"
import { formatPrice } from "~/utils/format-number"
import { formatRelativeTime } from "~/utils/time-utils"

import { ThemedText } from "../themed-text"
import { ThemedView } from "../themed-view"

interface AdCardProps {
  ad: Ad
  onPress?: () => void
}

export function AdCard({ ad, onPress }: AdCardProps) {
  const { t } = useTranslation()
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]
  const isRTL = useLanguageStore((s) => s.isRTL)
  const thumbnail = ad.images[0]?.url

  // Extract common metadata params (year, fuel, km for vehicles)
  const yearParam = ad.parameters.find((p) =>
    p.key.toLowerCase().includes("year"),
  )
  const fuelParam = ad.parameters.find((p) =>
    p.key.toLowerCase().includes("fuel"),
  )
  const kmParam = ad.parameters.find(
    (p) =>
      p.key.toLowerCase().includes("km") ||
      p.key.toLowerCase().includes("kilometer"),
  )

  const metaChips = [yearParam, fuelParam, kmParam]
    .filter(Boolean)
    .map((p) => p?.valueLabel ?? p?.value)
    .slice(0, 3)

  return (
    <Pressable
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.cardBorder },
      ]}
      onPress={onPress}
    >
      {/* Image */}
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
          <ThemedView style={styles.eliteBadgeOverlay}>
            <EliteBadge />
          </ThemedView>
        )}
      </ThemedView>

      {/* Content */}
      <ThemedView style={styles.content}>
        {/* Verified badge */}
        {ad.isVerified && (
          <ThemedView
            style={[
              styles.row,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <VerifiedBadge />
          </ThemedView>
        )}

        {/* Price */}
        <ThemedText
          style={[
            styles.price,
            { color: colors.price, textAlign: isRTL ? "right" : "left" },
          ]}
          numberOfLines={1}
        >
          {formatPrice(ad.price, ad.currency)}
        </ThemedText>

        {/* Title */}
        <ThemedText
          style={[styles.title, { textAlign: isRTL ? "right" : "left" }]}
          numberOfLines={2}
        >
          {ad.title}
        </ThemedText>

        {/* Metadata chips (year, fuel, km) */}
        {metaChips.length > 0 && (
          <ThemedView
            style={[
              styles.metaRow,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            {metaChips.map((chip) => (
              <ThemedView
                key={chip}
                style={[styles.metaChip, { backgroundColor: colors.surface }]}
              >
                <ThemedText
                  style={[styles.metaChipText, { color: colors.muted }]}
                >
                  {chip}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        )}

        {/* Location + time */}
        <ThemedText
          style={[
            styles.location,
            { color: colors.muted, textAlign: isRTL ? "right" : "left" },
          ]}
          numberOfLines={1}
        >
          {ad.locationName}
          {ad.locationRegion ? `, ${ad.locationRegion}` : ""} ·{" "}
          {formatRelativeTime(ad.timestamp)}
        </ThemedText>

        {/* CTAs */}
        <ThemedView
          style={[
            styles.ctaRow,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          <Pressable
            style={[
              styles.ctaBtn,
              {
                backgroundColor: colors.whatsappButton,
                borderColor: colors.border,
              },
            ]}
            onPress={() => Linking.openURL("https://wa.me/")}
          >
            <ThemedText
              style={[styles.ctaBtnText, { color: colors.whatsappButtonText }]}
            >
              {t("ad.whatsapp")}
            </ThemedText>
          </Pressable>
          <Pressable
            style={[
              styles.ctaBtn,
              {
                backgroundColor: colors.ctaButton,
                borderColor: colors.ctaButton,
              },
            ]}
            onPress={() => Linking.openURL("tel:")}
          >
            <ThemedText
              style={[styles.ctaBtnText, { color: colors.ctaButtonText }]}
            >
              {t("ad.call")}
            </ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 2,
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
  },
  eliteBadgeOverlay: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  content: {
    padding: 12,
    gap: 6,
  },
  row: {
    alignItems: "center",
    gap: 6,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
  },
  title: {
    fontSize: 15,
    lineHeight: 22,
  },
  metaRow: {
    flexWrap: "wrap",
    gap: 6,
    alignItems: "center",
  },
  metaChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  metaChipText: {
    fontSize: 12,
    fontWeight: "500",
  },
  location: {
    fontSize: 13,
  },
  ctaRow: {
    gap: 8,
    marginTop: 4,
  },
  ctaBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  ctaBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
})
