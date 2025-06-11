import { color } from "@/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.replyBackground,
    marginTop: 28,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 60,
    backgroundColor: color.white,
    borderBottomWidth: 1,
    borderColor: "#ececec",
    elevation: 3,
    shadowColor: color.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  headerButtonText: {
    fontSize: 16,
    fontWeight: 800,
    color: color.primaryColor,
    backgroundColor: color.inputBgColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 18,
  },

  securityBanner: {
    backgroundColor: "#FFF5F7",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#FFE4E9",
    marginBottom: 8,
  },
  bannerLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginRight: 12,
  },
  bannerIcon: {
    padding: 6,
    backgroundColor: "#E8EFFE",
    borderRadius: 6,
  },
  bannerTextContainer: {
    flex: 1,
    gap: 2,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2A3342",
    lineHeight: 20,
  },
  bannerDescription: {
    fontSize: 13,
    color: "#687083",
    lineHeight: 18,
    flexWrap: "wrap",
  },
  enableButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: color.primaryColor,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 80,
  },
  enableButtonText: {
    color: color.white,
    fontWeight: "500",
    fontSize: 14,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: color.primaryColor,
  },
  content: {
    padding: 16,
  },
});
