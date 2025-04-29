import React, { useEffect, useRef } from "react";
import { View, Text, ScrollView } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@redux/store";
import { setMessages, setShowBackToBottom } from "@redux/chat/chatSilce";
import Image from "./utils/Image";
import Video from "./utils/Video";
import File from "./utils/File";
import Audio from "./utils/Audio";
import { styles } from "./styles/messages.style";
import { MessageType } from "@services/messenger/messenger.dto";
import { useSocketContext } from "@context/SocketContext";
import { RouteProp, useRoute } from "@react-navigation/native";
import { StackParamList } from "@navigation/UserStack";

const Messages: React.FC = () => {
  const dispatch = useDispatch();
  const scrollViewRef = useRef<ScrollView>(null);
  const { showBackToBottom, messages } = useSelector(
    (state: RootState) => state.chat
  );

  const socket = useSocketContext();
  const route = useRoute<RouteProp<StackParamList, "Chat">>();
  const { chat } = route.params;

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;
    dispatch(setMessages([]));
    socket.emit("joinChatRoom", { user2Id: chat.otherUser.id });
    socket.emit("setMessageRead", { roomId: chat.id });
    socket.emit("getMessages", { roomId: chat.id, limit: 100 });

    const handle = (data: { messages: any[] }) => {
      if (data.messages[0]?.room_id === chat.id) {
        dispatch(setMessages(data.messages));
      }
    };

    socket.on("messages", handle);
    return () => {
      socket.off("messages", handle);
    };
  }, [socket, chat, dispatch]);

  const handleScroll = (event: any) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const distanceFromBottom =
      contentSize.height - layoutMeasurement.height - contentOffset.y;
    dispatch(setShowBackToBottom(distanceFromBottom >= 100));
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString + "Z");
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {messages.map((message, index) => {
          const currDate = new Date(message.created_at).toDateString();
          const prevDate =
            index > 0
              ? new Date(messages[index - 1].created_at).toDateString()
              : null;
          const showSeparator = index === 0 || currDate !== prevDate;

          // Bubble styles
          const bubbleStyle =
            message.sender_id === chat.otherUser.id
              ? styles.receivedBubble
              : styles.sentBubble;
          const textStyle =
            message.sender_id === chat.otherUser.id
              ? styles.receivedText
              : styles.sentText;

          let contentElement: React.ReactNode;
          switch (message.message_type) {
            case MessageType.IMAGE:
              contentElement = (
                <Image message={message} bubbleStyle={bubbleStyle} />
              );
              break;
            case MessageType.VIDEO:
              contentElement = (
                <Video message={message} bubbleStyle={bubbleStyle} />
              );
              break;
            case MessageType.AUDIO:
              contentElement = (
                <Audio message={message} bubbleStyle={bubbleStyle} />
              );
              break;
            case MessageType.FILE:
              contentElement = (
                <File message={message} bubbleStyle={bubbleStyle} />
              );
              break;
            case MessageType.DEFAULT:
              contentElement = (
                <View style={[styles.messageBubble, styles.defaultContainer]}>
                  <Text style={styles.defaultText}>{message.content}</Text>
                </View>
              );
              break;
            default:
              contentElement = (
                <View style={[styles.messageBubble, bubbleStyle]}>
                  <Text style={textStyle}>{message.content}</Text>
                </View>
              );
          }

          return (
            <React.Fragment key={message.id}>
              {showSeparator && (
                <View style={styles.dateSeparator}>
                  <Text style={styles.dateText}>
                    {formatDate(message.created_at)}
                  </Text>
                </View>
              )}

              {message.parent_message_id && (
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
                      <Text style={styles.parentPreviewText} numberOfLines={3}>
                        {message.parent_message_id.content}
                      </Text>
                    )}
                  </View>
                </View>
              )}

              <View style={styles.messageWrapper}>
                {contentElement}
                <Text
                  style={[
                    styles.timeText,
                    {
                      alignSelf:
                        message.sender_id === chat.otherUser.id
                          ? "flex-start"
                          : "flex-end",
                      display:
                        message.message_type === MessageType.DEFAULT
                          ? "none"
                          : "flex",
                    },
                  ]}
                >
                  {new Date(message.created_at + "Z").toLocaleTimeString("az", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </React.Fragment>
          );
        })}
      </ScrollView>

      {showBackToBottom && (
        <MaterialIcons
          name="keyboard-arrow-down"
          size={24}
          color="black"
          style={styles.backToBottom}
          onPress={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        />
      )}
    </View>
  );
};

export default Messages;
