import { color } from "@/colors";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: color.background, marginTop: 30 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 75,
    backgroundColor: color.background,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  backButton: {
    marginRight: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  userDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profilePhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color.primaryColor,
  },
  roomName: { fontSize: 16, fontWeight: "bold" },
  onlineStatus: { fontSize: 12, color: color.primaryColor },

  background: {
    flex: 1,
    width: width,
    height: height - 100,
  },
  flatListContent: {
    paddingVertical: 10,
  },
  messageWrapper: {
    marginVertical: 5,
    marginHorizontal: 10,
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 15,
  },
  sentBubble: {
    backgroundColor: color.primaryColor,
    borderBottomRightRadius: 0,
  },
  receivedBubble: {
    backgroundColor: "#eee",
    borderBottomLeftRadius: 0,
  },
  sentText: { color: color.white, fontSize: 14 },
  receivedText: { color: "#000", fontSize: 14 },
  dateSeparator: {
    alignSelf: "center",
    backgroundColor: color.borderLight,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: color.primaryColor,
  },
  dateText: { fontSize: 12, color: "#666" },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  timeText: {
    fontSize: 10,
    color: "#999",
    marginTop: 4,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: color.background,
    borderTopWidth: 1,
    borderTopColor: color.border,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.border,
  },
  cancelText: { fontSize: 16, color: color.textPrimary },
  setButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: color.primaryColor,
  },
  setText: { fontSize: 16, color: color.white, fontWeight: "bold" },
});
