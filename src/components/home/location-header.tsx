import { StyleSheet } from "react-native"

import { IconSymbol } from "~/components/ui/icon-symbol"
import { Pressable } from "~/components/ui/pressable"
import { Colors } from "~/constants/theme"
import { useColorScheme } from "~/hooks/use-color-scheme"
import { useLanguageStore } from "~/stores/language.store"

import { ThemedText } from "../themed-text"

interface LocationHeaderProps {
  locationName: string
  onPress?: () => void
}

export function LocationHeader({ locationName, onPress }: LocationHeaderProps) {
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]
  const isRTL = useLanguageStore((s) => s.isRTL)

  return (
    <Pressable
      style={[
        styles.container,
        { flexDirection: isRTL ? "row-reverse" : "row" },
      ]}
      onPress={onPress}
    >
      <IconSymbol name="mappin.and.ellipse" size={14} color={colors.text} />
      <ThemedText style={styles.name}>{locationName}</ThemedText>
      <IconSymbol name="chevron.down" size={12} color={colors.muted} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
  },
})
