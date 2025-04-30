import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { color } from "@/colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useUpdateProfile, UploadFile } from "@hooks/useUpdateProfile";

interface ChangePhotoModalProps {
  visible: boolean;
  onClose: () => void;
}

const ChangePhotoModal: React.FC<ChangePhotoModalProps> = ({
  visible,
  onClose,
}) => {
  const { changeProfilePhoto, isLoading } = useUpdateProfile();

  const handleDefault = async () => {
    await changeProfilePhoto({ clear: false });
    onClose();
  };

  const handleRemove = async () => {
    await changeProfilePhoto({ clear: true });
    onClose();
  };

  const handleUpload = async () => {
    await ImagePicker.requestMediaLibraryPermissionsAsync();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const localUri = asset.uri;
      const filename = localUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename ?? "");
      const type = match ? `image/${match[1]}` : `image`;

      const file = {
        uri: localUri,
        name: filename ?? "photo.jpg",
        type,
      };

      await changeProfilePhoto({ file });
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator
              size="large"
              color={color.primaryColor}
              style={styles.loadingIndicator}
            />
          </View>
        )}
        <View
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
        >
          <Pressable onPress={handleDefault} style={styles.modalOption}>
            <MaterialCommunityIcons
              name="face-man"
              size={24}
              color={color.primaryColor}
            />
            <Text style={styles.modalOptionText}>Set Default Avatar</Text>
          </Pressable>
          <View style={styles.modalDivider} />
          <Pressable onPress={handleUpload} style={styles.modalOption}>
            <Ionicons
              name="cloud-upload-outline"
              size={24}
              color={color.primaryColor}
            />
            <Text style={styles.modalOptionText}>Upload from Device</Text>
          </Pressable>
          <View style={styles.modalDivider} />
          <Pressable onPress={handleRemove} style={styles.modalOption}>
            <Ionicons name="trash-outline" size={24} color="red" />
            <Text style={[styles.modalOptionText, { color: "red" }]}>
              Remove Photo
            </Text>
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  loadingIndicator: {
    transform: [{ scale: 1.5 }],
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
