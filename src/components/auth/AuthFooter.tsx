import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { color } from "@/colors";
import { RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "@redux/auth/authSlice";
import { AuthPage } from "@enums/auth.enum";

const AuthFooter = () => {
  const { activeTab } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  return (
    <View>
      <Text style={styles.signupText}>
        {activeTab === AuthPage.LOGIN
          ? "Don't have an account? "
          : "Already have an account? "}
        {activeTab === AuthPage.LOGIN ? (
          <Text
            style={styles.signupLink}
            onPress={() => dispatch(setActiveTab(AuthPage.SIGNUP))}
          >
            Sign up
          </Text>
        ) : (
          <Text
            style={styles.signupLink}
            onPress={() => dispatch(setActiveTab(AuthPage.LOGIN))}
          >
            Log in
          </Text>
        )}
      </Text>
    </View>
  );
};

export default AuthFooter;

const styles = StyleSheet.create({
  signupText: {
    color: color.grayDark1,
    fontSize: 14,
  },
  signupLink: {
    color: color.primaryColor,
    fontWeight: "600",
  },
  footerText: {
    color: color.grayDark1,
    fontSize: 12,
    marginTop: 30,
  },
});
