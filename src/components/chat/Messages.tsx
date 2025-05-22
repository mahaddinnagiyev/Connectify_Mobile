import React, { useCallback, useEffect, useState, useRef, memo } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
  LayoutAnimation,
  FlatList,
  ListRenderItemInfo,
  ImageBackground,
} from "react-native";
import { color } from "@/colors";
import { styles } from "./styles/messages.style";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Audio as ExpoAudio } from "expo-av";

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
  addSelectedMessages,
  clearSelectedMessages,
  clearUnsending,
  markUnsending,
  removeMessage,
  removeSelectedMessages,
  setMessages,
  setMessagesRead,
  setSelectedMenuVisible,
} from "@redux/chat/chatSlice";

// Navigation
import { RouteProp, useRoute } from "@react-navigation/native";
import { StackParamList } from "@navigation/UserStack";

// Context
import { useSocketContext } from "@context/SocketContext";

// Functions
import {
  bannerDateLabel,
  handleScroll,
  isUrl,
} from "@functions/messages.function";
import {
  addNewMessageToStorage,
  getMessagesFromStorage,
  removeMessageFromStorage,
  setMessagesReadInStorage,
  setMessagesToStorage,
} from "@functions/storage.function";

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
}

const ITEM_BATCH = 20;

const Messages: React.FC<Props> = ({ setReplyMessage }) => {
  const dispatch = useDispatch();
  const {
    showBackToBottom,
    messages,
    unsendingIds,
    isSelectMenuVisible,
    selectedMessages,
  } = useSelector((state: RootState) => state.chat);
  const { userData } = useSelector((state: RootState) => state.myProfile);
  const { soundPreferences } = useSelector(
    (state: RootState) => state.settings
  );

  const socket = useSocketContext();
  const route = useRoute<RouteProp<StackParamList, "Chat">>();
  const { chat } = route.params;

  const listRef = useRef<FlatList<MessagesDTO>>(null);
  const soundRef = useRef<ExpoAudio.Sound | null>(null);

  const [selectedMessage, setSelectedMessage] = useState<MessagesDTO | null>(
    null
  );
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [contextMenuVisible, setContextMenuVisible] = useState<boolean>(false);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);

  useEffect(() => {
    ExpoAudio.Sound.createAsync(
      require("@assets/sounds/message-receive-audio.mp3")
    ).then(({ sound }) => {
      soundRef.current = sound;
    });
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  useEffect(() => {
    if (selectedMessages.length === 0) {
      dispatch(setSelectedMenuVisible(false));
    }
  }, [selectedMessages]);

  // ---- INITIAL LOAD & SOCKET HANDLERS ----
  useEffect(() => {
    if (!socket) return;
    dispatch(setMessages([]));
    dispatch(setSelectedMenuVisible(false));
    dispatch(clearSelectedMessages());
    setReplyMessage(null);
    socket.emit("setMessageRead", { roomId: chat.id });

    getMessagesFromStorage(chat.id).then((stored) => {
      dispatch(setMessages(stored.toReversed()));
      socket.emit("getMessages", {
        roomId: chat.id,
        limit: stored.length === 0 ? 50 : stored.length,
      });
    });

    const onAll = (data: { messages: any[] }) => {
      if (data.messages[0]?.room_id !== chat.id) return;
      dispatch(setMessages(data.messages.toReversed()));
      setMessagesToStorage(chat.id, data.messages);
    };
    const onNew = (msg: MessagesDTO) => {
      if (msg.room_id !== chat.id) return;
      LayoutAnimation.easeInEaseOut();
      dispatch(addMessage(msg));
      addNewMessageToStorage(chat.id, msg);
      if (msg.sender_id !== userData.user.id && soundPreferences.receiveSound) {
        soundRef.current?.replayAsync();
      }
    };
    const onRead = (p: { roomId: string; ids: string[] }) => {
      if (p.roomId !== chat.id) return;
      dispatch(setMessagesRead(p.ids));
      setMessagesReadInStorage(chat.id, p.ids);
    };

    const onUnsent = (data: { messageIds: string[]; roomId: string }) => {
      if (data.roomId !== chat.id) return;
      data.messageIds.forEach((id) => {
        dispatch(clearUnsending(id));
        dispatch(removeMessage(id));
        removeMessageFromStorage(chat.id, id);
      });
    };

    socket.on("messages", onAll);
    socket.on("newMessage", onNew);
    socket.on("messagesRead", onRead);
    socket?.on("messageUnsent", onUnsent);
    return () => {
      socket.off("messages", onAll);
      socket.off("newMessage", onNew);
      socket.off("messagesRead", onRead);
      socket?.off("messageUnsent", onUnsent);
    };
  }, [socket, chat.id, dispatch, unsendingIds]);

  // ---- LOAD MORE ----
  const loadMore = useCallback(async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    socket?.off("messages");
    socket?.once("messages", (data) => {
      if (data.messages[0]?.room_id === chat.id) {
        dispatch(setMessages(data.messages.toReversed()));
        setMessagesToStorage(chat.id, data.messages);
      }
      setLoadingMore(false);
    });
    socket?.emit("getMessages", {
      roomId: chat.id,
      limit: messages.length + ITEM_BATCH,
    });
  }, [loadingMore, chat.id, messages.length, dispatch, socket]);

  const unsend = useCallback(
    (id: string) => {
      dispatch(markUnsending(id));
      socket?.emit("unsendMessage", {
        roomId: chat.id,
        messageIds: [id],
      });
    },
    [chat.id, socket, dispatch]
  );

  const renderMessage = useCallback(
    ({ item, index }: ListRenderItemInfo<MessagesDTO>) => {
      const curr = new Date(item.created_at).toDateString();
      const next =
        index < messages.length - 1
          ? new Date(messages[index + 1].created_at).toDateString()
          : null;
      const showSeparator = curr !== next;

      const isMine = item.sender_id === userData.user.id;
      const bubbleStyle = isMine ? styles.sentBubble : styles.receivedBubble;
      const textStyle = isMine ? styles.sentText : styles.receivedText;
      const isSelected = selectedMessages.some((m) => m.id === item.id);

      // content
      let content: React.ReactNode;
      switch (item.message_type) {
        case MessageType.IMAGE:
          content = (
            <Image
              message={item}
              bubbleStyle={bubbleStyle}
              onLongPress={() => {
                if (isSelectMenuVisible) return;
                setSelectedMessage(item);
                setContextMenuVisible(true);
              }}
              isSelected={isSelected}
            />
          );
          break;
        case MessageType.VIDEO:
          content = (
            <Video
              message={item}
              bubbleStyle={bubbleStyle}
              onLongPress={() => {
                if (isSelectMenuVisible) return;
                setSelectedMessage(item);
                setContextMenuVisible(true);
              }}
              isSelected={isSelected}
            />
          );
          break;
        case MessageType.AUDIO:
          content = (
            <Pressable
              onLongPress={() => {
                if (isSelectMenuVisible) return;
                setSelectedMessage(item);
                setContextMenuVisible(true);
              }}
              onPress={() => {
                if (!isSelectMenuVisible) return;
                isSelected
                  ? dispatch(removeSelectedMessages(item))
                  : dispatch(addSelectedMessages(item));
              }}
              style={({ pressed }) => [
                {
                  backgroundColor:
                    pressed || isSelected ? color.solidColor : "transparent",
                  borderRadius: 10,
                },
              ]}
            >
              <Audio message={item} bubbleStyle={bubbleStyle} />
            </Pressable>
          );
          break;
        case MessageType.FILE:
          content = (
            <Pressable
              onLongPress={() => {
                if (isSelectMenuVisible) return;
                setSelectedMessage(item);
                setContextMenuVisible(true);
              }}
              onPress={() => {
                if (!isSelectMenuVisible) return;
                isSelected
                  ? dispatch(removeSelectedMessages(item))
                  : dispatch(addSelectedMessages(item));
              }}
              style={({ pressed }) => [
                {
                  backgroundColor:
                    pressed || isSelected ? color.solidColor : "transparent",
                  borderRadius: 10,
                },
              ]}
            >
              <File message={item} bubbleStyle={bubbleStyle} />
            </Pressable>
          );
          break;
        case MessageType.DEFAULT:
          content = (
            <View style={[styles.messageBubble, styles.defaultContainer]}>
              <Text style={styles.defaultText}>{item.content}</Text>
            </View>
          );
          break;
        default:
          content = (
            <Pressable
              onLongPress={() => {
                if (isSelectMenuVisible) return;
                setSelectedMessage(item);
                setContextMenuVisible(true);
              }}
              onPress={() => {
                if (!isSelectMenuVisible) return;
                isSelected
                  ? dispatch(removeSelectedMessages(item))
                  : dispatch(addSelectedMessages(item));
              }}
              style={({ pressed }) => [
                {
                  backgroundColor:
                    pressed || isSelected ? color.solidColor : "transparent",
                  borderRadius: 10,
                },
              ]}
            >
              <View style={[styles.messageBubble, bubbleStyle]}>
                {isUrl(item.content) ? (
                  <Text
                    style={styles.url}
                    onPress={() => Linking.openURL(item.content)}
                  >
                    {item.content}
                  </Text>
                ) : (
                  <Text style={textStyle}>{item.content}</Text>
                )}
              </View>
            </Pressable>
          );
      }

      return (
        <React.Fragment key={item.id}>
          <View style={styles.messageWrapper}>
            {item.message_type === MessageType.DEFAULT ? (
              <>{content}</>
            ) : unsendingIds.includes(item.id) ? (
              <View
                key={item.id}
                style={[
                  styles.messageWrapper,
                  {
                    alignSelf: "flex-end",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  },
                ]}
              >
                <ActivityIndicator size="small" color={color.primaryColor} />
                <Text
                  style={{ fontSize: 12, fontStyle: "italic", color: "gray" }}
                >
                  Unsending...
                </Text>
              </View>
            ) : (
              <SwipeableMessage
                message={item}
                setIsDetailMenuVisible={setDetailVisible}
                setSelectedMessage={setSelectedMessage}
                setReplyMessage={setReplyMessage}
              >
                {content}
              </SwipeableMessage>
            )}
            {item.message_type !== MessageType.DEFAULT && (
              <View
                style={[
                  styles.timeContainer,
                  {
                    justifyContent: isMine ? "flex-end" : "flex-start",

                    marginRight: !isMine ? 0 : 10,
                    marginLeft: !isMine ? 10 : 0,
                  },
                ]}
              >
                <Text style={[styles.timeText]}>
                  {new Date(item.created_at).toLocaleTimeString("az", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                {isMine && (
                  <Ionicons
                    name="checkmark-done-sharp"
                    size={15}
                    color={
                      item.status === MessageStatus.READ
                        ? color.primaryColor
                        : "#333"
                    }
                    style={{ marginTop: 2 }}
                  />
                )}
              </View>
            )}
          </View>
          {showSeparator && (
            <>
              {item.parent_message_id && (
                <ParentMessage message={item} chat={chat} />
              )}
              <View style={styles.dateSeparator}>
                <Text style={styles.dateText}>
                  {bannerDateLabel(item.created_at.toString())}
                </Text>
              </View>
            </>
          )}
          {item.parent_message_id && !showSeparator && (
            <ParentMessage message={item} chat={chat} />
          )}
        </React.Fragment>
      );
    },
    [
      messages,
      chat,
      setReplyMessage,
      selectedMessages,
      isSelectMenuVisible,
      userData,
    ]
  );

  const keyExtractor = useCallback((item: MessagesDTO) => item.id, []);

  return (
    <ImageBackground
      style={styles.outerContainer}
      source={require("@assets/background/image10.jpg")}
      imageStyle={{ resizeMode: "cover" }}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={keyExtractor}
        renderItem={renderMessage}
        inverted
        removeClippedSubviews
        initialNumToRender={ITEM_BATCH}
        maxToRenderPerBatch={ITEM_BATCH}
        windowSize={5}
        onScroll={(e) => handleScroll(e, dispatch)}
        contentContainerStyle={styles.contentContainer}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() =>
          loadingMore ? (
            <ActivityIndicator
              size="small"
              color={color.primaryColor}
              style={{ marginVertical: 10 }}
            />
          ) : null
        }
      />

      {showBackToBottom && (
        <MaterialIcons
          name="keyboard-arrow-down"
          size={24}
          color="black"
          style={styles.backToBottom}
          onPress={() =>
            listRef.current?.scrollToOffset({ offset: 0, animated: true })
          }
        />
      )}

      {contextMenuVisible && selectedMessage && (
        <ContextMenu
          message={selectedMessage}
          onClose={() => setContextMenuVisible(false)}
          onDelete={() => {
            unsend(selectedMessage.id);
            setContextMenuVisible(false);
          }}
          onDetail={() => setDetailVisible(true)}
          userId={userData.user.id}
          setReplyMessage={setReplyMessage}
        />
      )}

      {detailVisible && selectedMessage && (
        <DetailMenu
          visible={detailVisible}
          onClose={() => setDetailVisible(false)}
          message={selectedMessage}
        />
      )}
    </ImageBackground>
  );
};

export default memo(Messages);
