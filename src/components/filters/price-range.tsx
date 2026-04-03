import { useTranslation } from "react-i18next"
import { StyleSheet, TextInput } from "react-native"

import { Colors } from "~/constants/theme"
import { useColorScheme } from "~/hooks/use-color-scheme"
import { useLanguageStore } from "~/stores/language.store"

import { ThemedText } from "../themed-text"
import { ThemedView } from "../themed-view"

interface PriceRangeProps {
  min: number | null
  max: number | null
  onChangeMin: (v: number | null) => void
  onChangeMax: (v: number | null) => void
}

export function PriceRange({
  min,
  max,
  onChangeMin,
  onChangeMax,
}: PriceRangeProps) {
  const { t } = useTranslation()
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]
  const isRTL = useLanguageStore((s) => s.isRTL)

  const parse = (text: string): number | null => {
    const n = Number.parseInt(text, 10)
    return Number.isNaN(n) ? null : n
  }

  return (
    <ThemedView
      style={[styles.row, { flexDirection: isRTL ? "row-reverse" : "row" }]}
    >
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.input,
            borderColor: colors.inputBorder,
            color: colors.text,
          },
        ]}
        placeholder={t("filters.priceMin")}
        placeholderTextColor={colors.muted}
        keyboardType="numeric"
        value={min !== null ? String(min) : ""}
        onChangeText={(v) => onChangeMin(parse(v))}
        textAlign={isRTL ? "right" : "left"}
      />
      <ThemedText style={[styles.dash, { color: colors.muted }]}>–</ThemedText>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.input,
            borderColor: colors.inputBorder,
            color: colors.text,
          },
        ]}
        placeholder={t("filters.priceMax")}
        placeholderTextColor={colors.muted}
        keyboardType="numeric"
        value={max !== null ? String(max) : ""}
        onChangeText={(v) => onChangeMax(parse(v))}
        textAlign={isRTL ? "right" : "left"}
      />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  dash: {
    fontSize: 16,
  },
})
