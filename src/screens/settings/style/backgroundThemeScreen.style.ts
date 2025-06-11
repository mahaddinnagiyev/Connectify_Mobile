import { color } from "@/colors";
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 2;
const ITEM_SPACING = 16;
const ITEM_SIZE = (width - ITEM_SPACING * (COLUMN_COUNT + 1)) / COLUMN_COUNT;

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.background, marginTop: 28 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 60,
    backgroundColor: color.white,
    borderBottomWidth: 1,
    borderColor: color.lightGray,
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
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: color.primaryColor,
  },
  listContent: { padding: ITEM_SPACING },
  groupContainer: { marginBottom: ITEM_SPACING * 2 },
  groupHeader: { padding: 8, borderRadius: 8, marginBottom: 12 },
  groupHeaderText: { fontSize: 16, fontWeight: "600", color: color.white },
  imageWrapper: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 12,
    overflow: "hidden",
  },
  imageBg: { flex: 1, justifyContent: "flex-end" },
  captionGradient: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  captionText: { color: color.white, fontSize: 12, fontWeight: "600" },
  activeBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  activeText: { color: color.white, fontSize: 10, marginLeft: 4 },
});
