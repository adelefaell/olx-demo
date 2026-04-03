import { useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { ScrollView, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { AdFeedSection } from "~/components/home/ad-feed-section"
import { CategoryRow } from "~/components/home/category-row"
import { LocationHeader } from "~/components/home/location-header"
import { ThemedView } from "~/components/themed-view"
import { SearchBar } from "~/components/ui/search-bar"
import { SectionHeader } from "~/components/ui/section-header"
import { Colors } from "~/constants/theme"
import { useColorScheme } from "~/hooks/use-color-scheme"

const FEATURED_SECTION_IDS = [
  { key: "home.featuredSections.carsForSale" as const, categoryId: "23" },
  { key: "home.featuredSections.mobilePhones" as const, categoryId: "9" },
  { key: "home.featuredSections.apartmentsVillas" as const, categoryId: "95" },
]

export default function HomeScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <LocationHeader locationName="Lebanon" />

        <SearchBar
          placeholder={t("home.searchPlaceholder")}
          onPress={() => router.push("/quick-filters")}
        />

        {/* <PromoBanner /> */}

        <ThemedView style={styles.categoriesSection}>
          <SectionHeader
            title={t("home.browseCategories")}
            onSeeAll={() => router.push("/listing")}
          />
          <CategoryRow />
        </ThemedView>

        {FEATURED_SECTION_IDS.map((section) => (
          <AdFeedSection
            key={section.categoryId}
            title={t(section.key)}
            categoryId={section.categoryId}
            onSeeAll={() =>
              router.push({
                pathname: "/listing",
                params: { categoryId: section.categoryId },
              })
            }
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  categoriesSection: {
    marginVertical: 4,
  },
})
