import { color } from "@/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modal: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    borderBottomWidth: 2,
    borderBottomColor: color.borderLight,
    paddingBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 12,
    color: "#333",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#f8f8f8",
    color: "#333",
  },
  charCounterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  charCounter: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 6,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
  },
  cancelButton: {
    backgroundColor: "#f8f8f8",
  },
  saveButton: {
    shadowColor: color.primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 14,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#fff0f0",
  },
  removeButtonText: {
    color: color.avatarBorder,
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 14,
  },
});
