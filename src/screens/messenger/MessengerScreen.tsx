import Header from "@/src/components/header/Header";
import React from "react";
import { View } from "react-native";

export default function MessengerScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Header />
    </View>
  );
}
