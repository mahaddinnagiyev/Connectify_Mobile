import { color } from "@/colors";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: color.white,
    width: width * 0.9,
    borderRadius: 15,
    overflow: "hidden",
  },
  previewContainer: {
    maxHeight: 300,
    backgroundColor: color.backgroundAlt,
    justifyContent: "center",
    alignItems: "center",
  },
  mediaPreview: {
    width: "100%",
    height: "100%",
  },
  videoPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${color.primaryColor}30`,
    justifyContent: "center",
    alignItems: "center",
  },
  filePreview: {
    padding: 20,
    backgroundColor: "#f0fff0",
    borderRadius: 50,
  },
  infoContainer: {
    padding: 20,
  },
  fileName: {
    fontSize: 18,
    fontWeight: "600",
    color: color.inputTextColor,
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  metaText: {
    color: color.grayDark1,
    fontSize: 14,
  },
  progressBar: {
    height: 4,
    backgroundColor: color.grayLight1,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: color.primaryColor,
  },
  buttonContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: color.grayLight1,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  cancelButton: {
    backgroundColor: color.backgroundAlt,
  },
  uploadButton: {
    backgroundColor: color.primaryColor,
  },
  cancelText: {
    color: color.grayDark1,
    fontWeight: "500",
  },
  uploadText: {
    color: color.white,
    fontWeight: "600",
  },
});
