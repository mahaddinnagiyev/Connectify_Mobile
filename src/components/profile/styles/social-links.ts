import { StyleSheet } from "react-native";
import { color } from "@/colors";

export const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D3436",
  },
  addButton: {
    padding: 5,
  },
  linkCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  linkHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
    paddingBottom: 10,
  },
  platformText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3436",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    padding: 5,
  },
  linkBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameText: {
    fontSize: 14,
    color: "#636E72",
    marginBottom: 4,
  },
  urlText: {
    fontSize: 14,
    color: color.primaryColor,
    fontWeight: "500",
    maxWidth: 200,
  },
  linkActions: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    color: color.primaryColor,
    fontSize: 14,
    fontWeight: "500",
  },
});
