import { StyleSheet } from "react-native"

import { Colors } from "~/constants/theme"
import { useColorScheme } from "~/hooks/use-color-scheme"

import { ThemedText } from "../themed-text"
import { ThemedView } from "../themed-view"

interface BadgeProps {
  label: string
  variant?: "elite" | "verified" | "count"
  count?: number
}

export function Badge({ label, variant = "count", count }: BadgeProps) {
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]

  const bgColor =
    variant === "elite"
      ? colors.eliteBadge
      : variant === "verified"
        ? colors.chipActive
        : colors.chipActive

  const textColor =
    variant === "elite" ? colors.eliteBadgeText : colors.chipActiveText

  const displayLabel = count !== undefined ? String(count) : label

  return (
    <ThemedView style={[styles.badge, { backgroundColor: bgColor }]}>
      <ThemedText style={[styles.label, { color: textColor }]}>
        {displayLabel}
      </ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
})
