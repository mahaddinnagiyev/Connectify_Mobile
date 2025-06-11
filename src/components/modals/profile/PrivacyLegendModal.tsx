import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { StackParamList } from "@navigation/UserStack";
import { color } from "@/colors";

interface PrivacyLegendModalProps {
  visible: boolean;
  onClose: () => void;
}

const PrivacyLegendModal: React.FC<PrivacyLegendModalProps> = ({
  visible,
  onClose,
}) => {
  const { navigate } =
    useNavigation<NativeStackNavigationProp<StackParamList>>();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback>
        <View style={styles.backdrop}>
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <Ionicons
                  name="shield-checkmark"
                  size={24}
                  color="rgba(255,255,255,0.8)"
                />
                <Text style={styles.headerText}>Privacy Settings</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons
                    name="close"
                    size={24}
                    color="rgba(255,255,255,0.8)"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <View style={styles.row}>
                <View
                  style={[styles.iconContainer, { backgroundColor: "#FF6B6B" }]}
                >
                  <MaterialIcons name="lock-person" size={24} color={color.white} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.label}>Private</Text>
                  <Text style={styles.description}>Visible only to you</Text>
                </View>
              </View>

              <View style={styles.separator} />

              <View style={styles.row}>
                <View
                  style={[styles.iconContainer, { backgroundColor: "#4ECDC4" }]}
                >
                  <MaterialIcons name="people-alt" size={24} color={color.white} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.label}>Friends Only</Text>
                  <Text style={styles.description}>
                    Shared with your connections
                  </Text>
                </View>
              </View>

              <View style={styles.separator} />

              <View style={styles.row}>
                <View
                  style={[styles.iconContainer, { backgroundColor: "#45B7D1" }]}
                >
                  <MaterialIcons name="public" size={24} color={color.white} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.label}>Public</Text>
                  <Text style={styles.description}>Visible to everyone</Text>
                </View>
              </View>
            </View>

            <View style={styles.footerDescription}>
              <Text style={styles.footerDescriptionText}>
                If you want to change privacy settings, go to{" "}
                <Text
                  style={{ fontWeight: "bold", color: color.boldColor }}
                  onPress={() => navigate("Settings")}
                >
                  "Settings"
                </Text>
              </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity
                onPress={onClose}
                style={styles.okButton}
                activeOpacity={0.9}
              >
                <Text style={styles.okText}>UNDERSTOOD</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: color.white,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 25,
    backgroundColor: color.boldColor,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    color: color.white,
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginLeft: 10,
    flex: 1,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  content: {
    paddingVertical: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: color.headerTextColor,
    marginBottom: 3,
  },
  description: {
    fontSize: 14,
    color: color.usernameText,
    opacity: 0.8,
  },
  separator: {
    height: 1,
    backgroundColor: "#EDEDED",
    marginVertical: 8,
    marginHorizontal: 25,
  },
  footerDescription: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  footerDescriptionText: {
    fontSize: 15,
    color: color.usernameText,
    textAlign: "center",
  },
  footer: {
    padding: 25,
    paddingTop: 10,
  },
  okButton: {
    borderRadius: 15,
    backgroundColor: color.boldColor,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  okText: {
    color: color.white,
    fontWeight: "700",
    letterSpacing: 0.5,
    fontSize: 15,
  },
});

export default PrivacyLegendModal;
