import { useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, FlatList, StyleSheet } from "react-native"

import { AdCard } from "~/components/ads/ad-card"
import { EmptyAds } from "~/components/ads/empty-ads"
import { Colors } from "~/constants/theme"
import { flattenAds, useAds } from "~/hooks/use-ads"
import { useColorScheme } from "~/hooks/use-color-scheme"
import type { FilterState } from "~/types/filters"

import { ThemedText } from "../themed-text"
import { ThemedView } from "../themed-view"

interface AdsListProps {
  filters: FilterState
}

export function AdsList({ filters }: AdsListProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
    isError,
  } = useAds(filters)

  const ads = flattenAds(data?.pages)

  if (isLoading) {
    return (
      <ThemedView style={styles.centred}>
        <ActivityIndicator color={colors.text} />
      </ThemedView>
    )
  }

  if (isError) {
    return <EmptyAds onRetry={refetch} />
  }

  return (
    <FlatList
      data={ads}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <AdCard ad={item} onPress={() => router.push(`/ad/${item.id}`)} />
      )}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage()
      }}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={<EmptyAds onRetry={refetch} />}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ThemedView style={styles.footer}>
            <ActivityIndicator color={colors.text} />
            <ThemedText style={[styles.footerText, { color: colors.muted }]}>
              {t("listing.loadingMore")}
            </ThemedText>
          </ThemedView>
        ) : null
      }
      showsVerticalScrollIndicator={false}
    />
  )
}

const styles = StyleSheet.create({
  centred: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  footerText: {
    fontSize: 14,
  },
})
