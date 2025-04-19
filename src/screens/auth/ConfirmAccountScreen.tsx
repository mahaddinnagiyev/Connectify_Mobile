import { color } from "@/colors";
import { setCode } from "@redux/auth/authSlice";
import { RootState } from "@redux/store";
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
import { useDispatch, useSelector } from "react-redux";

const { width: screenWidth } = Dimensions.get("window");

const ConfirmAccountScreen = () => {
  const dispatch = useDispatch();
  const { code } = useSelector((state: RootState) => state.auth);

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

  const handleSubmit = () => {
    Keyboard.dismiss();
    setLoading(true);
  };

  const handleResend = async () => {
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
                  focusedIndex === index ? color.primaryColor : "#ddd",
                backgroundColor: focusedIndex === index ? "#f5fff5" : "#fff",
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

      {/* {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null} */}

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
          <ActivityIndicator color="#fff" />
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
    backgroundColor: "#fff",
    width: screenWidth,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
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
    shadowColor: "#000",
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
    color: "#fff",
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
    color: "#00ff00",
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
