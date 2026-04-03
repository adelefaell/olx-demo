import { useTranslation } from "react-i18next"
import { ScrollView, StyleSheet, Switch, TextInput } from "react-native"

import { Chip } from "~/components/ui/chip"
import { Colors } from "~/constants/theme"
import { useColorScheme } from "~/hooks/use-color-scheme"
import { useLanguageStore } from "~/stores/language.store"
import type { CategoryField } from "~/types/category"

import { ThemedText } from "../themed-text"
import { ThemedView } from "../themed-view"

interface DynamicFieldProps {
  field: CategoryField
  value: string | string[] | null
  onChange: (value: string | string[] | null) => void
}

export function DynamicField({ field, value, onChange }: DynamicFieldProps) {
  const { t } = useTranslation()
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]
  const isRTL = useLanguageStore((s) => s.isRTL)

  switch (field.fieldType) {
    case "SingleChoiceEnum": {
      const choices = [
        { value: "", label: t("filters.any") },
        ...(field.choices ?? []),
      ]
      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.chipRow,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          {choices.map((choice) => (
            <Chip
              key={choice.value}
              label={choice.label}
              active={value === choice.value || (choice.value === "" && !value)}
              onPress={() => onChange(choice.value || null)}
            />
          ))}
        </ScrollView>
      )
    }

    case "MultipleChoiceEnum": {
      const selected = Array.isArray(value) ? value : []
      const choices = field.choices ?? []
      return (
        <ThemedView
          style={[
            styles.chipWrap,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          {choices.map((choice) => {
            const isActive = selected.includes(choice.value)
            return (
              <Chip
                key={choice.value}
                label={choice.label}
                active={isActive}
                onPress={() => {
                  const next = isActive
                    ? selected.filter((v) => v !== choice.value)
                    : [...selected, choice.value]
                  onChange(next.length > 0 ? next : null)
                }}
              />
            )
          })}
        </ThemedView>
      )
    }

    case "Range": {
      const parts = typeof value === "string" ? value.split("-") : []
      const minVal = parts[0] ?? ""
      const maxVal = parts[1] ?? ""
      const unit = field.unit ? ` (${field.unit})` : ""
      return (
        <ThemedView
          style={[
            styles.rangeRow,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          <TextInput
            style={[
              styles.rangeInput,
              {
                backgroundColor: colors.input,
                borderColor: colors.inputBorder,
                color: colors.text,
              },
            ]}
            placeholder={`${t("filters.priceMin")}${unit}`}
            placeholderTextColor={colors.muted}
            keyboardType="numeric"
            value={minVal}
            onChangeText={(v) => {
              const next = v ? `${v}-${maxVal}` : maxVal ? `-${maxVal}` : null
              onChange(next)
            }}
            textAlign={isRTL ? "right" : "left"}
          />
          <ThemedText style={[styles.dash, { color: colors.muted }]}>
            –
          </ThemedText>
          <TextInput
            style={[
              styles.rangeInput,
              {
                backgroundColor: colors.input,
                borderColor: colors.inputBorder,
                color: colors.text,
              },
            ]}
            placeholder={`${t("filters.priceMax")}${unit}`}
            placeholderTextColor={colors.muted}
            keyboardType="numeric"
            value={maxVal}
            onChangeText={(v) => {
              const next = minVal ? `${minVal}-${v}` : v ? `-${v}` : null
              onChange(next)
            }}
            textAlign={isRTL ? "right" : "left"}
          />
        </ThemedView>
      )
    }

    case "Boolean": {
      const isOn = value === "true"
      return (
        <ThemedView
          style={[
            styles.boolRow,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          <ThemedText style={[styles.boolLabel, { color: colors.muted }]}>
            {isOn ? t("filters.available") : t("filters.any")}
          </ThemedText>
          <Switch
            value={isOn}
            onValueChange={(v) => onChange(v ? "true" : null)}
            trackColor={{ false: colors.border, true: colors.chipActive }}
            thumbColor={colors.background}
          />
        </ThemedView>
      )
    }

    default:
      return null
  }
}

const styles = StyleSheet.create({
  chipRow: {
    gap: 8,
    paddingRight: 8,
  },
  chipWrap: {
    flexWrap: "wrap",
    gap: 8,
  },
  rangeRow: {
    alignItems: "center",
    gap: 8,
  },
  rangeInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  dash: {
    fontSize: 16,
  },
  boolRow: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  boolLabel: {
    fontSize: 14,
  },
})
