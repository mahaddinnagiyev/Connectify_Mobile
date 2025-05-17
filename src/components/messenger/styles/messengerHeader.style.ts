import { color } from "@/colors";
import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  header: {
    width: screenWidth,
    paddingTop: 20,
    paddingBottom: 8,
    backgroundColor: "#fff",
    zIndex: 1,
  },

  upperHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "96%",
    marginBottom: 10,
  },

  searchContainer: {
    width: "94%",
    margin: "auto",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#333",
  },

  filterBar: {
    flexDirection: "row",
    marginHorizontal: 15,
    gap: 12,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#eee",
    width: 65,
  },
  filterBtnActive: {
    backgroundColor: color.primaryColor,
    width: 75,
  },
  filterBtnText: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: 11,
    color: color.iconDark,
    margin: "auto",
  },
  filterBtnTextActive: {
    color: color.white,
  },
});
