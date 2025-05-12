import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
  LayoutAnimation,
} from "react-native";
import { color } from "@/colors";
import { styles } from "./styles/messages.style";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";

// Services
import {
  MessagesDTO,
  MessageStatus,
  MessageType,
} from "@services/messenger/messenger.dto";

// Redux
import { RootState } from "@redux/store";
import { useSelector, useDispatch } from "react-redux";
import {
  addMessage,
  removeMessage,
  setMessages,
  setMessagesRead,
} from "@redux/chat/chatSlice";

// Navigation
import { RouteProp, useRoute } from "@react-navigation/native";
import { StackParamList } from "@navigation/UserStack";

// Context
import { useSocketContext } from "@context/SocketContext";

// Functions
import { formatDate, handleScroll, isUrl } from "@functions/messages.function";

// Utils And Components
import Image from "./utils/Image";
import Video from "./utils/Video";
import File from "./utils/File";
import Audio from "./utils/Audio";
import ParentMessage from "./utils/ParentMessage";
import ContextMenu from "./utils/ContextMenu";
import DetailMenu from "./utils/DetailMenu";
import { SwipeableMessage } from "./utils/swipeUtils";

interface Props {
  setReplyMessage: (message: MessagesDTO | null) => void;
  scrollViewRef: React.RefObject<ScrollView>;
}

