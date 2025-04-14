import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MessengerScreen from "@screens/messenger/MessengerScreen";
import ChatScreen from "@screens/messenger/ChatScreen";
import MyFriendsScreen from "@screens/friend/MyFriendsScreen";
import UsersScreen from "@screens/users/UsersScreen";

const Stack = createNativeStackNavigator<StackParamList>();

export type StackParamList = {
  Messenger: undefined;
  Chat: undefined;
  MyFriends: undefined;
  Users: undefined;
};

export default function Navigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Messenger" component={MessengerScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="MyFriends" component={MyFriendsScreen} />
      <Stack.Screen name="Users" component={UsersScreen} />
    </Stack.Navigator>
  );
}
