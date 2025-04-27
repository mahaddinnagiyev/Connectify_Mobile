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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 12,
  },
  privacyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  privacyQuestion: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: "#2D3436",
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: color.primaryColor,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 8,
    gap: 8,
  },
});
