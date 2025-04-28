import { color } from "@/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    position: "relative",
  },
  container: {
    flex: 1,
    backgroundColor: color.inputBorderColor,
    paddingTop: 5,
  },
  contentContainer: {
    paddingVertical: 5,
  },
  messageWrapper: {
    marginBottom: 10,
    alignSelf: "stretch",
  },
  messageBubble: {
    marginHorizontal: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    maxWidth: "75%",
    borderRadius: 15,
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
  sentText: {
    color: "white",
    fontSize: 14,
  },
  receivedText: {
    color: "black",
    fontSize: 14,
  },

  timeText: {
    fontSize: 10,
    color: "#999",
    marginHorizontal: 15,
    marginTop: 4,
  },
  backToBottom: {
    position: "absolute",
    bottom: 15,
    right: 15,
    zIndex: 50,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 4,
  },
  defaultContainer: {
    alignSelf: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginVertical: 5,
  },
  defaultText: {
    color: "#666",
    fontSize: 12,
    textAlign: "center",
  },
  dateSeparator: {
    alignSelf: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 15,
    marginBottom: 5,
    borderColor: color.primaryColor,
    borderWidth: 1,
  },
  dateText: {
    color: "#666",
    fontSize: 12,
    textAlign: "center",
  },
  parentPreview: {
    marginHorizontal: 15,
    marginVertical: 4,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    maxWidth: "75%",
  },
  parentPreviewContent: {
    flexDirection: "column",
    gap: 2,
  },
  parentPreviewSender: {
    fontSize: 10,
    fontWeight: "bold",
    color: color.primaryColor,
  },
  parentPreviewLeft: {
    alignSelf: "flex-start",
  },
  parentPreviewRight: {
    alignSelf: "flex-end",
  },
  parentPreviewLine: {
    width: 3,
    height: "100%",
    backgroundColor: "#00ff00",
    borderRadius: 2,
  },
  parentPreviewText: {
    fontSize: 12,
    color: "#666",
    flexShrink: 1,
    paddingRight: 10,
  },
  parentPreviewTextDeleted: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
});
