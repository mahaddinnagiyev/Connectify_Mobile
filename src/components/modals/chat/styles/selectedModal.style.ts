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
    backgroundColor: "white",
    width: width * 0.9,
    borderRadius: 15,
    overflow: "hidden",
  },
  previewContainer: {
    maxHeight: 300,
    backgroundColor: "#f8f8f8",
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
    backgroundColor: "#00ff0030",
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
    color: "#333",
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  metaText: {
    color: "#666",
    fontSize: 14,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#eee",
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
    borderTopColor: "#eee",
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
    backgroundColor: "#f8f8f8",
  },
  uploadButton: {
    backgroundColor: color.primaryColor,
  },
  cancelText: {
    color: "#666",
    fontWeight: "500",
  },
  uploadText: {
    color: "white",
    fontWeight: "600",
  },
});
