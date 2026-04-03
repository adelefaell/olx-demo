import { useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native"
import RNRestart from "react-native-restart"
import { SafeAreaView } from "react-native-safe-area-context"

import { ThemedText } from "~/components/themed-text"
import { ThemedView } from "~/components/themed-view"
import { ConfirmModal } from "~/components/ui/confirm-modal"
import { Pressable } from "~/components/ui/pressable"
import { Colors } from "~/constants/theme"
import { useColorScheme } from "~/hooks/use-color-scheme"
import { LangCodeEnum } from "~/i18n/language.constants"
import { useLanguageStore } from "~/stores/language.store"
import { useThemeStore } from "~/stores/theme.store"

export default function SettingsScreen() {
  const { t } = useTranslation()
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]
  const { languageCode, setLanguageCode } = useLanguageStore()
  const { colorScheme, setColorScheme } = useThemeStore()

  const [pendingLang, setPendingLang] = useState<
    (typeof LangCodeEnum)[keyof typeof LangCodeEnum] | null
  >(null)

  const handleLanguagePress = (
    code: (typeof LangCodeEnum)[keyof typeof LangCodeEnum],
  ) => {
    if (code === languageCode) return
    setPendingLang(code)
  }

  const handleConfirm = () => {
    if (!pendingLang) return
    setLanguageCode(pendingLang)
    setPendingLang(null)
    RNRestart.restart()
  }

  const handleCancel = () => {
    setPendingLang(null)
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ThemedText style={styles.title} type="subtitle">
        {t("profile.settings")}
      </ThemedText>

      <ThemedView style={[styles.section, { borderColor: colors.border }]}>
        <ThemedText style={[styles.sectionTitle, { color: colors.muted }]}>
          {t("profile.theme")}
        </ThemedText>
        <ThemedView style={styles.langRow}>
          <Pressable
            style={[
              styles.langBtn,
              {
                backgroundColor:
                  colorScheme === "light" ? colors.chipActive : colors.chip,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setColorScheme("light")}
          >
            <ThemedText
              style={[
                styles.langBtnText,
                {
                  color:
                    colorScheme === "light"
                      ? colors.chipActiveText
                      : colors.chipText,
                },
              ]}
            >
              {t("profile.themeLight")}
            </ThemedText>
          </Pressable>
          <Pressable
            style={[
              styles.langBtn,
              {
                backgroundColor:
                  colorScheme === "dark" ? colors.chipActive : colors.chip,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setColorScheme("dark")}
          >
            <ThemedText
              style={[
                styles.langBtnText,
                {
                  color:
                    colorScheme === "dark"
                      ? colors.chipActiveText
                      : colors.chipText,
                },
              ]}
            >
              {t("profile.themeDark")}
            </ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>

      <ThemedView
        style={[styles.section, { borderColor: colors.border, marginTop: 12 }]}
      >
        <ThemedText style={[styles.sectionTitle, { color: colors.muted }]}>
          {t("profile.language")}
        </ThemedText>
        <ThemedView style={styles.langRow}>
          <Pressable
            style={[
              styles.langBtn,
              {
                backgroundColor:
                  languageCode === LangCodeEnum.EN
                    ? colors.chipActive
                    : colors.chip,
                borderColor: colors.border,
              },
            ]}
            onPress={() => handleLanguagePress(LangCodeEnum.EN)}
          >
            <ThemedText
              style={[
                styles.langBtnText,
                {
                  color:
                    languageCode === LangCodeEnum.EN
                      ? colors.chipActiveText
                      : colors.chipText,
                },
              ]}
            >
              {t("profile.languageEn")}
            </ThemedText>
          </Pressable>
          <Pressable
            style={[
              styles.langBtn,
              {
                backgroundColor:
                  languageCode === LangCodeEnum.AR
                    ? colors.chipActive
                    : colors.chip,
                borderColor: colors.border,
              },
            ]}
            onPress={() => handleLanguagePress(LangCodeEnum.AR)}
          >
            <ThemedText
              style={[
                styles.langBtnText,
                {
                  color:
                    languageCode === LangCodeEnum.AR
                      ? colors.chipActiveText
                      : colors.chipText,
                },
              ]}
            >
              {t("profile.languageAr")}
            </ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>

      <ConfirmModal
        visible={pendingLang !== null}
        title={t("profile.language")}
        message={t("profile.languageReloadNotice")}
        confirmLabel={t("profile.confirm")}
        cancelLabel={t("profile.cancel")}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontWeight: "700",
    marginBottom: 24,
  },
  section: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  langRow: {
    flexDirection: "row",
    gap: 8,
  },
  langBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  langBtnText: {
    fontSize: 15,
    fontWeight: "500",
  },
})
