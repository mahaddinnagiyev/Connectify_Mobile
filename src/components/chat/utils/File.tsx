import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { color } from "@/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { MessagesDTO } from "@services/messenger/messenger.dto";
import { RouteProp, useRoute } from "@react-navigation/native";
import { StackParamList } from "@navigation/UserStack";
import { truncate } from "@functions/messages.function";
import { useDispatch } from "react-redux";
import { addDownloadMessage } from "@redux/chat/chatSlice";
import { setSuccessMessage } from "@redux/messages/messageSlice";

interface Props {
  message: MessagesDTO;
  bubbleStyle: any;
}

const File: React.FC<Props> = ({ message, bubbleStyle }) => {
  const dispatch = useDispatch();

  const route = useRoute<RouteProp<StackParamList, "Chat">>();
  const { chat } = route.params;

  const iconColor =
    message.sender_id !== chat.otherUser.id ? "white" : color.primaryColor;

  const handleDownload = async () => {
    dispatch(addDownloadMessage(message));
  };

  return (
    <View style={[styles.fileContainer, bubbleStyle]}>
      <MaterialIcons name="insert-drive-file" size={24} color={iconColor} />
      <View style={styles.fileDetails}>
        <Text
          style={{
            ...(message.sender_id !== chat.otherUser.id
              ? styles.sentText
              : styles.receivedText),
          }}
          numberOfLines={1}
        >
          {message.message_name
            ? truncate(message.message_name, 20)
            : "Imported file"}
        </Text>
        <Text
          style={[
            styles.fileSizeText,
            message.sender_id !== chat.otherUser.id
              ? styles.sentFileSize
              : styles.receivedFileSize,
          ]}
        >
          {(message.message_size! / 1024).toFixed(1)} KB
        </Text>
      </View>
      <TouchableOpacity
        onPress={handleDownload}
        style={styles.downloadIconContainer}
      >
        <MaterialIcons name="file-download" size={24} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
};

export default File;

const styles = StyleSheet.create({
  sentText: {
    color: "white",
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
