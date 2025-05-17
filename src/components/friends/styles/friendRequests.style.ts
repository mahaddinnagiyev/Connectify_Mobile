import { color } from "@/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  tabBar: {
    flexDirection: "row",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderColor: "transparent",
  },
  activeTab: {
    borderColor: color.primaryColor,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  requestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: color.primaryColor,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3436",
  },
  username: {
    fontSize: 14,
    color: "#636E72",
    marginTop: 2,
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#F44336",
  },
  blockButton: {
    backgroundColor: "#9E9E9E",
  },
  sentText: {
    color: "#888",
    fontWeight: "500",
    marginRight: 8,
  },
  listContent: {
    paddingBottom: 30,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
});
