import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import React from "react";
import * as Animatable from "react-native-animatable";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { color } from "@/colors";
import { MessagesDTO, MessageType } from "@services/messenger/messenger.dto";
import { RouteProp, useRoute } from "@react-navigation/native";
import { StackParamList } from "@navigation/UserStack";
import { truncate } from "@functions/messages.function";
import { formatFileSize } from "@functions/chat.functions";
import { styles } from "../styles/detailMenu.style";

interface Props {
  visible: boolean;
  onClose: () => void;
  message: MessagesDTO;
}

const DetailMenu = ({ visible, onClose, message }: Props) => {
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<StackParamList, "Chat">>();
  const { chat } = route.params;

  const getFileTypeIcon = (type: MessageType) => {
    switch (type) {
      case MessageType.IMAGE:
        return "image";
      case MessageType.VIDEO:
        return "video-collection";
      case MessageType.AUDIO:
        return "audiotrack";
      case MessageType.FILE:
        return "description";
      default:
        return "text-fields";
    }
  };

  const renderContent = () => {
    if (message.message_type === MessageType.TEXT) {
      return (
        <Text style={styles.contentText}>{truncate(message.content, 40)}</Text>
      );
    }

    return (
      <View style={styles.fileContainer}>
        <View style={styles.fileIconContainer}>
          <MaterialIcons
            name={getFileTypeIcon(message.message_type)}
            size={24}
            color={color.primaryColor}
          />
        </View>
        <View style={styles.fileDetails}>
          <Text style={styles.fileName} numberOfLines={1}>
            {truncate(message.message_name, 20) || "Unnamed file"}
          </Text>
          {message.message_size && (
            <Text style={styles.fileSize}>
              {formatFileSize(message.message_size)}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const slideIn = {
    from: {
      translateY: 300,
    },
    to: {
      translateY: 0,
    },
  };

  const slideOut = {
    from: {
      translateY: 0,
    },
    to: {
      translateY: 300,
    },
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      presentationStyle="overFullScreen"
    >
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Animatable.View
          animation={visible ? slideIn : slideOut}
          style={[styles.content, { paddingBottom: insets.bottom + 16 }]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Message Details</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.contentContainer}>
              <Text style={styles.sectionLabel}>Content</Text>
              {renderContent()}
            </View>

            <DetailRow
              label="Sender"
              value={
                message.sender_id === chat.otherUser.id
                  ? `@${chat.otherUser.username}`
                  : "You"
              }
            />

            <DetailRow
              label="Sent at"
              value={new Date(message.created_at).toLocaleString()}
            />

            <DetailRow
              label="Status"
              value={message.status}
              capitalize
              status={message.status}
            />

            {message.parent_message_id && (
              <View style={styles.replySection}>
                <Text style={styles.sectionLabel}>Reply to</Text>
                <Text style={styles.replyText}>
                  {truncate(message.parent_message_id.content, 50)}
                </Text>
              </View>
            )}
          </View>
        </Animatable.View>
      </View>
    </Modal>
  );
};

// Updated DetailRow component
const DetailRow = ({
  label,
  value,
  capitalize,
  status,
}: {
  label: string;
  value?: string;
  capitalize?: boolean;
  status?: string;
}) => {
  const statusColor = () => {
    switch (status?.toLowerCase()) {
      case "sent":
        return "#4CAF50";
      case "read":
        return "#2196F3";
      case "pending":
        return "#FF9800";
      default:
        return "#333";
    }
  };

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}:</Text>
      <Text
        style={[
          styles.value,
          capitalize && { textTransform: "capitalize" },
          status && { color: statusColor() },
        ]}
      >
        {value || "N/A"}
      </Text>
    </View>
  );
};

export default DetailMenu;
