import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./src/navigation/Navigator";

export default function App() {
  return (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
}
