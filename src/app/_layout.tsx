import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import "react-native-reanimated"

import { focusManager } from "@tanstack/react-query"
import { AppState } from "react-native"

import { useColorScheme } from "~/hooks/use-color-scheme"
import { useLanguageStore } from "~/stores/language.store"

export const unstable_settings = {
  anchor: "(tabs)",
}

export default function RootLayout() {
  const colorScheme = useColorScheme()

  const { isRTL } = useLanguageStore()

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: 2,
          },
        },
      }),
  )

  useEffect(() => {
    const sub = AppState.addEventListener("change", (s) => {
      focusManager.setFocused(s === "active")
    })
    return () => sub.remove()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack
          key={isRTL ? "rtl-stack" : "ltr-stack"}
          screenOptions={{
            headerShown: false,
            // contentStyle: {
            //   paddingBottom: bottom, // Global horizontal gutter
            // },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="quick-filters" />
          <Stack.Screen name="location-picker" />
          <Stack.Screen name="listing" />
          <Stack.Screen name="filters" options={{ presentation: "modal" }} />
          <Stack.Screen name="ad" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
