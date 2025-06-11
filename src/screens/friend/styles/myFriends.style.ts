import { color } from "@/colors";
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    backgroundColor: color.white,
  },

  header: {
    width: width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 10,
    position: "relative",
  },

  headerButton: {
    fontSize: 16,
    fontWeight: 800,
    color: color.primaryColor,
    backgroundColor: color.inputBgColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 18,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: color.primaryColor,
  },

  searchContainer: {
    width: "94%",
    height: 40,
    margin: "auto",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.secondaryColor,
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
    color: color.inputTextColor,
  },

  sectionHeader: {
    fontWeight: "bold",
    backgroundColor: color.secondaryColor,
    width: "100%",
    textAlign: "center",
    paddingVertical: 8,
    borderRadius: 20,
  },

  chat: {
    width: width * 0.94,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 80,
    position: "relative",
    marginVertical: 3,
  },

  profilePhoto: {
    width: 55,
    height: 55,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: color.primaryColor,
  },

  chatDetail: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 4,
    width: "80%",
    height: "58%",
  },

  noFriendsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: color.inputTextColor,
    textAlign: "center",
    marginTop: 10,
  },
});
