import { View, Text, Pressable, ActivityIndicator } from "react-native";
import React from "react";
import { PrivacySettingsChoice } from "@services/account/dto/privacy.dto";
import PrivacySelector from "./PrivacySelector";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { styles } from "./styles/privacySettings.style";

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

export default PrivacySettings;
