import { color } from "@/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 56,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  settingText: {
    fontSize: 16,
    color: "#2D3436",
    flex: 1,
    marginRight: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: color.primaryColor + "15",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 110,
    justifyContent: "center",
  },
  activeButton: {
    backgroundColor: color.primaryColor,
  },
  activeButtonText: {
    color: "#fff",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: color.primaryColor,
  },
  dangerText: {
    color: "#ff4444",
  },
  dangerButton: {
    backgroundColor: "#ff444415",
  },
});
