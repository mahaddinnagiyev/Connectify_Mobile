import { color } from "@/colors";
import Messenger from "@components/messenger/Messenger";
import React from "react";
import { View } from "react-native";

export default function MessengerScreen() {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        backgroundColor: color.white,
      }}
    >
      <Messenger />
    </View>
  );
}
