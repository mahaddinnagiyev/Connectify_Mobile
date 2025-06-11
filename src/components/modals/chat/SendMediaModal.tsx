import {
  View,
  Text,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/sendMedia.style";
import { color } from "@/colors";

type Props = {
  visible: boolean;
  onClose: () => void;
  onPickImage: () => void;
  onPickVideo: () => void;
  onPickFile: () => void;
};

const SendMediaModal: React.FC<Props> = ({
  visible,
  onClose,
  onPickImage,
  onPickVideo,
  onPickFile,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      hardwareAccelerated={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContent}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Send Media</Text>
            <Text style={styles.subtitle}>Choose a media type</Text>
          </View>

          <View style={styles.optionsContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.optionButton,
                pressed && styles.optionButtonPressed,
              ]}
              onPress={() => {
                onPickImage();
              }}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: "#495057"2 }]}
              >
                <MaterialIcons name="photo-camera" size={32} color={color.primaryColor} />
              </View>
              <Text style={styles.optionText}>Image</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.optionButton,
                pressed && styles.optionButtonPressed,
              ]}
              onPress={() => {
                onPickVideo();
              }}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: "#e3f2fd" }]}
              >
                <Ionicons name="videocam" size={32} color={color.lightBlue} />
              </View>
              <Text style={styles.optionText}>Video</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.optionButton,
                pressed && styles.optionButtonPressed,
              ]}
              onPress={() => {
                onPickFile();
              }}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: "#f3e5f5" }]}
              >
                <MaterialIcons
                  name="insert-drive-file"
                  size={32}
                  color="#9c27b0"
                />
              </View>
              <Text style={styles.optionText}>File</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={styles.cancelText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default SendMediaModal;
