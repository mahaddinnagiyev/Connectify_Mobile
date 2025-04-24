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
    color: "#2D3436",
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
    borderColor: "white",
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
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },

  personalContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
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
    color: "#2D3436",
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
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
  },

  infoItemFull: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    gap: 12,
  },

  infoLabel: {
    color: "#636E72",
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2D3436",
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
    backgroundColor: "#E8F5E9",
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
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
});
