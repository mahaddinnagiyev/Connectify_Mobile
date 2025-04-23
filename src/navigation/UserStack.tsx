import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "@screens/messenger/ChatScreen";
import MyFriendsScreen from "@screens/friend/MyFriendsScreen";
import SettingsScreen from "@screens/settings/SettingsScreen";
import ContactUsScreen from "@screens/contact/ContactUsScreen";
import MainTabsScreen from "@screens/MainTabsScreen";
import UserProfileScreen from "@screens/profile/UserProfileScreen";

const Stack = createNativeStackNavigator<StackParamList>();

export type StackParamList = {
  Home: undefined;
  Chat: undefined;
  MyFriends: undefined;
  Settings: undefined;
  ContactUs: undefined;
  OtherUserProfile: { username: string };
};

export default function UserStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Home"
    >
      <Stack.Screen name="Home" component={MainTabsScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="MyFriends" component={MyFriendsScreen} />
      <Stack.Screen name="OtherUserProfile" component={UserProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
    </Stack.Navigator>
  );
}
