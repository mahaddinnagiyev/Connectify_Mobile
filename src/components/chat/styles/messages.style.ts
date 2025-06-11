import { color } from "@/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: color.inputBorderColor,
    position: "relative",
  },
  container: {
    flex: 1,
    paddingTop: 5,
  },
  contentContainer: {
    paddingVertical: 5,
  },
  messageWrapper: {
    marginBottom: 10,
    alignSelf: "stretch",
    overflow: "visible",
    zIndex: 1,
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
    backgroundColor: color.primaryColor,
    borderBottomRightRadius: 0,
  },
  receivedBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#eee",
    borderBottomLeftRadius: 0,
  },
  sentText: {
    color: color.white,
    fontSize: 14,
  },
  receivedText: {
    color: "black",
    fontSize: 14,
  },
  url: {
    fontWeight: "bold",
    color: "blue",
    textDecorationLine: "underline",
    textDecorationColor: "blue",
  },
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
  backToBottom: {
    position: "absolute",
    bottom: 15,
    right: 15,
    zIndex: 50,
    backgroundColor: color.white,
    borderRadius: 50,
    padding: 4,
  },
  defaultContainer: {
    alignSelf: "center",
    backgroundColor: color.borderLight,
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
    backgroundColor: color.borderLight,
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
  loadMoreMessagesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: color.white,
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: color.primaryColor,
    shadowColor: color.primaryColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  loadMoreMessagesText: {
    color: color.primaryColor,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 1,
  },
  arrowIcon: {
    marginTop: 2,
  },
});
