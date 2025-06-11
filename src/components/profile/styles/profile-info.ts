import { color } from "@/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    paddingHorizontal: 16,
  },
  infoContainer: {
    backgroundColor: color.white,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: color.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: "#ECECEC",
  },
  titleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "600",
    color: color.headerTextColor,
  },
  infoGrid: {
    gap: 15,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    padding: 8,
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    color: color.usernameText,
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: color.headerTextColor,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: color.borderLight,
    marginTop: 12,
  },
  infoTextWithLock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  lockIcon: {
    marginLeft: 8,
    color: color.boldColor
  },
});
