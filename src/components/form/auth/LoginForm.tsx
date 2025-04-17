import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { styles } from "./styles/loginform";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { setIsAuthenticated, setLoginForm } from "@redux/auth/authSlice";
import { login } from "@services/auth/auth.service";
import {
  setErrorMessage,
  clearErrorMessage,
  setSuccessMessage,
  clearSuccessMessage,
} from "@/src/redux/messages/messageSlice";
import ErrorMessage from "../../messages/ErrorMessage";
import SuccessMessage from "../../messages/SuccessMessage";
import { color } from "@/colors";

const LoginForm = () => {
  const dispatch = useDispatch();
  const { loginForm } = useSelector((state: RootState) => state.auth);
  const { errorMessage, successMessage } = useSelector(
    (state: RootState) => state.messages
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const response = await login(loginForm);
      if (response.success) {
        dispatch(setSuccessMessage(response.message ?? "Login successful"));
        dispatch(setLoginForm({ username_or_email: null, password: null }));
        dispatch(setIsAuthenticated(true));
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
      {errorMessage && (
        <ErrorMessage
          message={errorMessage}
          onClose={() => dispatch(clearErrorMessage())}
        />
      )}

      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => dispatch(clearSuccessMessage())}
        />
      )}

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
            secureTextEntry
            onChange={(e) =>
              dispatch(
                setLoginForm({ ...loginForm, password: e.nativeEvent.text })
              )
            }
            value={loginForm.password}
            editable={!isLoading}
          />
        </View>

        <Pressable style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>
            Forgot password?{" "}
            <Text style={styles.forgotPasswordLink}>Click here</Text>
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
