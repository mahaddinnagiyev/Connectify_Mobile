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
    gap: 4,
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
  onlineStatus: {
    fontSize: 11,
    color: color.primaryColor,
  },
  notificationWrapper: {
    position: "absolute",
    top: 104,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  blurContainer: {
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  notificationContent: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
  },
  notificationText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2d3436",
    marginRight: 10,
    flexShrink: 1,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  btnText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#fff",
  },
  acceptButton: {
    backgroundColor: "rgba(46, 213, 115, 0.9)",
  },
  rejectButton: {
    backgroundColor: "rgba(255, 71, 87, 0.9)",
  },
  closeButton: {
    backgroundColor: "rgba(178, 190, 195, 0.9)",
  },
});
