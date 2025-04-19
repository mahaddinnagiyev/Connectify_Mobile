import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthScreen from "@screens/auth/AuthScreen";
import ConfirmAccountScreen from "@screens/auth/ConfirmAccountScreen";

const Stack = createNativeStackNavigator<StackParamList>();

export type StackParamList = {
  Auth: undefined;
  ConfirmAccount: undefined;
};

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Auth"
    >
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="ConfirmAccount" component={ConfirmAccountScreen} />
    </Stack.Navigator>
  );
}
