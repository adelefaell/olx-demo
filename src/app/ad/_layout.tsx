import { Stack } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function AdLayout() {
  const { bottom } = useSafeAreaInsets()

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          paddingBottom: bottom,
        },
      }}
    />
  )
}
