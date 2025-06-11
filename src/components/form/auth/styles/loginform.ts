import { color } from "@/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
    marginBottom: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  loadingIndicator: {
    transform: [{ scale: 1.5 }],
  },
  inputContainer: {
    marginBottom: 15,
    position: "relative"
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: "52%",
  },
  label: {
    fontSize: 14,
    color: color.headerTextColor,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: color.inputBgColor,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ececec",
  },
  forgotPasswordButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#666",
    fontSize: 14,
  },
  forgotPasswordLink: {
    color: color.primaryColor,
    fontSize: 14,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: color.primaryColor,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  loginButtonText: {
    color: color.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
