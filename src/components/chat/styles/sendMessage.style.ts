import { color } from "@/colors";
import { Dimensions, StyleSheet } from "react-native";

const screenWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    backgroundColor: color.inputBgColor,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  leftButton: {
    width: screenWidth * 0.12,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 4,
  },
  messageInput: {
    flex: 1,
    marginRight: 8,
    borderBottomColor: color.inputBorderColor,
    borderBottomWidth: 1,
    minHeight: 35,
  },
  textInput: {
    flex: 1,
    padding: 5,
    textAlignVertical: "top",
    fontSize: 16,
  },
  sendButton: {
    width: screenWidth * 0.12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: color.primaryColor,
    paddingVertical: 8,
    marginLeft: 4,
  },
  blockedText: {
    color: "#2D3436",
    fontSize: 16,
    fontWeight: "600",
    margin: "auto",
  },
  mainContainer: {
    backgroundColor: color.inputBgColor,
    borderTopWidth: 1,
    borderTopColor: color.borderColor,
  },
  replyPreviewContainer: {
    paddingHorizontal: 6,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: color.borderColor,
    backgroundColor: color.inputBorderColor,
  },
  replyPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.secondaryColor,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 10,
    marginBottom: 8,
  },
  replyPreviewLine: {
    width: 3,
    height: "100%",
    backgroundColor: color.primaryColor,
    borderRadius: 2,
    marginRight: 8,
  },
  replyContent: {
    flex: 1,
  },
  replySender: {
    fontSize: 12,
    fontWeight: "bold",
    color: color.primaryColor,
    marginBottom: 4,
  },
  replyText: {
    fontSize: 14,
    color: "#666",
  },
  urlText: {
    color: "blue",
    textDecorationLine: "underline",
  },
  replyMessageType: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
});
