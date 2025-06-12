import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { color } from "@/colors";

interface ConfirmModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  cancelColor?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title = "Are you sure?",
  message = "This action cannot be undone",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = color.primaryColor,
  cancelColor = color.tertiaryColor,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            {/* {isLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator
                  size="large"
                  color={color.primaryColor}
                  style={styles.loadingIndicator}
                />
              </View>
            )} */}
            <View style={styles.iconContainer}>
              <MaterialIcons
                name="warning"
                size={32}
                color={confirmColor}
                style={styles.icon}
              />
            </View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            <View style={styles.buttonGroup}>
              <Pressable
                onPress={onCancel}
                style={({ pressed }) => [
                  styles.button,
                  styles.cancelButton,
                  {
                    backgroundColor: pressed
                      ? `${cancelColor}20`
                      : "transparent",
                    borderColor: cancelColor,
                  },
                ]}
                disabled={isLoading}
              >
                <Text style={[styles.buttonText, { color: cancelColor }]}>
                  {cancelText}
                </Text>
              </Pressable>

              <Pressable
                onPress={onConfirm}
                style={({ pressed }) => [
                  styles.button,
                  {
                    backgroundColor: pressed
                      ? `${confirmColor}CC`
                      : confirmColor,
                  },
                ]}
                disabled={isLoading}
              >
                <Text style={[styles.buttonText, styles.confirmText]}>
                  {isLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={color.white}
                      style={styles.loadingIndicator}
                    />
                  ) : (
                    confirmText
                  )}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  loadingIndicator: {
    transform: [{ scale: 1.5 }],
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: color.secondaryColor,
    borderRadius: 20,
    padding: 24,
    width: "100%",
    shadowColor: color.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    backgroundColor: `${color.primaryColor}20`,
    borderRadius: 50,
    padding: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: color.textColor,
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: color.tertiaryColor,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  confirmText: {
    color: color.secondaryColor,
  },
});

export default ConfirmModal;
