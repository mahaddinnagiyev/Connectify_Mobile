import { color } from "@/colors";
import { Dimensions, StyleSheet } from "react-native";
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    width: width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    borderBottomColor: color.borderColor,
    borderBottomWidth: 1,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    height: 75,
    position: "relative",
  },

  leftHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  userDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  profilePhoto: {
    width: 45,
    height: 45,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: color.primaryColor,
  },

  roomName: {
    fontSize: 16,
    fontWeight: "bold",
  },

  lastSeen: {
    fontSize: 11,
  },
});
