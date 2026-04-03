import { Modal, StyleSheet, TouchableWithoutFeedback } from "react-native"

import { Pressable } from "~/components/ui/pressable"
import { Colors } from "~/constants/theme"
import { useColorScheme } from "~/hooks/use-color-scheme"

import { ThemedText } from "../themed-text"
import { ThemedView } from "../themed-view"

interface ConfirmModalProps {
  visible: boolean
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const scheme = useColorScheme() ?? "light"
  const colors = Colors[scheme]

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <ThemedView style={styles.overlay}>
          <TouchableWithoutFeedback>
            <ThemedView
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <ThemedText style={styles.title}>{title}</ThemedText>
              <ThemedText style={[styles.message, { color: colors.muted }]}>
                {message}
              </ThemedText>
              <ThemedView
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
              <ThemedView style={styles.actions}>
                <Pressable style={styles.action} onPress={onCancel}>
                  <ThemedText
                    style={[styles.cancelText, { color: colors.muted }]}
                  >
                    {cancelLabel}
                  </ThemedText>
                </Pressable>
                <ThemedView
                  style={[
                    styles.actionDivider,
                    { backgroundColor: colors.border },
                  ]}
                />
                <Pressable style={styles.action} onPress={onConfirm}>
                  <ThemedText style={styles.confirmText}>
                    {confirmLabel}
                  </ThemedText>
                </Pressable>
              </ThemedView>
            </ThemedView>
          </TouchableWithoutFeedback>
        </ThemedView>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  card: {
    width: "100%",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  message: {
    fontSize: 13,
    textAlign: "center",
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  actions: {
    flexDirection: "row",
  },
  action: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  actionDivider: {
    width: StyleSheet.hairlineWidth,
  },
  cancelText: {
    fontSize: 15,
  },
  confirmText: {
    fontSize: 15,
    fontWeight: "600",
  },
})
