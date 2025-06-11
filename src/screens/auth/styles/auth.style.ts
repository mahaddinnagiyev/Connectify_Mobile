import { color } from "@/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    alignItems: "center",
    width: "95%",
    margin: "auto",
  },
  switch: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
    backgroundColor: "#f8f9fa",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "95%",
    shadowColor: color.primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  authIcon: {
    color: "#adb5bd",
    padding: 10,
    borderRadius: 20,
  },
  activeAuthIcon: {
    color: color.primaryColor,
    backgroundColor: color.primaryColor + "20",
  },
  iconLabel: {
    fontSize: 12,
    color: "#adb5bd",
    marginTop: 4,
    fontFamily: "regular",
  },
  activeLabel: {
    color: color.primaryColor,
  },
  switchControl: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
});
