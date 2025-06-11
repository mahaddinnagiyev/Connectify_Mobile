import { color } from "@/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: color.primaryColor,
    marginVertical: 30,
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: color.borderLight,
    borderRadius: 10,
    padding: 5,
    position: "relative",
    width: "100%",
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: color.headerTextColor,
  },
  activeTabText: {
    color: color.primaryColor,
  },
  indicator: {
    position: "absolute",
    height: 3,
    backgroundColor: color.primaryColor,
    bottom: 0,
    borderRadius: 2,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    padding: 15,
    borderWidth: 2,
    borderColor: color.primaryColor,
    borderRadius: 8,
    marginBottom: 20,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: color.primaryColor,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ececec",
  },
  dividerText: {
    color: "#888",
    fontSize: 14,
  },
});
