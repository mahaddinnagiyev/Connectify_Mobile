import { View, Text, Pressable, Image } from "react-native";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import { styles } from "./styles/selectedModal.style";
import { color } from "@/colors";

export type FileData = {
  uri: string;
  name: string;
  size: number;
  type: "image" | "video" | "file";
  mimeType?: string;
};

type Props = {
  visible: boolean;
  file: FileData | null;
  onUpload: () => void;
  onCancel: () => void;
  uploadProgress?: number;
};

const SelectedModal = ({
  visible,
  file,
  onUpload,
  onCancel,
  uploadProgress,
}: Props) => {
  if (!visible || !file) return null;

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1) + " " + sizes[i]);
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.content}>
        {/* Preview Section */}
        <View style={styles.previewContainer}>
          {file.type === "image" ? (
            <Image
              source={{ uri: file.uri }}
              style={styles.mediaPreview}
              resizeMode="contain"
            />
          ) : file.type === "video" ? (
            <View style={styles.videoPreview}>
              <Ionicons name="play-circle" size={50} color={color.white} />
            </View>
          ) : (
            <View style={styles.filePreview}>
              <FontAwesome
                name={getFileIcon(file.mimeType)}
                size={40}
                color={color.primaryColor}
              />
            </View>
          )}
        </View>

        {/* File Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.fileName} numberOfLines={1}>
            {file.name}
          </Text>

          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>
              {file.type.toUpperCase()} • {formatSize(file.size)}
            </Text>
            {file.mimeType && (
              <Text style={styles.metaText}>
                {file.mimeType.split("/")[1].toUpperCase()}
              </Text>
            )}
          </View>

          {/* Progress Bar */}
          {uploadProgress !== undefined && (
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${uploadProgress}%` }]}
              />
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={onCancel}
            style={({ pressed }) => [
              styles.button,
              styles.cancelButton,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>

          <Pressable
            onPress={onUpload}
            style={({ pressed }) => [
              styles.button,
              styles.uploadButton,
              pressed && { backgroundColor: "#00cc00" },
            ]}
          >
            <MaterialIcons name="cloud-upload" size={24} color={color.white} />
            <Text style={styles.uploadText}>Sent</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const getFileIcon = (mimeType?: string) => {
  if (!mimeType) return "file-o";
  const type = mimeType.split("/")[0];
  if (type === "application") {
    if (mimeType.includes("pdf")) return "file-pdf-o";
    if (mimeType.includes("zip")) return "file-zip-o";
    if (mimeType.includes("word")) return "file-word-o";
  }
  return "file-o";
};

export default SelectedModal;
