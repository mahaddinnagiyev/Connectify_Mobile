import {
  Text,
  View,
  Animated,
  Pressable,
  Dimensions,
  StyleSheet,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { BlurView } from "expo-blur";

// Components
import Image from "./Image";
import Video from "./Video";
import File from "./File";
import Audio from "./Audio";

// Icons & Clipboard
import * as Clipboard from "expo-clipboard";
import { MaterialIcons } from "@expo/vector-icons";

// Redux
import { useDispatch } from "react-redux";
import { setSuccessMessage } from "@redux/messages/messageSlice";
import {
  addDownloadMessage,
  addSelectedMessages,
  setSelectedMenuVisible,
} from "@redux/chat/chatSlice";

// Types & Colors
import { MessagesDTO } from "@services/messenger/messenger.dto";
import { MessageType } from "@services/messenger/messenger.dto";
import { color } from "@/colors";

// Styles
import { styles } from "../styles/contextMenu.style";

interface Props {
  message: MessagesDTO;
  onClose: () => void;
  onDelete?: () => void;
  onDetail?: () => void;
  userId: string;
  setReplyMessage: (message: MessagesDTO | null) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ContextMenu: React.FC<Props> = ({
  message,
  onClose,
  onDelete,
  onDetail,
  userId,
  setReplyMessage,
}) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const dispatch = useDispatch();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
  }, []);

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
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

    const imageAndVideoBubbleStyle = [
      bubbleStyle,
      {
        backgroundColor: "transparent",
        marginLeft: message.message_type === MessageType.IMAGE ? "20%" : 0,
      },
    ];

    const textBubleStyle = [
      bubbleStyle,
      styles.textBubble,
      message.sender_id === userId
        ? {
            backgroundColor: color.primaryColor,
          }
        : {
            backgroundColor: color.grayLight1,
          },
    ];

    const messagePreviewTextStyle = [
      styles.messagePreviewText,
      message.sender_id === userId ? { color: color.white } : { color: color.inputTextColor },
    ];

    switch (message.message_type) {
      case MessageType.IMAGE:
        return (
          <Image
            message={message}
            bubbleStyle={imageAndVideoBubbleStyle}
            thumbnailStyle={{
              borderRadius: 15,
              borderBottomLeftRadius: message.sender_id === userId ? 15 : 0,
              borderBottomRightRadius: message.sender_id === userId ? 0 : 15,
            }}
          />
        );
      case MessageType.VIDEO:
        return (
          <Video
            message={message}
            bubbleStyle={imageAndVideoBubbleStyle}
            thumbnailStyle={{
              borderRadius: 15,
              borderBottomLeftRadius: message.sender_id === userId ? 15 : 0,
              borderBottomRightRadius: message.sender_id === userId ? 0 : 15,
            }}
          />
        );
      case MessageType.AUDIO:
        return <Audio message={message} bubbleStyle={bubbleStyle} />;
      case MessageType.FILE:
        return <File message={message} bubbleStyle={bubbleStyle} />;
      default:
        return (
          <View style={textBubleStyle}>
            <Text
              style={messagePreviewTextStyle}
              numberOfLines={5}
              ellipsizeMode="tail"
            >
              {message.content}
            </Text>
          </View>
        );
    }
  };

  const menuItems = [
    { id: "reply", title: "Reply", icon: "reply" } as const,
    ...(message.message_type === MessageType.TEXT
      ? [{ id: "copy", title: "Copy", icon: "copy-all" }]
      : [
          {
            id: "download",
            title:
              message.message_type === MessageType.FILE
                ? "Download File"
                : message.message_type === MessageType.IMAGE
                ? "Download Image"
                : "Download Video",
            icon: "download",
          },
        ]),
    { id: "select", title: "Select", icon: "check-circle" } as const,
    {
      id: "details",
      title: "Details",
      icon: "info",
      color: color.lightBlue,
    },
    ...(message.sender_id === userId
      ? [{ id: "delete", title: "Unsend", icon: "delete", color: "red" }]
      : []),
  ];

  const onItemPress = async (id: string) => {
    closeMenu();
    switch (id) {
      case "reply":
        setReplyMessage(message);
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
      case "download":
        dispatch(addDownloadMessage(message));
        break;
      case "select":
        dispatch(setSelectedMenuVisible(true));
        dispatch(addSelectedMessages(message));
        break;
    }
  };

  return (
    <React.Fragment>
      <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]}>
        <BlurView intensity={50} style={StyleSheet.absoluteFill} />
        <Pressable style={styles.container} onPress={closeMenu}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                width: SCREEN_WIDTH * 0.8,
                transform: [{ scale: scaleAnim }],
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
                    pressed && { backgroundColor: "#f2f2f2" },
                  ]}
                  onPress={() => onItemPress(item.id)}
                >
                  <MaterialIcons
                    name={item.icon as any}
                    size={20}
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
