import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { color } from "@/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Navigation
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { StackParamList } from "@navigation/UserStack";

const ThemeSettings = () => {
  const { navigate } =
    useNavigation<NativeStackNavigationProp<StackParamList>>();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Theme Settings</Text>

      <Pressable
        style={({ pressed }) => [
          styles.themeButton,
          pressed && styles.themeButtonPressed,
        ]}
        onPress={() => navigate("BackgrounTheme")}
      >
        <View style={styles.buttonContent}>
          <MaterialCommunityIcons
            name="palette"
            size={20}
            color={color.white}
          />
          <Text style={styles.buttonText}>Change Chat Theme</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default ThemeSettings;

const styles = StyleSheet.create({
  section: {
    backgroundColor: color.white,
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
  themeButton: {
    backgroundColor: color.primaryColor,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: color.primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(0,255,0,0.2)",
  },
  themeButtonPressed: {
    backgroundColor: color.darkColor,
    transform: [{ scale: 0.98 }],
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  buttonText: {
    color: color.white,
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
