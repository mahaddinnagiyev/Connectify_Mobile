import {
  StyleSheet,
  Text,
  View,
  Animated,
  Pressable,
  Platform,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { MessagesDTO } from "@services/messenger/messenger.dto";
import { MessageType } from "@services/messenger/messenger.dto";
import Image from "./Image";
import Video from "./Video";
import File from "./File";
import Audio from "./Audio";
import { MaterialIcons } from "@expo/vector-icons";
import { color } from "@/colors";
import { styles } from "../styles/contextMenu.style";

interface Props {
  message: MessagesDTO;
  onClose: () => void;
  onReply?: () => void;
  onCopy?: () => void;
  onDelete?: () => void;
  userId: string;
}

const ContextMenu: React.FC<Props> = ({
  message,
  onClose,
  onReply,
  onCopy,
  onDelete,
  userId,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 30,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(onClose);
  };

  const renderMessageContent = () => {
    const bubbleStyle = [
      styles.messagePreviewBubble,
      message.sender_id === userId ? styles.sentBubble : styles.receivedBubble,
    ];
    const textBubbleBgColor =
      message.sender_id === userId ? color.primaryColor : "#f1f1f1";
    const textBubbleColor = message.sender_id === userId ? "white" : "black";

    switch (message.message_type) {
      case MessageType.IMAGE:
        return <Image message={message} bubbleStyle={bubbleStyle} />;
      case MessageType.VIDEO:
        return <Video message={message} bubbleStyle={bubbleStyle} />;
      case MessageType.AUDIO:
        return <Audio message={message} bubbleStyle={bubbleStyle} />;
      case MessageType.FILE:
        return <File message={message} bubbleStyle={bubbleStyle} />;
      default:
        return (
          <View
            style={[
              bubbleStyle,
              styles.textBubble,
              { backgroundColor: textBubbleBgColor },
            ]}
          >
            <Text
              style={[styles.messagePreviewText, { color: textBubbleColor }]}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {message.content}
            </Text>
          </View>
        );
    }
  };

  const menuItems = [
    { id: "reply", title: "Reply", icon: "reply" },
    { id: "copy", title: "Copy", icon: "copy-all" },
    { id: "delete", title: "Delete", icon: "delete", color: "red" },
  ];

  return (
    <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
      <Pressable style={styles.backdropPressable} onPress={closeMenu}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY: slideAnim }],
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                },
                android: {
                  elevation: 5,
                },
              }),
            },
          ]}
        >
          <View style={styles.messagePreviewContainer}>
            {renderMessageContent()}
          </View>

          <View style={styles.menuItemsContainer}>
            {menuItems.map((item) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => [
                  styles.menuItem,
                  { backgroundColor: pressed ? "#f0f0f0" : "white" },
                ]}
                onPress={() => {
                  closeMenu();
                  switch (item.id) {
                    case "reply":
                      onReply?.();
                      break;
                    case "copy":
                      onCopy?.();
                      break;
                    case "delete":
                      onDelete?.();
                      break;
                  }
                }}
              >
                <MaterialIcons
                  name={item.icon as any}
                  size={24}
                  color={item.color || color.primaryColor}
                />
                <Text
                  style={[
                    styles.menuItemText,
                    { color: item.color || color.primaryColor },
                  ]}
                >
                  {item.title}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

export default ContextMenu;
