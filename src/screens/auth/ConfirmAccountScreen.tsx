import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Audio } from "expo-av";
import { color } from "@/colors";

// Redux
import {
  setErrorMessage,
  setSuccessMessage,
} from "@redux/messages/messageSlice";
import {
  setCode,
  setIsAuthenticated,
  setSignupForm,
  setToken,
} from "@redux/auth/authSlice";
import { RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";

// Services
import { getTokenFromSession } from "@services/auth/token.service";
import { confirmAccount, signup } from "@services/auth/auth.service";

const { width: screenWidth } = Dimensions.get("window");

const ConfirmAccountScreen = () => {
  const dispatch = useDispatch();
  const { signupForm, code } = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [resendTime, setResendTime] = useState(60);
  const inputs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (resendTime > 0) {
      const timer = setInterval(() => {
        setResendTime((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTime]);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    dispatch(setCode(newCode));

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (!text && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    try {
      Keyboard.dismiss();
      setLoading(true);

      const response = await confirmAccount(Number(code.join("")));

      if (response.success) {
        const token = await getTokenFromSession();
        if (!token) return;

        dispatch(setToken(token));

        dispatch(
          setSuccessMessage(
            "Account confirmed successfully. Welcome to Connectify"
          )
        );
        dispatch(setCode([null, null, null, null, null, null]));
        dispatch(
          setSignupForm({
            first_name: "",
            last_name: "",
            username: "",
            email: "",
            password: "",
            confirm: "",
            gender: "",
          })
        );
        const { sound } = await Audio.Sound.createAsync(
          require("@assets/sounds/successfull-face-id-audio.wav")
        );
        await sound.playAsync();
        dispatch(setIsAuthenticated(true));
      } else {
        if (Array.isArray(response.response?.message)) {
          dispatch(setErrorMessage(response.response?.message[0]));
        }
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
      dispatch(
        setErrorMessage((error as Error).message) ??
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const response = await signup(signupForm);

    if (response.success) {
      dispatch(
        setSuccessMessage(
          "New confirmation code has been sent to your email. The old code has been expired."
        )
      );
    }

    setResendTime((prev) => prev + 30);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Account</Text>
      <Text style={styles.subtitle}>We sent a 6-digit code to your email</Text>

      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref!)}
            style={[
              styles.codeInput,
              {
                borderColor:
                  focusedIndex === index ? color.primaryColor : color.inputBorderColor,
                backgroundColor: focusedIndex === index ? "#f5fff5" : color.white,
              },
            ]}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            selectTextOnFocus
          />
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: code.every((c) => c)
              ? color.primaryColor
              : "#e0e0e0",
            opacity: loading ? 0.7 : 1,
          },
        ]}
        onPress={handleSubmit}
        disabled={!code.every((c) => c) || loading}
      >
        {loading ? (
          <ActivityIndicator color={color.white} />
        ) : (
          <Text style={styles.buttonText}>Verify Account</Text>
        )}
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>
          Didn't receive code?{" "}
          {resendTime === 0 ? (
            <Text
              style={[styles.resendLink, { color: color.primaryColor }]}
              onPress={handleResend}
            >
              Resend
            </Text>
          ) : (
            <Text style={styles.resendTime}>({resendTime}s)</Text>
          )}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.white,
    width: screenWidth,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: color.inputTextColor,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
    gap: 10,
  },
  codeInput: {
    width: 50,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    shadowColor: color.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    width: 160,
  },
  buttonText: {
    color: color.white,
    fontSize: 18,
    fontWeight: "600",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 15,
    fontSize: 14,
  },
  success: {
    color: color.primaryColor,
    textAlign: "center",
    marginBottom: 15,
    fontSize: 14,
    fontWeight: "500",
  },
  resendContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  resendText: {
    color: "#666",
  },
  resendLink: {
    fontWeight: "600",
  },
  resendTime: {
    color: "#999",
  },
});

export default ConfirmAccountScreen;
