import { useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { Platform, StyleSheet } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { IconSymbol, type IconSymbolName } from "~/components/ui/icon-symbol"
import { Pressable } from "~/components/ui/pressable"
import { Colors } from "~/constants/theme"
import { useColorScheme } from "~/hooks/use-color-scheme"
import type { TranslationKey } from "~/i18n/config"

import { ThemedText } from "../themed-text"
import { ThemedView } from "../themed-view"

interface NavItem {
  key: string
  labelKey: TranslationKey
  icon: IconSymbolName
  isSell?: boolean
  onPress: () => void
}

interface BottomNavBarProps {
  state?: { index: number; routes: Array<{ name: string }> }
}

export function BottomNavBar({ state }: BottomNavBarProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]
  const insets = useSafeAreaInsets()

  const currentRoute = state?.routes[state.index]?.name ?? "index"

  const items: NavItem[] = [
    {
      key: "home",
      labelKey: "tabs.home",
      icon: "house.fill",
      onPress: () => router.navigate("/(tabs)"),
    },
    {
      key: "settings",
      labelKey: "tabs.settings",
      icon: "gearshape.fill",
      onPress: () => router.navigate("/(tabs)/settings"),
    },
  ]

  const isActive = (key: string) => {
    if (key === "home") return currentRoute === "index"
    if (key === "settings") return currentRoute === "settings"
    return false
  }

  return (
    <ThemedView
      style={[
        styles.container,
        {
          borderTopColor: colors.border,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {items.map((item) => {
        const active = isActive(item.key)
        const iconColor = active
          ? colors.tabIconSelected
          : colors.tabIconDefault
        return (
          <Pressable key={item.key} style={styles.item} onPress={item.onPress}>
            <IconSymbol name={item.icon} size={22} color={iconColor} />
            <ThemedText
              style={[
                styles.label,
                {
                  color: iconColor,
                  fontWeight: active ? "600" : "400",
                },
              ]}
              numberOfLines={1}
            >
              {t(item.labelKey)}
            </ThemedText>
          </Pressable>
        )
      })}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 2,
  },
  label: {
    fontSize: 10,
    textAlign: "center",
  },
})
