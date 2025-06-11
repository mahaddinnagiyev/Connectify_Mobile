import { color } from "@/colors";
import { StyleSheet, Dimensions } from "react-native";
const { width: screenWidth } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: screenWidth * 0.95,
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
  scrollContent: {
    padding: 20,
  },
  row: {
    flexDirection: "row",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
    position: "relative",
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
    borderWidth: 1,
    borderColor: "#ececec",
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: "row",
    gap: 8,
  },
  genderButton: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ececec",
    backgroundColor: "#f8f9fa",
  },
  selectedGender: {
    borderColor: color.primaryColor,
    backgroundColor: color.primaryColor + "20",
  },
  genderText: {
    color: "#666",
    fontWeight: "500",
  },
  selectedGenderText: {
    color: color.primaryColor,
    fontWeight: "600",
  },
  passwordHint: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    lineHeight: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    height: 28,
  },
  checkboxText: {
    color: "#666",
    lineHeight: 28,
    textAlignVertical: "center",
    flexShrink: 1,
  },
  linkText: {
    color: color.primaryColor,
    fontWeight: "bold",
  },
  signupButton: {
    backgroundColor: color.primaryColor,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
