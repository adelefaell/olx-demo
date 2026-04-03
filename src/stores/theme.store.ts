import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

const ThemeStorage = createMMKV({ id: "theme-preferences-storage" })

export type ColorScheme = "light" | "dark"

interface ThemeStore {
  colorScheme: ColorScheme
  setColorScheme: (value: ColorScheme) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      colorScheme: "light",
      setColorScheme: (value) => set({ colorScheme: value }),
    }),
    {
      name: "theme-preferences-store",
      storage: createJSONStorage(() => ({
        getItem: (name) => ThemeStorage.getString(name) ?? null,
        setItem: (name, value) => ThemeStorage.set(name, value),
        removeItem: (name) => ThemeStorage.remove(name),
      })),
    },
  ),
)
