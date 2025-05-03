import { Text, View, Animated, Pressable, Platform } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import * as Clipboard from "expo-clipboard";
import { MessagesDTO } from "@services/messenger/messenger.dto";
import { MessageType } from "@services/messenger/messenger.dto";
import Image from "./Image";
import Video from "./Video";
import File from "./File";
import Audio from "./Audio";
import { MaterialIcons } from "@expo/vector-icons";
import { color } from "@/colors";
import { styles } from "../styles/contextMenu.style";
import { useChatData } from "@hooks/useChatData";
import { setSuccessMessage } from "@redux/messages/messageSlice";
import { useDispatch } from "react-redux";

interface Props {
  message: MessagesDTO;
  onClose: () => void;
  onDelete?: () => void;
  onDetail?: () => void;
  userId: string;
}

const ContextMenu: React.FC<Props> = ({
  message,
  onClose,
  onDelete,
  onDetail,
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

  let menuItems: { id: string; title: string; icon: string; color?: string }[] =
    [];

  (function renderMenuItems() {
    menuItems.push({ id: "reply", title: "Reply", icon: "reply" });

    switch (message.message_type) {
      case MessageType.TEXT:
        menuItems.push({ id: "copy", title: "Copy", icon: "copy-all" });
        break;

      case MessageType.IMAGE:
      case MessageType.VIDEO:
      case MessageType.FILE:
        menuItems.push({
          id: "Download",
          title: `Download ${
            message.message_type === MessageType.FILE
              ? "File"
              : message.message_type === MessageType.IMAGE
              ? "Image"
              : "Video"
          }`,
          icon: "download",
        });
        break;
    }

    menuItems.push({
      id: "details",
      title: "Details",
      icon: "info",
      color: "#2196F3",
    });
    if (message.sender_id === userId) {
      menuItems.push({
        id: "delete",
        title: "Unsend",
        icon: "delete",
        color: "red",
      });
    }

    return menuItems;
  })();

  // Other Functions
  const dispatch = useDispatch();
  const { handleReplyMessage } = useChatData();

  return (
    <React.Fragment>
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
                  onPress={async () => {
                    closeMenu();
                    switch (item.id) {
                      case "reply":
                        handleReplyMessage(message);
                        break;
                      case "copy":
                        await Clipboard.setStringAsync(message.content);
                        dispatch(setSuccessMessage("Message copied"));
                        break;
                      case "delete":
                        onDelete?.();
                        break;
                      case "details":
                        onDetail?.();
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
    </React.Fragment>
  );
};

export default ContextMenu;
