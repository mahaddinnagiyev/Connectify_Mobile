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
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

// Services
import { MessagesDTO, MessageType } from "@services/messenger/messenger.dto";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@redux/store";
import { addMessage, setMessages } from "@redux/chat/chatSlice";

// Navigation
import { RouteProp, useRoute } from "@react-navigation/native";
import { StackParamList } from "@navigation/UserStack";

// Context
import { useSocketContext } from "@context/SocketContext";

// Functions
import { formatDate, handleScroll, isUrl } from "@functions/messages.function";

// Utils
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

    socket.on("messages", handleAll);
    socket.on("newMessage", handleNew);
    return () => {
      socket.off("messages", handleAll);
      socket.off("newMessage", handleNew);
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
