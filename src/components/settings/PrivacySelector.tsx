import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { PrivacySettingsChoice } from "@services/account/dto/privacy.dto";
import { Ionicons } from "@expo/vector-icons";
import { color } from "@/colors";

const PrivacySelector = ({
  value,
  onSelect,
}: {
  value: PrivacySettingsChoice;
  onSelect: (value: PrivacySettingsChoice) => void;
}) => {
  const [visible, setVisible] = React.useState(false);

  const options = [
    { value: PrivacySettingsChoice.everyone, label: "Everyone" },
    { value: PrivacySettingsChoice.my_friends, label: "My Friends" },
    { value: PrivacySettingsChoice.nobody, label: "Nobody" },
  ];

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.triggerButton,
          pressed && styles.triggerButtonPressed,
        ]}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.triggerText}>
          {options.find((opt) => opt.value === value)?.label}
        </Text>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={color.primaryColor}
          style={styles.chevronIcon}
        />
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Privacy Settings</Text>
              {options.map((option) => (
                <Pressable
                  key={option.value}
                  style={({ pressed }) => [
                    styles.optionRow,
                    pressed && styles.optionPressed,
                  ]}
                  onPress={() => {
                    onSelect(option.value);
                    setVisible(false);
                  }}
                >
                  <View style={styles.radioButton}>
                    {value === option.value && (
                      <View style={styles.radioButtonSelected} />
                    )}
                  </View>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  triggerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F9FA",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    width: 115,
  },
  triggerButtonPressed: {
    backgroundColor: "#F1F3F5",
  },
  triggerText: {
    fontSize: 14,
    fontWeight: "500",
    color: color.primaryColor,
  },
  chevronIcon: {
    position: "absolute",
    right: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    width: "80%",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 16,
    textAlign: "center",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  optionPressed: {
    backgroundColor: "#F8F9FA",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: color.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  radioButtonSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: color.primaryColor,
  },
  optionLabel: {
    fontSize: 16,
    color: "#495057",
    fontWeight: "500",
  },
});

export default PrivacySelector;
