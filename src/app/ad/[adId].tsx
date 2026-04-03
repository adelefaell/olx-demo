import { Image } from "expo-image"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Linking,
  ScrollView,
  StyleSheet,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { EliteBadge } from "~/components/ads/elite-badge"
import { VerifiedBadge } from "~/components/ads/verified-badge"
import { ThemedText } from "~/components/themed-text"
import { ThemedView } from "~/components/themed-view"
import { IconSymbol } from "~/components/ui/icon-symbol"
import { Pressable } from "~/components/ui/pressable"
import { Colors } from "~/constants/theme"
import { useAdDetail } from "~/hooks/use-ad-detail"
import { useColorScheme } from "~/hooks/use-color-scheme"
import { useLanguageStore } from "~/stores/language.store"
import { formatPrice } from "~/utils/format-number"
import { formatRelativeTime } from "~/utils/time-utils"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

export default function AdDetailScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]
  const isRTL = useLanguageStore((s) => s.isRTL)

  const { adId } = useLocalSearchParams<{ adId: string }>()
  const { data: ad, isLoading, isError, refetch } = useAdDetail(adId ?? null)

  const [descExpanded, setDescExpanded] = useState(false)

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.centred, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator color={colors.text} />
      </SafeAreaView>
    )
  }

  if (isError || !ad) {
    return (
      <SafeAreaView
        style={[styles.centred, { backgroundColor: colors.background }]}
      >
        <ThemedText style={[styles.errorText, { color: colors.muted }]}>
          {t("common.error")}
        </ThemedText>
        <Pressable onPress={() => refetch()} style={styles.retryBtn}>
          <ThemedText style={styles.retryText}>{t("common.retry")}</ThemedText>
        </Pressable>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      {/* Back button */}
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <IconSymbol name="chevron.left" size={24} color={colors.text} />
      </Pressable>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Image carousel */}
        {ad.images.length > 0 ? (
          <FlatList
            data={ad.images}
            keyExtractor={(item, i) => item.id ?? String(i)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.carousel}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item.url }}
                style={styles.carouselImage}
                contentFit="cover"
              />
            )}
          />
        ) : (
          <ThemedView
            style={[
              styles.imagePlaceholder,
              { backgroundColor: colors.surface },
            ]}
          />
        )}

        <ThemedView style={styles.body}>
          {/* Badges */}
          <ThemedView
            style={[
              styles.badgeRow,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            {ad.isElite && <EliteBadge />}
            {ad.isVerified && <VerifiedBadge />}
          </ThemedView>

          {/* Price */}
          <ThemedText
            style={[
              styles.price,
              { color: colors.price, textAlign: isRTL ? "right" : "left" },
            ]}
          >
            {formatPrice(ad.price, ad.currency)}
          </ThemedText>

          {/* Title */}
          <ThemedText
            style={[styles.title, { textAlign: isRTL ? "right" : "left" }]}
          >
            {ad.title}
          </ThemedText>

          {/* Location + time */}
          <ThemedText
            style={[
              styles.meta,
              { color: colors.muted, textAlign: isRTL ? "right" : "left" },
            ]}
          >
            {ad.locationName} · {formatRelativeTime(ad.timestamp)}
          </ThemedText>

          {/* Parameters table */}
          {ad.parameters.length > 0 && (
            <ThemedView
              style={[styles.paramsTable, { borderColor: colors.border }]}
            >
              {ad.parameters.map((param, i) => (
                <ThemedView
                  key={param.key}
                  style={[
                    styles.paramRow,
                    {
                      borderBottomColor: colors.border,
                      borderBottomWidth:
                        i < ad.parameters.length - 1
                          ? StyleSheet.hairlineWidth
                          : 0,
                      flexDirection: isRTL ? "row-reverse" : "row",
                    },
                  ]}
                >
                  <ThemedText
                    style={[styles.paramKey, { color: colors.muted }]}
                  >
                    {param.key}
                  </ThemedText>
                  <ThemedText style={styles.paramValue}>
                    {param.valueLabel ?? param.value}
                  </ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          )}

          {/* Description */}
          {ad.description && (
            <ThemedView style={styles.descSection}>
              <ThemedText style={styles.descTitle}>
                {t("ad.description")}
              </ThemedText>
              <ThemedText
                style={[
                  styles.descText,
                  { textAlign: isRTL ? "right" : "left" },
                ]}
                numberOfLines={descExpanded ? undefined : 4}
              >
                {ad.description}
              </ThemedText>
              {ad.description.length > 200 && (
                <Pressable onPress={() => setDescExpanded((v) => !v)}>
                  <ThemedText
                    style={[styles.expandText, { color: colors.muted }]}
                  >
                    {descExpanded ? t("ad.showLess") : t("ad.showMore")}
                  </ThemedText>
                </Pressable>
              )}
            </ThemedView>
          )}
        </ThemedView>
      </ScrollView>

      {/* Sticky CTA bar */}
      <ThemedView
        style={[
          styles.ctaBar,
          {
            borderTopColor: colors.border,
            flexDirection: isRTL ? "row-reverse" : "row",
          },
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centred: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  errorText: { fontSize: 16 },
  retryBtn: { padding: 12 },
  retryText: { fontSize: 15, fontWeight: "600" },
  backBtn: {
    position: "absolute",
    top: 56,
    left: 12,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  scrollContent: { paddingBottom: 100 },
  carousel: { height: 280 },
  carouselImage: {
    width: SCREEN_WIDTH,
    height: 280,
  },
  imagePlaceholder: {
    height: 280,
    width: "100%",
  },
  body: { padding: 16, gap: 10 },
  badgeRow: { gap: 6, alignItems: "center" },
  price: { fontSize: 24, fontWeight: "700" },
  title: { fontSize: 18, lineHeight: 26 },
  meta: { fontSize: 13 },
  paramsTable: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 8,
  },
  paramRow: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  paramKey: { fontSize: 14 },
  paramValue: { fontSize: 14, fontWeight: "600" },
  descSection: { gap: 6, marginTop: 8 },
  descTitle: { fontSize: 16, fontWeight: "700" },
  descText: { fontSize: 14, lineHeight: 22 },
  expandText: { fontSize: 13, marginTop: 4 },
  ctaBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 10,
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  ctaBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  ctaBtnText: { fontSize: 15, fontWeight: "700" },
})
