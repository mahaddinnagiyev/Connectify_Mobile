import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { PrivacySettingsChoice } from "@services/account/dto/privacy.dto";
import PrivacySelector from "./PrivacySelector";
import { color } from "@/colors";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";

type Props = {
  privacySettings: Record<string, PrivacySettingsChoice>;
  onPrivacyChange: (setting: string, value: PrivacySettingsChoice) => void;
  onSave: () => void;
  isSaving: boolean;
};

const PrivacySettings = ({
  privacySettings,
  onPrivacyChange,
  onSave,
  isSaving,
}: Props) => {
  const { isPrivacySettingsChanged } = useSelector(
    (state: RootState) => state.myProfile
  );

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Privacy Settings</Text>

        {isPrivacySettingsChanged && (
          <Pressable style={styles.saveButton} onPress={onSave}>
            {isSaving && <ActivityIndicator size="small" color="#fff" />}
            <Text style={{ color: "#fff" }}>Save Changes</Text>
          </Pressable>
        )}
      </View>

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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  saveButton: {
    backgroundColor: color.primaryColor,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 8,
    gap: 8,
  },
});

export default PrivacySettings;
