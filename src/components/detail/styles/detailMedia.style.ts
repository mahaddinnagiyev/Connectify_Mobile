import { color } from "@/colors";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    marginTop: 25,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: color.primaryColor,
  },
  tabText: {
    color: color.primaryColor,
    fontWeight: "500",
  },
  mediaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  gridItem: {
    width: width / 3 - 2,
    height: width / 3 - 2,
    margin: 1,
    backgroundColor: color.secondaryColor,
    position: "relative",
  },
  mediaThumbnail: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  playIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -16 }, { translateY: -16 }],
  },
  mediaContainer: {
    flex: 1,
    justifyContent: "center",
  },
  fileList: {
    flex: 1,
    width: "100%",
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  fileName: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  noMediaText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  videoContainer: {
    flex: 1,
  },
  modal: {
    margin: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  closeButton: {
    position: "absolute",
    top: 35,
    right: 15,
    zIndex: 1,
    borderRadius: 20,
    padding: 5,
  },
});
