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

export const unstable_settings = {
  anchor: "(tabs)",
}

export default function RootLayout() {
  const colorScheme = useColorScheme()

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 min
            retry: 2,
          },
        },
      }),
  )

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      focusManager.setFocused(state === "active")
    })
    return () => sub.remove() // cleanup on unmount
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
