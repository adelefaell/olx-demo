import { Tabs } from "expo-router"

import { BottomNavBar } from "~/components/navigation/bottom-nav-bar"

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomNavBar state={props.state} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="settings" />
    </Tabs>
  )
}
