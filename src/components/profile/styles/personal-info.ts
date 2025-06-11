import { StyleSheet } from "react-native";
import { color } from "@/colors";

export const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    paddingHorizontal: 16,
  },

  titleContainer: {
    alignItems: "center",
    gap: 16,
    marginBottom: 30,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: color.headerTextColor,
  },

  profile_picture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: color.primaryColor,
  },

  profileImageContainer: {
    position: "relative",
    alignItems: "center",
  },

  profilePhotoEditIcon: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: color.primaryColor,
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: color.white,
  },

  actionButtonsContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.primaryColor,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  blockButton: {
    backgroundColor: "red",
  },
  actionButtonText: {
    color: color.white,
    fontSize: 14,
    fontWeight: "500",
  },

  personalContainer: {
    backgroundColor: color.white,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: color.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  personalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: color.borderColor,
  },

  personalTitleContainerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  presonalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: color.headerTextColor,
  },

  infoGrid: {
    gap: 12,
  },

  infoRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  infoItem: {
    flex: 1,
    padding: 12,
    backgroundColor: color.replyBackground,
    borderRadius: 8,
  },

  infoItemFull: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: color.replyBackground,
    borderRadius: 8,
    gap: 12,
  },

  infoLabel: {
    color: color.usernameText,
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: color.headerTextColor,
  },

  infoLine: {
    display: "none",
  },

  infoTextWithLock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  lockIcon: {
    marginLeft: 8,
    color: color.boldColor,
  },

  fieldIcon: {
    padding: 8,
    backgroundColor: "#495057"2,
    borderRadius: 8,
  },

  changeProfilePhotoBtn: {
    backgroundColor: color.primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  changeProfilePhotoText: {
    color: color.white,
    fontWeight: "700",
    fontSize: 14,
  },

  friendRequestBox: {
    margin: 15,
    marginTop: 0,
    padding: 20,
    backgroundColor: color.backgroundAlt,
    borderRadius: 12,
  },
  requestTitle: {
    textAlign: "center",
    color: color.grayDark1,
    fontSize: 14,
    marginBottom: 15,
  },
  requestButtonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },
  requestButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  accept: {
    backgroundColor: color.primaryColor,
  },
  decline: {
    backgroundColor: color.avatarBorder,
  },
  buttonText: {
    color: color.white,
    fontWeight: "600",
  },
});
