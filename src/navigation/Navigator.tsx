import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { ActivityIndicator, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AuthStack from "./AuthStack";
import UserStack from "./UserStack";
import { getTokenFromSession } from "@services/auth/token.service";
import { setIsAuthenticated } from "@redux/auth/authSlice";
import type { RootState } from "@redux/store";
import { color } from "@/colors";

export type StackParamList = {
  Messenger: undefined;
  Chat: undefined;
  MyFriends: undefined;
  Users: undefined;
  MyProfile: undefined;
  Settings: undefined;
  ContactUs: undefined;
  Auth: undefined;
};

const linking = {
  prefixes: [Linking.createURL("/"), "myapp://"],
  config: {
    screens: {
      ForgotPassword: "forgot-password/:token",
    },
  },
};

export default function RootNavigator() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const tokenObj = await getTokenFromSession();
      dispatch(setIsAuthenticated(!!tokenObj));
      setLoading(false);
    })();
  }, [dispatch]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={color.primaryColor} />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      {isAuthenticated ? <UserStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
