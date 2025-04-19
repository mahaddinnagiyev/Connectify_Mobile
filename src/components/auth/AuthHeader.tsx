import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  LayoutChangeEvent,
} from "react-native";
import { styles } from "./styles/authheader";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { color } from "@/colors";
import { setActiveTab } from "@redux/auth/authSlice";
import { AuthPage } from "@enums/auth.enum";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

const AuthHeader = () => {
  const dispatch = useDispatch();
  const { activeTab } = useSelector((s: RootState) => s.auth);

  const [tabWidth, setTabWidth] = useState(0);

  const anim = useRef(
    new Animated.Value(activeTab === AuthPage.SIGNUP ? 1 : 0)
  ).current;

  const onTabLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width / 2;
    setTabWidth(w);
  };

  const switchTab = (page: AuthPage) => {
    dispatch(setActiveTab(page));
    Animated.spring(anim, {
      toValue: page === AuthPage.SIGNUP ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 80,
    }).start();
  };

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, tabWidth],
  });

  React.useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.WEB_CLIENT_ID,
      offlineAccess: true,
    });
  }, []);

  async function signInWithGoogle() {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    // userInfo.idToken-ni backend-ə göndərərək JWT / session yaradın
  }

  return (
    <>
      <Text style={styles.headerTitle}>Welcome to Connectify</Text>

      <View style={styles.tabContainer} onLayout={onTabLayout}>
        <Pressable
          style={[styles.tabButton]}
          onPress={() => switchTab(AuthPage.LOGIN)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === AuthPage.LOGIN && styles.activeTabText,
            ]}
          >
            Log in
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabButton]}
          onPress={() => switchTab(AuthPage.SIGNUP)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === AuthPage.SIGNUP && styles.activeTabText,
            ]}
          >
            Sign up
          </Text>
        </Pressable>

        {/* Switcher indicator */}
        {tabWidth > 0 && (
          <Animated.View
            style={[
              styles.indicator,
              {
                width: tabWidth,
                transform: [{ translateX }],
              },
            ]}
          />
        )}
      </View>

      <Pressable style={styles.googleButton}>
        <Ionicons name="logo-google" size={20} color={color.primaryColor} />
        <Text style={styles.googleButtonText}>
          Sign {activeTab === AuthPage.LOGIN ? "in" : "up"} with Google
        </Text>
      </Pressable>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>
    </>
  );
};

export default AuthHeader;
