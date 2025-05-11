import { color } from "@/colors";
import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    height: height - 180,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    gap: 15,
  },
  loadingIndicator: {
    transform: [{ scale: 1.5 }],
  },

  chat: {
    flexDirection: "row",
    width: width - 80,
    gap: 10,
    height: 80,
    alignItems: "center",
    paddingHorizontal: 10,
    position: "relative",
    marginBottom: 10,
  },

  profilePhoto: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: color.primaryColor,
  },

  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 12,
    backgroundColor: "#4CD964",
    borderWidth: 2,
    borderColor: "white",
  },

  chatDetail: {
    height: "58%",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  lastMessage: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  unreadCount: {
    backgroundColor: color.primaryColor,
    width: 20,
    height: 20,
    borderRadius: 50,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    position: "absolute",
    right: -60,
    top: "50%",
    transform: [{ translateY: -15 }],
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  noChatsText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },

  lastMessageType: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
});
