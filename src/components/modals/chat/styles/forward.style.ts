import { color } from "@/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  container: {
    width: "90%",
    maxHeight: "85%",
    backgroundColor: color.background,
    borderRadius: 16,
    padding: 16,
    shadowColor: color.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: color.textPrimary,
  },
  closeButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.inputBgColor,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: color.textPrimary,
  },
  selectedContainer: {
    flexDirection: "row",
    paddingVertical: 8,
    marginBottom: 12,
  },
  selectedItem: {
    marginRight: 8,
    position: "relative",
  },
  selectedAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: color.primary,
  },
  removeButton: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: color.danger,
    borderRadius: 10,
    padding: 2,
  },
  listContent: {
    paddingBottom: 16,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: color.white,
    marginBottom: 8,
  },
  pressedUser: {
    backgroundColor: color.secondaryColor,
  },
  selectedHighlight: {
    backgroundColor: "rgba(52, 152, 219, 0.1)",
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
    borderColor: color.border,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: color.textPrimary,
  },
  userUsername: {
    fontSize: 14,
    color: color.textSecondary,
  },
  forwardAction: {
    marginTop: 12,
    backgroundColor: color.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  forwardText: {
    color: color.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
