import React from "react";
import { Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color } from "@/colors";
import { styles } from "./styles/soundSettiongs.style";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { setChangeSoundPreferences } from "@redux/settings/settingsSlice";

const SoundSettings = () => {
  const dispatch = useDispatch();
  const { receiveSound, sentSound } = useSelector(
    (state: RootState) => state.settings.soundPreferences
  );

  const handleToggleSound = (type: "receive" | "sent") => {
    const newPreferences = {
      receiveSound: type === "receive" ? !receiveSound : receiveSound,
      sentSound: type === "sent" ? !sentSound : sentSound,
    };
    dispatch(setChangeSoundPreferences(newPreferences));
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Sound Settings</Text>

      {/* Receive Sound */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Receive Sound</Text>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            receiveSound && styles.activeButton,
            { opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => handleToggleSound("receive")}
        >
          <Ionicons
            name={receiveSound ? "volume-high" : "volume-mute"}
            size={16}
            color={receiveSound ? "white" : color.primaryColor}
          />
          <Text
            style={[styles.buttonText, receiveSound && styles.activeButtonText]}
          >
            {receiveSound ? "On" : "Off"}
          </Text>
        </Pressable>
      </View>

      {/* Sent Sound */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Sent Sound</Text>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            sentSound && styles.activeButton,
            { opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => handleToggleSound("sent")}
        >
          <Ionicons
            name={sentSound ? "volume-high" : "volume-mute"}
            size={16}
            color={sentSound ? "white" : color.primaryColor}
          />
          <Text
            style={[styles.buttonText, sentSound && styles.activeButtonText]}
          >
            {sentSound ? "On" : "Off"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SoundSettings;
