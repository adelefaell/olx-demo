import { StyleSheet } from "react-native"

import { IconSymbol } from "~/components/ui/icon-symbol"
import { Pressable } from "~/components/ui/pressable"
import { Colors } from "~/constants/theme"
import { useColorScheme } from "~/hooks/use-color-scheme"
import { useLanguageStore } from "~/stores/language.store"

import { ThemedText } from "../themed-text"

interface SearchBarProps {
  placeholder: string
  onPress?: () => void
  value?: string
}

export function SearchBar({ placeholder, onPress, value }: SearchBarProps) {
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]
  const isRTL = useLanguageStore((s) => s.isRTL)

  return (
    <Pressable
      style={[
        styles.container,
        {
          backgroundColor: colors.input,
          borderColor: colors.inputBorder,
          flexDirection: isRTL ? "row-reverse" : "row",
        },
      ]}
      onPress={onPress}
    >
      <IconSymbol name="magnifyingglass" size={16} color={colors.muted} />
      <ThemedText
        style={[
          styles.text,
          {
            color: value ? colors.text : colors.muted,
            textAlign: isRTL ? "right" : "left",
          },
        ]}
        numberOfLines={1}
      >
        {value ?? placeholder}
      </ThemedText>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: "center",
    gap: 8,
  },
  text: {
    flex: 1,
    fontSize: 15,
  },
})
