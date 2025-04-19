import { StyleSheet } from "react-native";
import { color } from "@color";

export const style = StyleSheet.create({
  header: {
    width: "100%",
    height: 75,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    zIndex: 50,
    borderTopColor: "#ccc",
    borderTopWidth: 1,
    backgroundColor: "#fff",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  loadingIndicator: {
    transform: [{ scale: 1.5 }],
  },
  menuContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    width: 61,
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderRadius: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  menuItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    paddingVertical: 15,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  menuImage: {
    width: 25,
    height: 25,
    borderColor: color.primaryColor,
    borderWidth: 1,
    borderRadius: 50,
  },
  menuText: {
    fontSize: 16,
    color: color.inputTextColor,
    fontWeight: 700,
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 8,
  },
  handleBar: {
    width: 48,
    height: 5,
    backgroundColor: "#ddd",
    borderRadius: 4,
  },
  pressedItem: {
    backgroundColor: "#f8f8f8",
    transform: [{ scale: 0.98 }],
  },
  chevron: {
    marginLeft: "auto",
  },
});
