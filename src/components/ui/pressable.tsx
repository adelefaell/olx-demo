import {
  Platform,
  Pressable as RNPressable,
  type PressableProps as RNPressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native"

import { Colors } from "~/constants/theme"
import { useColorScheme } from "~/hooks/use-color-scheme"

interface PressableProps extends RNPressableProps {
  disableRipple?: boolean
}

export const Pressable = ({
  style,
  disableRipple,
  accessibilityRole = "button",
  ...props
}: PressableProps) => {
  const scheme = useColorScheme() ?? "light"
  const rippleColor = Colors[scheme].ripple

  const sharedRipple = disableRipple
    ? undefined
    : {
        color: rippleColor,
        foreground: true,
      }

  return (
    <RNPressable
      style={({ pressed }) => {
        const base: StyleProp<ViewStyle> =
          typeof style === "function"
            ? style({ pressed, hovered: false })
            : style
        if (Platform.OS === "ios" && pressed) {
          return [base, { opacity: 0.8 }]
        }
        return base
      }}
      android_ripple={sharedRipple}
      accessibilityRole={accessibilityRole}
      {...props}
    />
  )
}
