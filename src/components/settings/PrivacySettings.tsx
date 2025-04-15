import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { color } from "@/colors";

type PrivacyOption = "Everyone" | "My Friends" | "No One";

type Props = {
  privacySettings: Record<string, PrivacyOption>;
  onPrivacyChange: (setting: string, value: PrivacyOption) => void;
};

const PrivacySettings = ({ privacySettings, onPrivacyChange }: Props) => {
  const PrivacySelector = ({
    value,
    onSelect,
  }: {
    value: PrivacyOption;
    onSelect: (value: PrivacyOption) => void;
  }) => {
    const [visible, setVisible] = React.useState(false);

    return (
      <View style={styles.selectorContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.selectorButton,
            { opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => setVisible(!visible)}
        >
          <Text style={styles.selectorText}>{value}</Text>
          <Ionicons
            name={visible ? "chevron-up" : "chevron-down"}
            size={16}
            color={color.primaryColor}
            style={styles.selectorIcon}
          />
        </Pressable>

        {visible && (
          <View style={styles.selectorOptions}>
            {(["Everyone", "My Friends", "No One"] as PrivacyOption[]).map(
              (option) => (
                <Pressable
                  key={option}
                  style={({ pressed }) => [
                    styles.optionButton,
                    { backgroundColor: pressed ? "#f8f9fa" : "white" },
                  ]}
                  onPress={() => {
                    onSelect(option);
                    setVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      option === value && styles.selectedOption,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              )
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Privacy Settings</Text>

      {Object.entries({
        email: "Who can see my email information?",
        gender: "Who can see my gender information?",
        bio: "Who can see my bio?",
        location: "Who can see my location?",
        socialLinks: "Who can see my social links?",
        lastLogin: "Who can see my last login date?",
      }).map(([key, question]) => (
        <View key={key} style={styles.privacyItem}>
          <Text style={styles.privacyQuestion}>{question}</Text>
          <PrivacySelector
            value={privacySettings[key]}
            onSelect={(value) => onPrivacyChange(key, value)}
          />
        </View>
      ))}
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
  privacyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  privacyQuestion: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: "#2D3436",
    marginRight: 10,
  },
  selectorContainer: {
    position: "relative",
  },
  selectorButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    width: 110,
  },
  selectorText: {
    fontSize: 14,
    fontWeight: "500",
    color: color.primaryColor,
  },
  selectorOptions: {
    position: "absolute",
    top: 40,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ececec",
    elevation: 3,
    zIndex: 2,
    minWidth: 140,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  optionText: {
    fontSize: 14,
    color: "#2D3436",
  },
  selectedOption: {
    color: color.primaryColor,
    fontWeight: "600",
  },
  selectorIcon: {
    position: "absolute",
    right: 8,
  },
});

export default PrivacySettings;
