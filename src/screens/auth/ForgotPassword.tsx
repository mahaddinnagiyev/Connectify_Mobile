import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { styles } from "./styles/forgotPassword.style";
import { color } from "@/colors";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { StackParamList } from "@navigation/AuthStack";
import { useDispatch } from "react-redux";
import {
  setErrorMessage,
  setSuccessMessage,
} from "@redux/messages/messageSlice";
import { forgotPassoword } from "@services/auth/auth.service";

type Props = StackScreenProps<StackParamList, "ForgotPassword">;

const ForgotPassword = ({ route, navigation }: Props) => {
  const dispatch = useDispatch();
  const { goBack } = useNavigation<NativeStackNavigationProp<StackParamList>>();
  //   const { token } = route.params;

  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);

  const handleForgotPasswordSubmit = async () => {
    try {
      setIsForgotPasswordLoading(true);

      const response = await forgotPassoword(email);

      if (response.success) {
        dispatch(
          setSuccessMessage(response.message ?? "Password reset link sent")
        );
        setIsSubmitted(true);
      } else {
        dispatch(
          setErrorMessage(
            response.response?.message ??
              response.response?.error ??
              response.message ??
              response.error ??
              "Something went wrong while confirming account"
          )
        );
      }
    } catch (error) {
      dispatch(setErrorMessage((error as Error).message));
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={styles.header}>
            <FontAwesome name="lock" size={80} color={color.primaryColor} />
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Enter your email address to receive a link to reset your password
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <FontAwesome
                name="envelope"
                size={20}
                color={color.tertiaryColor}
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="example@mail.com"
                placeholderTextColor={color.tertiaryColor}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              { opacity: isForgotPasswordLoading || !email ? 0.5 : 1 },
            ]}
            onPress={handleForgotPasswordSubmit}
            activeOpacity={0.8}
            disabled={isForgotPasswordLoading || !email}
          >
            {isForgotPasswordLoading && <ActivityIndicator size="small" />}
            <Text style={styles.buttonText}>Send Reset Link</Text>
          </TouchableOpacity>

          {isSubmitted && (
            <View style={styles.successMessage}>
              <FontAwesome
                name="check-circle"
                size={20}
                color={color.primaryColor}
              />
              <Text style={styles.successText}>
                Password reset link sent to {email}
              </Text>
            </View>
          )}

          <TouchableOpacity style={styles.backLink} onPress={() => goBack()}>
            <Text style={styles.backText}>
              <FontAwesome name="arrow-left" size={14} /> Go back to login page
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;
