import { color } from "@/colors";
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    backgroundColor: "#fff",
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

  sectionHeader: {
    fontWeight: "bold",
    backgroundColor: "#f5f5f5",
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
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: color.primaryColor,
  },

  chatDetail: {
    flexDirection: "column",
    gap: 4,
    width: "80%",
    height: "58%",
  },

  lastMessage: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  unreadCount: {
    backgroundColor: color.primaryColor,
    width: 20,
    height: 20,
    borderRadius: 50,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    position: "absolute",
    right: 10,
    bottom: -5,
  },

  noFriendsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginTop: 10,
  },
});
