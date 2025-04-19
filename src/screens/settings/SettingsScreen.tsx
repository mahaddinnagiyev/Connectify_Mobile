import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { color } from "@/colors";
import { useNavigation } from "@react-navigation/native";
import type { StackParamList } from "@navigation/Navigator";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AccountSettings from "@components/settings/AccountSettings";
import PrivacySettings from "@components/settings/PrivacySettings";

export type PrivacyOption = "Everyone" | "My Friends" | "No One";

const SettingsScreen = () => {
  const navigate = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [faceIdEnabled, setFaceIdEnabled] = useState(false);
  const [privacySettings, setPrivacySettings] = useState<
    Record<string, PrivacyOption>
  >({
    email: "My Friends",
    gender: "My Friends",
    bio: "Everyone",
    location: "No One",
    socialLinks: "My Friends",
    lastLogin: "No One",
  });

  const handlePrivacyChange = (setting: string, value: PrivacyOption) => {
    setPrivacySettings((prev) => ({ ...prev, [setting]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Pressable
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          onPress={() => navigate.goBack()}
        >
          <Text style={styles.headerButtonText}>Back</Text>
        </Pressable>
      </View>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Settings Section */}
        <AccountSettings
          faceIdEnabled={faceIdEnabled}
          onFaceIdToggle={() => setFaceIdEnabled(!faceIdEnabled)}
          onPasswordChange={() => console.log("Change password pressed")}
          onRemoveAccount={() => console.log("Remove account pressed")}
        />

        {/* Privacy Settings Section */}
        <PrivacySettings
          privacySettings={privacySettings}
          onPrivacyChange={handlePrivacyChange}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    marginTop: 28,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 60,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ececec",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  headerButtonText: {
    fontSize: 16,
    fontWeight: 800,
    color: color.primaryColor,
    backgroundColor: color.inputBgColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: color.primaryColor,
  },
  content: {
    padding: 16,
  },
});

export default SettingsScreen;
