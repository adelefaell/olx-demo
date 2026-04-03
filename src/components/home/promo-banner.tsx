import { Image } from "expo-image"
import { useRef, useState } from "react"
import { Dimensions, FlatList, StyleSheet } from "react-native"

import { Pressable } from "~/components/ui/pressable"
import { Colors } from "~/constants/theme"
import { useColorScheme } from "~/hooks/use-color-scheme"

import { ThemedView } from "../themed-view"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const BANNER_HEIGHT = 160

interface Banner {
  id: string
  imageUri: string
  onPress?: () => void
}

// Static placeholder banners — replace with API data when available
const STATIC_BANNERS: Banner[] = [
  {
    id: "1",
    imageUri: "https://images.olx.com.lb/thumbnails/308461451-240x180.jpg",
  },
  {
    id: "2",
    imageUri: "https://images.olx.com.lb/thumbnails/308453371-240x180.jpg",
  },
]

interface PromoBannerProps {
  banners?: Banner[]
}

export function PromoBanner({ banners = STATIC_BANNERS }: PromoBannerProps) {
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]
  const [activeIndex, setActiveIndex] = useState(0)
  const flatListRef = useRef<FlatList<Banner>>(null)

  const handleScroll = (event: {
    nativeEvent: { contentOffset: { x: number } }
  }) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH)
    setActiveIndex(index)
  }

  return (
    <ThemedView style={styles.wrapper}>
      <FlatList
        ref={flatListRef}
        data={banners}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <Pressable onPress={item.onPress} style={styles.bannerItem}>
            <Image
              source={{ uri: item.imageUri }}
              style={styles.image}
              contentFit="cover"
            />
          </Pressable>
        )}
      />
      <ThemedView style={styles.dots}>
        {banners.map((banner, i) => (
          <ThemedView
            key={banner.id}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i === activeIndex ? colors.text : colors.border,
                width: i === activeIndex ? 16 : 6,
              },
            ]}
          />
        ))}
      </ThemedView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
  },
  bannerItem: {
    width: SCREEN_WIDTH - 32,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: BANNER_HEIGHT,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    gap: 4,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
})
