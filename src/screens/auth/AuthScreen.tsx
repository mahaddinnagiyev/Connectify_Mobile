import React from "react";
import { ScrollView, SafeAreaView, View, Text, Switch } from "react-native";
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
import { styles } from "./styles/auth.style";

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
            {/* <View style={styles.switch}>
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
            {authType === AuthType.PASSWORD ? <LoginForm /> : <FaceIDForm />} */}
            <LoginForm />
          </>
        )}

        {activeTab === AuthPage.SIGNUP && <SignupForm />}

        {/* Footer */}
        <AuthFooter />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AuthScreen;
