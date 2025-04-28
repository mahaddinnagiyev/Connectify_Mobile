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

  dropdownMenu: {
    position: "absolute",
    top: 75,
    right: 15,
    backgroundColor: "#fff",
    borderColor: color.borderColor,
    borderWidth: 1,
    borderTopWidth: 0,
    borderRadius: 10,
    borderTopRightRadius: 0,
    zIndex: 100,
  },

  menuItem: {
    width: 150,
    height: 50,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  menuText: {
    fontSize: 15,
    color: "black",
    fontWeight: 600,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
