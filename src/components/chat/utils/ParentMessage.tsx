import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  ChatRoomsDTO,
  MessagesDTO,
  MessageType,
} from "@services/messenger/messenger.dto";
import { User } from "@services/user/dto/user.dto";
import { Account } from "@services/account/dto/account.dto";
import { PrivacySettings } from "@services/account/dto/privacy.dto";
import { color } from "@/colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { isUrl } from "@functions/messages.function";

interface Props {
  message: MessagesDTO;
  chat: ChatRoomsDTO & {
    otherUser: User;
    otherUserAccount: Account;
    otherUserPrivacySettings: PrivacySettings;
  };
}

const ParentMessage: React.FC<Props> = ({ message, chat }) => {
  const renderMessageContent = () => {
    switch (message.parent_message_id.message_type) {
      case MessageType.AUDIO:
        return (
          <View style={styles.parentMessage}>
            <MaterialIcons
              name="audiotrack"
              color={color.boldColor}
              size={14}
            />
            <Text style={styles.parentPreviewText}>Audio</Text>
          </View>
        );

      case MessageType.IMAGE:
        return (
          <View style={styles.parentMessage}>
            <Ionicons name="image" color={color.boldColor} size={14} />
            <Text style={styles.parentPreviewText}>Image</Text>
          </View>
        );

      case MessageType.VIDEO:
        return (
          <View style={styles.parentMessage}>
            <MaterialIcons
              name="video-collection"
              color={color.boldColor}
              size={14}
            />
            <Text style={styles.parentPreviewText}>Video</Text>
          </View>
        );

      case MessageType.FILE:
        return (
          <View style={styles.parentMessage}>
            <MaterialIcons
              name="upload-file"
              color={color.boldColor}
              size={14}
            />
            <Text style={styles.parentPreviewText}>File</Text>
          </View>
        );

      default:
        return (
          <>
            {isUrl(message.parent_message_id.content) ? (
              <Text
                style={[
                  styles.parentPreviewText,
                  {
                    color: "blue",
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                    textDecorationColor: "blue",
                  },
                ]}
                numberOfLines={3}
              >
                {message.parent_message_id.content}
              </Text>
            ) : (
              <Text style={styles.parentPreviewText} numberOfLines={3}>
                {message.parent_message_id.content}
              </Text>
            )}
          </>
        );
    }
  };

  return (
    <View
      style={[
        styles.parentPreview,
        message.sender_id === chat.otherUser.id
          ? styles.parentPreviewLeft
          : styles.parentPreviewRight,
      ]}
    >
      <View style={styles.parentPreviewLine} />
      <View style={styles.parentPreviewContent}>
        <Text style={styles.parentPreviewSender}>
          {message.parent_message_id.sender_id !== chat.otherUser.id
            ? "You"
            : `@${chat.otherUser.username}`}
        </Text>

        {/* Mesaj kontenti */}
        {message.is_parent_deleted ? (
          <Text style={styles.parentPreviewTextDeleted}>
            This message has been deleted
          </Text>
        ) : (
          renderMessageContent()
        )}
      </View>
    </View>
  );
};

export default ParentMessage;

const styles = StyleSheet.create({
  parentPreview: {
    marginHorizontal: 15,
    marginVertical: 4,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    maxWidth: "75%",
  },
  parentPreviewContent: {
    flexDirection: "column",
    gap: 2,
  },
  parentMessage: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  parentPreviewSender: {
    fontSize: 10,
    fontWeight: "bold",
    color: color.primaryColor,
  },
  parentPreviewLeft: {
    alignSelf: "flex-start",
  },
  parentPreviewRight: {
    alignSelf: "flex-end",
  },
  parentPreviewLine: {
    width: 3,
    height: "100%",
    backgroundColor: "#00ff00",
    borderRadius: 2,
  },
  parentPreviewText: {
    fontSize: 12,
    color: "#666",
    flexShrink: 1,
    paddingRight: 10,
  },
  parentPreviewTextDeleted: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
});
