import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color } from "@/colors";

interface AlertProps {
  title: string;
  message: string;
  buttonText: string;
  footerNote?: string;
  iconName?: "alert-circle" | "alert-circle-outline" | "construct";
  visible: boolean;
  onClose: () => void;
}

const Alert = ({
  title,
  message,
  buttonText,
  footerNote,
  iconName,
  visible,
  onClose,
}: AlertProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Icon Container */}
          <View style={styles.iconContainer}>
            <Ionicons
              name={iconName ? iconName : "alert-circle"}
              size={40}
              color={color.primaryColor}
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>{message}</Text>

          {/* Decorative Line */}
          <View style={styles.decorationLine} />

          {/* Action Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>

          {/* Footer Note */}
          {footerNote && <Text style={styles.footerText}>{footerNote}</Text>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
  },
  iconContainer: {
    backgroundColor: "#f0fff0",
    padding: 15,
    borderRadius: 50,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: color.primaryColor,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
    color: "#4a4a4a",
  },
  decorationLine: {
    height: 4,
    width: "50%",
    backgroundColor: color.primaryColor,
    borderRadius: 2,
    marginVertical: 15,
  },
  button: {
    backgroundColor: color.primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 25,
    marginTop: 10,
    shadowColor: color.primaryColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  footerText: {
    marginTop: 20,
    color: color.emptyText,
    fontStyle: "italic",
    fontSize: 12,
  },
});

export default Alert;
