// styles.ts
import { color } from "@/colors";
import { StyleSheet, Dimensions, Platform } from "react-native";

const screenWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  headerContainer: {
    width: screenWidth,
    backgroundColor: color.white,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: color.inputBorderColor,
  },
  upperHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    height: 60,
    overflow: "hidden",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    position: "absolute",
  },
  iconBtn: {
    padding: 8,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: color.primaryColor,
  },
  searchWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.secondaryColor,
    borderRadius: 20,
    paddingHorizontal: 8,
    height: 55,
    position: "absolute",
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: color.inputTextColor,
    marginLeft: 8,
  },
  filterBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  filterBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: color.grayLight1,
    alignItems: "center",
  },
  filterBtnActive: {
    backgroundColor: color.primaryColor,
  },
  filterBtnText: {
    fontSize: 12,
    color: color.iconDark,
  },
  filterBtnTextActive: {
    color: color.white,
  },
});
