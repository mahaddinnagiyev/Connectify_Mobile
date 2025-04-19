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
import { setAuthType } from "@redux/auth/authSlice";
import FaceIDForm from "@components/form/auth/FaceIDForm";
import SignupForm from "@components/form/auth/SignupForm";

const AuthScreen = () => {
  const { activeTab, authType } = useSelector((state: RootState) => state.auth);
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
              <View style={styles.iconContainer}>
                <MaterialIcons
                  name="password"
                  size={28}
                  style={[
                    styles.authIcon,
                    authType === AuthType.PASSWORD && styles.activeAuthIcon,
                  ]}
                  onPress={() => dispatch(setAuthType(AuthType.PASSWORD))}
                />
                <Text
                  style={[
                    styles.iconLabel,
                    authType === AuthType.PASSWORD && styles.activeLabel,
                  ]}
                >
                  Password
                </Text>
              </View>

              <Switch
                trackColor={{
                  false: "#e9ecef",
                  true: color.primaryColor + "20",
                }}
                thumbColor={color.primaryColor}
                ios_backgroundColor="#e9ecef"
                style={styles.switchControl}
                value={authType === AuthType.FACEID}
                onValueChange={(value) => {
                  dispatch(
                    setAuthType(value ? AuthType.FACEID : AuthType.PASSWORD)
                  );
                }}
              />

              <View style={styles.iconContainer}>
                <MaterialIcons
                  name="face"
                  size={28}
                  style={[
                    styles.authIcon,
                    authType === AuthType.FACEID && styles.activeAuthIcon,
                  ]}
                  onPress={() => dispatch(setAuthType(AuthType.FACEID))}
                />
                <Text
                  style={[
                    styles.iconLabel,
                    authType === AuthType.FACEID && styles.activeLabel,
                  ]}
                >
                  Face ID
                </Text>
              </View>
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
    justifyContent: "space-between",
    marginBottom: 25,
    backgroundColor: "#f8f9fa",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "95%",
    shadowColor: color.primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  authIcon: {
    color: "#adb5bd",
    padding: 10,
    borderRadius: 20,
  },
  activeAuthIcon: {
    color: color.primaryColor,
    backgroundColor: color.primaryColor + "20",
  },
  iconLabel: {
    fontSize: 12,
    color: "#adb5bd",
    marginTop: 4,
    fontFamily: "regular",
  },
  activeLabel: {
    color: color.primaryColor,
  },
  switchControl: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
});

export default AuthScreen;
