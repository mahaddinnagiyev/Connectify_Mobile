import React from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { color } from "@/colors";
import { styles } from "./styles/themeSettings.style";

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
