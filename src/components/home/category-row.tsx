import { useRouter } from "expo-router"
import { FlatList, StyleSheet } from "react-native"

import { CategoryIcon } from "~/components/categories/category-icon"
import { useRootCategories } from "~/hooks/use-categories"
import type { Category } from "~/types/category"

import { ThemedView } from "../themed-view"

const MAX_HOME_CATEGORIES = 8

export function CategoryRow() {
  const router = useRouter()
  const categories = useRootCategories().slice(0, MAX_HOME_CATEGORIES)

  const handlePress = (category: Category) => {
    router.push({
      pathname: "/listing",
      params: { categoryId: category.id, categoryName: category.name },
    })
  }

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      ItemSeparatorComponent={() => <ThemedView style={styles.separator} />}
      renderItem={({ item }) => (
        <CategoryIcon
          category={item}
          onPress={() => handlePress(item)}
          size="medium"
        />
      )}
    />
  )
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  separator: {
    width: 16,
  },
})
