import Header from "@/src/components/header/Header";
import Messenger from "@/src/components/messenger/Messenger";
import React from "react";
import { View } from "react-native";

export default function MessengerScreen() {
  return (
    <View
      style={{ justifyContent: "center", alignItems: "center", height: "100%" }}
    >
      <Header />

      <Messenger />
    </View>
  );
}
