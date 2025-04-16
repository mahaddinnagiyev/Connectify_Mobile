import React from "react";
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  Text,
  Switch,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import AuthHeader from "@components/auth/AuthHeader";
import LoginForm from "@components/form/auth/LoginForm";
import AuthFooter from "@components/auth/AuthFooter";
import { color } from "@/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthPage, AuthType } from "@enums/auth.enum";
import { setAuthType } from "@redux/auth/loginSlice";
import FaceIDForm from "@components/form/auth/FaceIDForm";
import SignupForm from "@components/form/auth/SignupForm";

const AuthScreen = () => {
  const { activeTab, authType } = useSelector(
    (state: RootState) => state.login
  );
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <AuthHeader />

        {/* Form */}
        {activeTab === AuthPage.LOGIN && (
          <>
            {/* Switch */}
            <View style={styles.switch}>
              <MaterialIcons
                name="password"
                color={
                  authType === AuthType.PASSWORD ? color.primaryColor : "black"
                }
                size={27}
              />
              <Switch
                trackColor={{
                  false: color.borderColor,
                  true: color.borderColor,
                }}
                thumbColor={color.primaryColor}
                onValueChange={(value) => {
                  dispatch(
                    setAuthType(value ? AuthType.FACEID : AuthType.PASSWORD)
                  );
                }}
                value={authType === AuthType.FACEID}
                shouldRasterizeIOS
              />
              <MaterialIcons
                name="badge"
                color={
                  authType === AuthType.FACEID ? color.primaryColor : "black"
                }
                size={27}
              />
            </View>
            {authType === AuthType.PASSWORD ? <LoginForm /> : <FaceIDForm />}
          </>
        )}

        {activeTab === AuthPage.SIGNUP && <SignupForm />}

        {/* Footer */}
        <AuthFooter />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    alignItems: "center",
    width: "95%",
    margin: "auto",
  },

  switch: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: color.borderColor,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    width: "100%",
  },
});

export default AuthScreen;
