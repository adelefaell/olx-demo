import { StyleSheet } from "react-native"

import { Pressable } from "~/components/ui/pressable"
import { Colors } from "~/constants/theme"
import { useColorScheme } from "~/hooks/use-color-scheme"

import { ThemedText } from "../themed-text"

interface ChipProps {
  label: string
  active?: boolean
  onPress?: () => void
  disabled?: boolean
}

export function Chip({ label, active = false, onPress, disabled }: ChipProps) {
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]

  return (
    <Pressable
      style={[
        styles.chip,
        {
          backgroundColor: active ? colors.chipActive : colors.chip,
          borderColor: active ? colors.chipActive : colors.border,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <ThemedText
        numberOfLines={1}
        style={[
          styles.label,
          { color: active ? colors.chipActiveText : colors.chipText },
        ]}
      >
        {label}
      </ThemedText>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    maxWidth: 180,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
  },
})
