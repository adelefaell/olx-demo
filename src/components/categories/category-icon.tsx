import { StyleSheet } from "react-native"

import { IconSymbol, type IconSymbolName } from "~/components/ui/icon-symbol"
import { Pressable } from "~/components/ui/pressable"
import { Colors } from "~/constants/theme"
import { useColorScheme } from "~/hooks/use-color-scheme"
import type { Category } from "~/types/category"

import { ThemedText } from "../themed-text"
import { ThemedView } from "../themed-view"

const CATEGORY_ICONS: Record<string, IconSymbolName> = {
  Vehicles: "car.fill",
  Properties: "house.fill",
  "Mobile Phones & Accessories": "iphone",
  "Electronics & Home Appliances": "laptopcomputer",
  "Home Furniture & Garden": "sofa.fill",
  "Business & Industrial Equipment": "wrench.and.screwdriver.fill",
  Animals: "pawprint.fill",
  Jobs: "briefcase.fill",
  Fashion: "tshirt.fill",
  "Kids & Babies": "figure.child",
  "Hobbies, Sports & Games": "sportscourt.fill",
  "Services & Businesses": "wrench.fill",
  "Food & Agriculture": "leaf.fill",
  Other: "square.grid.2x2.fill",
  "Cars for Sale": "car.fill",
  "Motorcycles for Sale": "bicycle",
  Apartments: "building.2.fill",
  "Villas for Sale": "house.fill",
  "Mobile Phones": "iphone",
}

function getCategoryIcon(name: string): IconSymbolName {
  return CATEGORY_ICONS[name] ?? "square.grid.2x2.fill"
}

interface CategoryIconProps {
  category: Category
  onPress?: () => void
  size?: "small" | "medium" | "large"
}

export function CategoryIcon({
  category,
  onPress,
  size = "medium",
}: CategoryIconProps) {
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]

  const circleSize = size === "large" ? 64 : size === "small" ? 44 : 56
  const iconSize = size === "large" ? 28 : size === "small" ? 20 : 24
  const labelSize = size === "large" ? 13 : size === "small" ? 10 : 11
  const maxWidth = size === "large" ? 80 : size === "small" ? 60 : 70

  return (
    <Pressable style={[styles.container, { maxWidth }]} onPress={onPress}>
      <ThemedView
        style={[
          styles.circle,
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <IconSymbol
          name={getCategoryIcon(category.nameEn)}
          size={iconSize}
          color={colors.text}
        />
      </ThemedView>
      <ThemedText
        style={[styles.label, { fontSize: labelSize }]}
        numberOfLines={2}
        textBreakStrategy="balanced"
      >
        {category.name}
      </ThemedText>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 6,
  },
  circle: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    textAlign: "center",
    fontWeight: "400",
    lineHeight: 14,
  },
})
