import { StyleSheet } from "react-native"

import { Pressable } from "~/components/ui/pressable"
import { Colors } from "~/constants/theme"
import { useColorScheme } from "~/hooks/use-color-scheme"
import { useLanguageStore } from "~/stores/language.store"

import { ThemedText } from "../themed-text"
import { ThemedView } from "../themed-view"

interface FilterSectionProps {
  label: string
  value?: string
  onPress?: () => void
  children?: React.ReactNode
  showArrow?: boolean
}

export function FilterSection({
  label,
  value,
  onPress,
  children,
  showArrow = false,
}: FilterSectionProps) {
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]
  const isRTL = useLanguageStore((s) => s.isRTL)

  return (
    <ThemedView style={[styles.section, { borderBottomColor: colors.border }]}>
      <ThemedText style={styles.label}>{label}</ThemedText>

      {children ?? (
        <Pressable
          style={[
            styles.valueRow,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
          onPress={onPress}
          disabled={!onPress}
        >
          <ThemedText
            style={[styles.value, { color: colors.muted }]}
            numberOfLines={1}
          >
            {value}
          </ThemedText>
          {showArrow && (
            <ThemedText style={[styles.arrow, { color: colors.muted }]}>
              ›
            </ThemedText>
          )}
        </Pressable>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
  },
  valueRow: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  value: {
    fontSize: 14,
    flex: 1,
  },
  arrow: {
    fontSize: 20,
    lineHeight: 22,
  },
})
