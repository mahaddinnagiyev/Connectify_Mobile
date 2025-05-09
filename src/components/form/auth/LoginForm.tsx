import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { styles } from "./styles/loginform";
import { color } from "@/colors";

// Expo
import { Audio } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import {
  setIsAuthenticated,
  setLoginForm,
  setToken,
} from "@redux/auth/authSlice";
import {
  setErrorMessage,
  setSuccessMessage,
} from "@redux/messages/messageSlice";

// Navigation
import { login } from "@services/auth/auth.service";
import { StackParamList } from "@navigation/AuthStack";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Services
import { getTokenFromSession } from "@services/auth/token.service";

const LoginForm = () => {
  const { navigate } =
    useNavigation<NativeStackNavigationProp<StackParamList>>();
  const dispatch = useDispatch();
  const { loginForm } = useSelector((state: RootState) => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const response = await login(loginForm);
      if (response.success) {
        const token = await getTokenFromSession();
        if (!token) return;

        dispatch(setToken(token));
        dispatch(setSuccessMessage(response.message ?? "Login successful"));
        dispatch(setLoginForm({ username_or_email: null, password: null }));
        dispatch(setIsAuthenticated(true));
        const { sound } = await Audio.Sound.createAsync(
          require("@assets/sounds/successfull-face-id-audio.wav")
        );
        await sound.playAsync();
      } else {
        dispatch(
          setErrorMessage(
            response.response?.message ??
              response.response?.error ??
              response.message ??
              response.error ??
              "Invalid Credentials"
          )
        );
      }
    } catch (error) {
      dispatch(
        setErrorMessage(
          (error as Error).message ?? "Something went wrong. Please try again."
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <View style={styles.formContainer}>
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator
              size="large"
              color={color.primaryColor}
              style={styles.loadingIndicator}
            />
          </View>
        )}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username or Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username or email"
            placeholderTextColor="#888"
            onChange={(e) =>
              dispatch(
                setLoginForm({
                  ...loginForm,
                  username_or_email: e.nativeEvent.text,
                })
              )
            }
            value={loginForm.username_or_email}
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#888"
            secureTextEntry={!isVisible}
            onChange={(e) =>
              dispatch(
                setLoginForm({ ...loginForm, password: e.nativeEvent.text })
              )
            }
            value={loginForm.password}
            editable={!isLoading}
          />
          <MaterialIcons
            name={isVisible ? "visibility" : "visibility-off"}
            onPress={() => setIsVisible(!isVisible)}
            size={24}
            color="black"
            style={styles.eyeIcon}
          />
        </View>

        <Pressable style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>
            Forgot password?{" "}
            <Text
              style={styles.forgotPasswordLink}
              onPress={() => navigate("ForgotPassword")}
            >
              Click here
            </Text>
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.loginButton,
            {
              opacity:
                !loginForm.username_or_email || !loginForm.password ? 0.6 : 1,
            },
          ]}
          onPress={handleSubmit}
          disabled={!loginForm.username_or_email || !loginForm.password}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>
      </View>
    </>
  );
};

export default LoginForm;
