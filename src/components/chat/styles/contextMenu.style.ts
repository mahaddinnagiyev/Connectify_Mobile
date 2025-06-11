import { StyleSheet, Dimensions } from "react-native";
import { color } from "@/colors";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  modalContent: {
    borderRadius: 12,
    padding: 12,
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  messagePreviewContainer: {
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
  },
  messagePreviewBubble: {
    maxWidth: "100%",
    borderRadius: 12,
    overflow: "hidden",
    paddingHorizontal: 15,
  },
  sentBubble: {
    alignSelf: "center",
    width: "100%",
    borderBottomRightRadius: 0,
    backgroundColor: color.primaryColor,
  },
  receivedBubble: {
    alignSelf: "center",
    width: "100%",
    borderBottomLeftRadius: 0,
    backgroundColor: "#eee",
  },
  textBubble: {
    padding: 8,
    paddingVertical: 16,
  },
  messagePreviewText: {
    fontSize: 14,
  },
  menuItemsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingVertical: 8,
    backgroundColor: color.white,
    borderRadius: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
    marginVertical: 4,
  },
  menuItemText: {
    fontSize: 14,
    marginLeft: 12,
    fontWeight: "600",
  },
});
