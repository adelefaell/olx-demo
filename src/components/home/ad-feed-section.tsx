import { useRouter } from "expo-router"
import { ActivityIndicator, FlatList, StyleSheet } from "react-native"

import { AdCardCompact } from "~/components/ads/ad-card-compact"
import { EmptyAds } from "~/components/ads/empty-ads"
import { SectionHeader } from "~/components/ui/section-header"
import { Colors } from "~/constants/theme"
import { flattenAds, useAds } from "~/hooks/use-ads"
import { useCategoryByIdDeep } from "~/hooks/use-categories"
import { useColorScheme } from "~/hooks/use-color-scheme"
import type { Category } from "~/types/category"
import { DEFAULT_FILTERS } from "~/types/filters"

import { ThemedView } from "../themed-view"

function collectIds(cat: Category): string[] {
  return [cat.id, ...cat.children.flatMap(collectIds)]
}

interface AdFeedSectionProps {
  title: string
  categoryId: string
  onSeeAll?: () => void
}

const PREVIEW_COUNT = 4

export function AdFeedSection({
  title,
  categoryId,
  onSeeAll,
}: AdFeedSectionProps) {
  const router = useRouter()
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]

  const category = useCategoryByIdDeep(categoryId)
  const categoryIds = category ? collectIds(category) : null

  const filters = {
    ...DEFAULT_FILTERS,
    categoryId,
    categoryName: title,
    categoryIds,
  }

  const { data, isLoading, refetch } = useAds(filters)
  const ads = flattenAds(data?.pages).slice(0, PREVIEW_COUNT)

  return (
    <ThemedView style={styles.section}>
      <SectionHeader title={title} onSeeAll={onSeeAll} />
      {isLoading ? (
        <ActivityIndicator style={styles.loader} color={colors.text} />
      ) : ads.length === 0 ? (
        <EmptyAds onRetry={refetch} />
      ) : (
        <FlatList
          data={ads}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <ThemedView style={styles.separator} />}
          renderItem={({ item }) => (
            <AdCardCompact
              ad={item}
              onPress={() => router.push(`/ad/${item.id}`)}
            />
          )}
        />
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 8,
  },
  loader: {
    paddingVertical: 32,
  },
  list: {
    paddingHorizontal: 16,
  },
  separator: {
    width: 10,
  },
})
