import { color } from "@/colors";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomColor: color.borderLight,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 12,
  },
  roomName: {
    fontSize: 18,
    fontWeight: "600",
    color: color.primaryColor,
    maxWidth: width - 100,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: color.primaryColor,
  },
  fullName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  username: {
    color: "#666",
    fontSize: 16,
    marginBottom: 8,
  },
  bio: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
