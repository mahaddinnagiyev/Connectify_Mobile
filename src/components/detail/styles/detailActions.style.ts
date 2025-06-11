import { color } from "@/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  actionContainer: {
    marginHorizontal: 15,
    borderRadius: 12,
    backgroundColor: "#fafafa",
    overflow: "hidden",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  actionText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
  },
  friendRequestBox: {
    margin: 15,
    padding: 20,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
  },
  requestTitle: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    marginBottom: 15,
  },
  requestButtonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },
  requestButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  accept: {
    backgroundColor: color.primaryColor,
  },
  decline: {
    backgroundColor: color.avatarBorder,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
