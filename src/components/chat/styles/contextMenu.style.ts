import { color } from "@/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-end",
    zIndex: 50,
  },
  backdropPressable: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    marginTop: "auto",
  },
  messagePreviewContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 8,
  },
  messagePreviewBubble: {
    maxWidth: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  sentBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#00ff00",
    borderBottomRightRadius: 0,
  },
  receivedBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#eee",
    borderBottomLeftRadius: 0,
  },
  textBubble: {
    padding: 12,
  },
  messagePreviewText: {
    fontSize: 16,
  },
  menuItemsContainer: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 16,
  },
  url: {
    color: color.primaryColor,
    textDecorationLine: "underline",
  },
});
