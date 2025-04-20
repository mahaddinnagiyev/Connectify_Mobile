// ProfilePhotoModal.tsx
import { View, StyleSheet, Image, Modal, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { color } from "@/colors";

interface ProfilePhotoModalProps {
  visible: boolean;
  onClose: () => void;
  imageSource: any;
}

const ProfilePhotoModal: React.FC<ProfilePhotoModalProps> = ({
  visible,
  onClose,
  imageSource,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={onClose}
      animationType="fade"
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        {/* Image container with gesture handling */}
        <View style={styles.imageContainer}>
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: "80%",
    padding: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default ProfilePhotoModal;
