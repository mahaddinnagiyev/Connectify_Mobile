import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@redux/store";
import { setMessages, setReplyMessage } from "@/src/redux/chat/chatSlice";
import Image from "./utils/Image";
import Video from "./utils/Video";
import File from "./utils/File";
import Audio from "./utils/Audio";
import { styles } from "./styles/messages.style";
import { MessagesDTO, MessageType } from "@services/messenger/messenger.dto";
import { useSocketContext } from "@context/SocketContext";
import { RouteProp, useRoute } from "@react-navigation/native";
import { StackParamList } from "@navigation/UserStack";
import ParentMessage from "./utils/ParentMessage";
import { formatDate, handleScroll, isUrl } from "@functions/messages.function";
import { AntDesign } from "@expo/vector-icons";
import { color } from "@/colors";
import ContextMenu from "./utils/ContextMenu";
import { SwipeableMessage } from "./utils/swipeUtils";

const Messages: React.FC = () => {
  const dispatch = useDispatch();
  const scrollViewRef = useRef<ScrollView>(null);
  const { showBackToBottom, messages } = useSelector(
    (state: RootState) => state.chat
  );
  const { userData } = useSelector((state: RootState) => state.myProfile);

  const socket = useSocketContext();
  const route = useRoute<RouteProp<StackParamList, "Chat">>();
  const { chat } = route.params;

  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(false);
  const [hasMoreMessagesLoading, setHasMoreMessagesLoading] =
    useState<boolean>(false);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<MessagesDTO | null>(
    null
  );

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;
    dispatch(setMessages([]));
    dispatch(setReplyMessage(null));
    socket.emit("joinChatRoom", { user2Id: chat.otherUser.id });
    socket.emit("setMessageRead", { roomId: chat.id });
    socket.emit("getMessages", { roomId: chat.id, limit: 100 });

    const handle = (data: { messages: any[] }) => {
      if (data.messages[0]?.room_id === chat.id) {
        dispatch(setMessages(data.messages));
      }

      if (data.messages.length < 100) setHasMoreMessages(false);
      else setHasMoreMessages(true);
    };

    socket.on("messages", handle);
    return () => {
      socket.off("messages", handle);
    };
  }, [socket, chat, dispatch]);

  const loadMoreMessages = useCallback(
    async (newLimit: number) => {
      if (!hasMoreMessagesLoading && hasMoreMessages) {
        try {
          setHasMoreMessagesLoading(true);

          socket?.off("messages");

          socket?.once("messages", (data) => {
            if (data.messages[0]?.room_id === chat.id) {
              dispatch(setMessages([...data.messages]));
            }
            setHasMoreMessages(data.messages.length >= newLimit);
            setHasMoreMessagesLoading(false);
          });

          socket?.emit("getMessages", { roomId: chat.id, limit: newLimit });
        } catch (error) {
          setHasMoreMessagesLoading(false);
        }
      }
    },
    [hasMoreMessages, chat.id, socket, dispatch]
  );

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
        onScroll={(event) => handleScroll(event, dispatch)}
        scrollEventThrottle={16}
      >
        {hasMoreMessages && (
          <View style={{ alignItems: "center" }}>
            {hasMoreMessagesLoading ? (
              <Pressable style={styles.loadMoreMessagesContainer}>
                <ActivityIndicator color={color.primaryColor} size="small" />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => loadMoreMessages(messages.length + 100)}
                style={styles.loadMoreMessagesContainer}
              >
                <AntDesign name="down" size={16} color={color.primaryColor} />
                <Text style={styles.loadMoreMessagesText}>More</Text>
              </Pressable>
            )}
          </View>
        )}
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
                <Image
                  message={message}
                  bubbleStyle={bubbleStyle}
                  onLongPress={() => {
                    setSelectedMessage(message);
                    setContextMenuVisible(true);
                  }}
                />
              );
              break;
            case MessageType.VIDEO:
              contentElement = (
                <Video
                  message={message}
                  bubbleStyle={bubbleStyle}
                  onLongPress={() => {
                    setSelectedMessage(message);
                    setContextMenuVisible(true);
                  }}
                />
              );
              break;
            case MessageType.AUDIO:
              contentElement = (
                <Pressable
                  onLongPress={() => {
                    setSelectedMessage(message);
                    setContextMenuVisible(true);
                  }}
                >
                  <Audio message={message} bubbleStyle={bubbleStyle} />
                </Pressable>
              );
              break;
            case MessageType.FILE:
              contentElement = (
                <Pressable
                  onLongPress={() => {
                    setSelectedMessage(message);
                    setContextMenuVisible(true);
                  }}
                >
                  <File message={message} bubbleStyle={bubbleStyle} />
                </Pressable>
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
                <Pressable
                  onLongPress={() => {
                    setSelectedMessage(message);
                    setContextMenuVisible(true);
                  }}
                >
                  <View style={[styles.messageBubble, bubbleStyle]}>
                    {isUrl(message.content) ? (
                      <Pressable>
                        <Text style={styles.url}>{message.content}</Text>
                      </Pressable>
                    ) : (
                      <Text style={textStyle}>{message.content}</Text>
                    )}
                  </View>
                </Pressable>
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
                <ParentMessage message={message} chat={chat} />
              )}

              <View style={styles.messageWrapper}>
                <SwipeableMessage message={message}>
                  {contentElement}
                </SwipeableMessage>

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

      {contextMenuVisible && selectedMessage && (
        <ContextMenu
          message={selectedMessage}
          onClose={() => setContextMenuVisible(false)}
          onDelete={() => console.log("Delete")}
          userId={userData.user.id}
        />
      )}
    </View>
  );
};

export default Messages;
