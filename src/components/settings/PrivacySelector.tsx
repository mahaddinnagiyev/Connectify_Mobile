import React from "react";
import {
  Modal,
  Pressable,
  View,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { PrivacySettingsChoice } from "@services/account/dto/privacy.dto";
import { Ionicons } from "@expo/vector-icons";
import { color } from "@/colors";
import { styles } from "./styles/privacySelector.style";

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

export default PrivacySelector;
