import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MessengerScreen from "@screens/messenger/MessengerScreen";
import ChatScreen from "@/src/screens/messenger/ChatScreen";

const Stack = createNativeStackNavigator<StackParamList>();

export type StackParamList = {
  Messenger: undefined;
  Chat: undefined;
};

export default function Navigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Messenger" component={MessengerScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}
