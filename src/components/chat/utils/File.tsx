import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { color } from "@/colors";
import { MaterialIcons } from "@expo/vector-icons";

// Services
import { MessagesDTO } from "@services/messenger/messenger.dto";

// Functions
import { truncate } from "@functions/messages.function";

// Redux
import { RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import { addDownloadMessage } from "@redux/chat/chatSlice";

interface Props {
  message: MessagesDTO;
  bubbleStyle: any;
  onLongPress?: () => void;
  onPress?: () => void;
}

const File: React.FC<Props> = ({
  message,
  bubbleStyle,
  onLongPress,
  onPress,
}) => {
  const dispatch = useDispatch();

  const { selectedMessages } = useSelector((state: RootState) => state.chat);
  const { userData } = useSelector((state: RootState) => state.myProfile);

  const isMine = message.sender_id === userData.user.id;

  const iconColor = isMine ? color.white : color.primaryColor;

  const handleDownload = async () => {
    dispatch(addDownloadMessage(message));
  };

  const openFile = async () => {
    await Linking.openURL(message.content!);
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} bytes`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.fileContainer,
        bubbleStyle,
        pressed && { backgroundColor: color.solidColor },
      ]}
      onLongPress={onLongPress}
      onPress={onPress}
    >
      <MaterialIcons name="insert-drive-file" size={24} color={iconColor} />
      <TouchableOpacity
        onPress={openFile}
        onLongPress={onLongPress}
        disabled={selectedMessages.length > 0}
      >
        <View style={styles.fileDetails}>
          <Text
            style={[isMine ? styles.sentText : styles.receivedText]}
            numberOfLines={1}
          >
            {message.message_name
              ? truncate(message.message_name, 20)
              : "Imported file"}
          </Text>
          <Text
            style={[
              styles.fileSizeText,
              isMine ? styles.sentFileSize : styles.receivedFileSize,
            ]}
          >
            {formatFileSize(message.message_size!)}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleDownload}
        style={styles.downloadIconContainer}
        onLongPress={onLongPress}
        disabled={selectedMessages.length > 0}
      >
        <MaterialIcons name="file-download" size={24} color={iconColor} />
      </TouchableOpacity>
    </Pressable>
  );
};

export default File;

const styles = StyleSheet.create({
  sentText: {
    color: color.white,
    fontSize: 14,
  },
  receivedText: {
    color: "black",
    fontSize: 14,
  },
  fileContainer: {
    marginHorizontal: 10,
    padding: 12,
    maxWidth: "65%",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fileDetails: {
    flex: 1,
    marginLeft: 8,
  },
  fileSizeText: {
    fontSize: 12,
    marginTop: 4,
  },
  sentFileSize: {
    color: "rgba(255,255,255,0.7)",
  },
  receivedFileSize: {
    color: "rgba(0,0,0,0.6)",
  },
  downloadIconContainer: {
    padding: 4,
    marginLeft: 8,
  },
});
