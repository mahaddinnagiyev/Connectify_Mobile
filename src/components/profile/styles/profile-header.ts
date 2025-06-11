import { StyleSheet } from "react-native";
import { color } from "@/colors";

export const styles = StyleSheet.create({
  headerMenuContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 60,
    marginTop: 50,
    borderBottomWidth: 1,
    borderColor: color.borderLight,
  },

  scrollView: {
    flex: 1,
    marginHorizontal: 5,
  },

  scrollContent: {
    alignItems: "center",
  },

  menuItemWrapper: {
    marginRight: 15,
    alignItems: "center",
  },

  menuText: {
    fontSize: 14,
    color: color.gray,
    fontWeight: "800",
  },

  activeMenuText: {
    color: color.primaryColor,
    fontWeight: "bold",
  },

  activeLine: {
    height: 2,
    width: "100%",
    backgroundColor: color.primaryColor,
    marginTop: 3,
  },
});
