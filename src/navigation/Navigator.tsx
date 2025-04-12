import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MessengerScreen from "../screens/messenger/MessengerScreen";

const Stack = createNativeStackNavigator();

export default function Navigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Messenger" component={MessengerScreen} />
    </Stack.Navigator>
  );
}
