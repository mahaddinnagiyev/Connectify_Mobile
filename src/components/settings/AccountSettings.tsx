import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { color } from "@/colors";

type Props = {
  faceIdEnabled: boolean;
  onFaceIdToggle: () => void;
  onPasswordChange: () => void;
  onRemoveAccount: () => void;
};

const AccountSettings = ({
  faceIdEnabled,
  onFaceIdToggle,
  onPasswordChange,
  onRemoveAccount,
}: Props) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Account Settings</Text>

      {/* Change Password */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Change Password</Text>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            { opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={onPasswordChange}
        >
          <Ionicons name="key" size={16} color={color.primaryColor} />
          <Text style={styles.buttonText}>Change</Text>
        </Pressable>
      </View>

      {/* Face ID */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Face ID</Text>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            faceIdEnabled && styles.activeButton,
            { opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={onFaceIdToggle}
        >
          <Ionicons
            name={faceIdEnabled ? "lock-open" : "lock-closed"}
            size={16}
            color={faceIdEnabled ? "white" : color.primaryColor}
          />
          <Text
            style={[
              styles.buttonText,
              faceIdEnabled && styles.activeButtonText,
            ]}
          >
            {faceIdEnabled ? "Disable" : "Enable"}
          </Text>
        </Pressable>
      </View>

      {/* Remove Account */}
      <View style={styles.settingItem}>
        <Text style={[styles.settingText, styles.dangerText]}>
          Remove Account
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            styles.dangerButton,
            { opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={onRemoveAccount}
        >
          <Ionicons name="trash" size={16} color="#ff4444" />
          <Text style={[styles.buttonText, styles.dangerText]}>Remove</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 56,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  settingText: {
    fontSize: 16,
    color: "#2D3436",
    flex: 1,
    marginRight: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: color.primaryColor + "15",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 110,
    justifyContent: "center",
  },
  activeButton: {
    backgroundColor: color.primaryColor,
  },
  activeButtonText: {
    color: "#fff",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: color.primaryColor,
  },
  dangerText: {
    color: "#ff4444",
  },
  dangerButton: {
    backgroundColor: "#ff444415",
  },
});

export default AccountSettings;
