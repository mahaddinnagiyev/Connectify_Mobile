import { color } from "@/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.secondaryColor,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: color.tertiaryColor,
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: color.tertiaryColor,
    textAlign: "center",
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    color: color.tertiaryColor,
    marginBottom: 10,
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.inputBgColor,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: color.inputBorderColor,
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: color.inputTextColor,
    fontSize: 16,
  },
  button: {
    backgroundColor: color.primaryColor,
    borderRadius: 10,
    height: 50,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  successMessage: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f9f1",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  successText: {
    color: color.primaryColor,
    marginLeft: 10,
    fontWeight: "500",
  },
  backLink: {
    alignSelf: "center",
    marginTop: 25,
  },
  backText: {
    color: color.primaryColor,
    fontSize: 14,
    fontWeight: "500",
  },
});
