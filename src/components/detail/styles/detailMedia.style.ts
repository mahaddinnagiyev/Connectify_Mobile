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
    borderBottomColor: "#00ff00",
  },
  tabText: {
    color: "#00ff00",
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
    backgroundColor: "#f5f5f5",
    position: "relative",
  },
  mediaThumbnail: {
    width: "100%",
    height: "100%",
  },
  playIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -16 }, { translateY: -16 }],
  },
});
