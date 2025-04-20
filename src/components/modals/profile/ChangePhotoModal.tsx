import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { color } from "@/colors";
import { Ionicons } from "@expo/vector-icons";

interface ChangePhotoModalProps {
  showModal: boolean;
  onClose: () => void;
}

const ChangePhotoModal: React.FC<ChangePhotoModalProps> = ({
  showModal,
  onClose,
}) => {
  return (
    <Modal
      visible={showModal}
      transparent={true}
      onRequestClose={onClose}
      animationType="fade"
    >
      {/* Overlay area for outside clicks */}
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        {/* Modal content with click capture */}
        <View
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
        >
          {/* Remove Photo Option */}
          <Pressable
            style={({ pressed }) => [
              styles.modalOption,
              pressed && styles.optionPressed,
            ]}
          >
            <Ionicons name="trash-outline" size={24} color="red" />
            <Text style={[styles.modalOptionText, { color: "red" }]}>
              Remove profile photo
            </Text>
          </Pressable>

          {/* Divider */}
          <View style={styles.modalDivider} />

          {/* Upload Photo Option */}
          <Pressable
            style={({ pressed }) => [
              styles.modalOption,
              pressed && styles.optionPressed,
            ]}
          >
            <Ionicons
              name="cloud-upload-outline"
              size={24}
              color={color.primaryColor}
            />
            <Text style={styles.modalOptionText}>Upload from device</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

export default ChangePhotoModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "80%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: "800",
    color: color.primaryColor,
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 16,
  },
  optionPressed: {
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
  },
});