const Messages: React.FC<Props> = ({ setReplyMessage, scrollViewRef }) => {
  const dispatch = useDispatch();
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
  const [isDetailMenuVisible, setIsDetailMenuVisible] = useState(false);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;
    dispatch(setMessages([]));
    setReplyMessage(null);
    socket.emit("setMessageRead", { roomId: chat.id });
    socket.emit("getMessages", { roomId: chat.id, limit: 100 });

    const handleAll = (data: { messages: any[] }) => {
      if (data.messages[0]?.room_id === chat.id) {
        dispatch(setMessages(data.messages));
      }

      if (data.messages.length < 100) setHasMoreMessages(false);
      else setHasMoreMessages(true);
    };

    const handleNew = (message: MessagesDTO) => {
      if (message.room_id !== chat.id) return;

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      dispatch(addMessage(message));
    };

    const handleMessagesRead = (payload: { roomId: string, ids: string[] }) => {
      if (payload.roomId === chat.id) {
        dispatch(setMessagesRead(payload.ids));
      }
    };

    socket.on("messages", handleAll);
    socket.on("newMessage", handleNew);
    socket.on("messagesRead", handleMessagesRead);
    return () => {
      socket.off("messages", handleAll);
      socket.off("newMessage", handleNew);
      socket.off("messagesRead", handleMessagesRead);
    };
  }, [socket, chat, dispatch]);

  useEffect(() => {
    const handleDelete = (data: { messageId: string; roomId: string }) => {
      if (data.roomId !== chat.id) return;
      dispatch(removeMessage(data.messageId));
    };
    socket?.on("messageDeleted", handleDelete);
    return () => {
      socket?.off("messageDeleted", handleDelete);
    };
  }, [socket, chat.id, dispatch]);

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

  const handleUnsendMessage = useCallback(
    (messageId: string) => {
      if (!messageId) return;

      socket?.emit("unsendMessage", { roomId: chat.id, messageId });
    },
    [chat.id, socket]
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
                <SwipeableMessage
                  message={message}
                  setIsDetailMenuVisible={setIsDetailMenuVisible}
                  setSelectedMessage={setSelectedMessage}
                  setReplyMessage={setReplyMessage}
                  scrollViewRef={scrollViewRef}
                >
                  <Image
                    message={message}
                    bubbleStyle={bubbleStyle}
                    onLongPress={() => {
                      setSelectedMessage(message);
                      setContextMenuVisible(true);
                    }}
                  />
                </SwipeableMessage>
              );
              break;
            case MessageType.VIDEO:
              contentElement = (
                <SwipeableMessage
                  message={message}
                  setIsDetailMenuVisible={setIsDetailMenuVisible}
                  setSelectedMessage={setSelectedMessage}
                  setReplyMessage={setReplyMessage}
                  scrollViewRef={scrollViewRef}
                >
                  <Video
                    message={message}
                    bubbleStyle={bubbleStyle}
                    onLongPress={() => {
                      setSelectedMessage(message);
                      setContextMenuVisible(true);
                    }}
                  />
                </SwipeableMessage>
              );
              break;
            case MessageType.AUDIO:
              contentElement = (
                <SwipeableMessage
                  message={message}
                  setIsDetailMenuVisible={setIsDetailMenuVisible}
                  setSelectedMessage={setSelectedMessage}
                  setReplyMessage={setReplyMessage}
                  scrollViewRef={scrollViewRef}
                >
                  <TouchableOpacity
                    onLongPress={() => {
                      setSelectedMessage(message);
                      setContextMenuVisible(true);
                    }}
                  >
                    <Audio message={message} bubbleStyle={bubbleStyle} />
                  </TouchableOpacity>
                </SwipeableMessage>
              );
              break;
            case MessageType.FILE:
              contentElement = (
                <SwipeableMessage
                  message={message}
                  setIsDetailMenuVisible={setIsDetailMenuVisible}
                  setSelectedMessage={setSelectedMessage}
                  setReplyMessage={setReplyMessage}
                  scrollViewRef={scrollViewRef}
                >
                  <TouchableOpacity
                    onLongPress={() => {
                      setSelectedMessage(message);
                      setContextMenuVisible(true);
                    }}
                  >
                    <File message={message} bubbleStyle={bubbleStyle} />
                  </TouchableOpacity>
                </SwipeableMessage>
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
                <SwipeableMessage
                  message={message}
                  setIsDetailMenuVisible={setIsDetailMenuVisible}
                  setSelectedMessage={setSelectedMessage}
                  setReplyMessage={setReplyMessage}
                  scrollViewRef={scrollViewRef}
                >
                  <TouchableOpacity
                    onLongPress={() => {
                      setSelectedMessage(message);
                      setContextMenuVisible(true);
                    }}
                  >
                    <View style={[styles.messageBubble, bubbleStyle]}>
                      {isUrl(message.content) ? (
                        <TouchableOpacity
                          onPress={() => Linking.openURL(message.content)}
                        >
                          <Text style={styles.url}>{message.content}</Text>
                        </TouchableOpacity>
                      ) : (
                        <Text style={textStyle}>{message.content}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </SwipeableMessage>
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
                {contentElement}

                {message.message_type !== MessageType.DEFAULT && (
                  <View
                    style={[
                      styles.timeContainer,
                      {
                        justifyContent:
                          message.sender_id === chat.otherUser.id
                            ? "flex-start"
                            : "flex-end",

                        marginRight:
                          message.sender_id === chat.otherUser.id ? 0 : 10,
                        marginLeft:
                          message.sender_id === chat.otherUser.id ? 10 : 0,
                      },
                    ]}
                  >
                    <Text style={[styles.timeText]}>
                      {new Date(message.created_at + "Z").toLocaleTimeString(
                        "az",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </Text>
                    {message.sender_id !== chat.otherUser.id && (
                      <Ionicons
                        name="checkmark-done-sharp"
                        size={15}
                        color={
                          message.status === MessageStatus.READ
                            ? "#2196F3"
                            : "#333"
                        }
                        style={{ marginTop: 2 }}
                      />
                    )}
                  </View>
                )}
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
          onDelete={() => {
            handleUnsendMessage(selectedMessage.id);
            setContextMenuVisible(false);
          }}
          onDetail={() => setIsDetailMenuVisible(true)}
          userId={userData.user.id}
          setReplyMessage={setReplyMessage}
        />
      )}

      {isDetailMenuVisible && (
        <DetailMenu
          visible={isDetailMenuVisible}
          onClose={() => setIsDetailMenuVisible(false)}
          message={selectedMessage!}
        />
      )}
    </View>
  );
};

export default Messages;
