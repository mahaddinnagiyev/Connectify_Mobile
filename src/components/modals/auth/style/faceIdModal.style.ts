import { color } from "@/colors";
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: width * 0.9,
    backgroundColor: color.white,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: color.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 8, color: color.inputTextColor },
  subtitle: {
    fontSize: 14,
    color: color.grayDark1,
    marginBottom: 20,
    textAlign: "center",
  },
  scannerContainer: {
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: color.primaryColor,
    overflow: "hidden",
    marginBottom: 24,
  },
  cameraFill: { ...StyleSheet.absoluteFillObject },
  flipContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  flipButton: {
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 8,
    borderRadius: 5,
  },
  flipText: { color: color.white, fontWeight: "600" },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  cancel: { backgroundColor: color.secondaryColor },
  login: { backgroundColor: color.primaryColor },
  cancelText: { color: color.inputTextColor, fontWeight: "600" },
  loginText: { color: color.white, fontWeight: "600" },
  errorText: { marginTop: 12, color: "red" },
  // Permission modal styles
  permissionOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  permissionBox: {
    width: width * 0.8,
    backgroundColor: color.white,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  permissionText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  permissionActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
