import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { color } from "@/colors";
import { styles } from "../styles/userChats.style";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// Navigation
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { StackParamList } from "@navigation/UserStack";

// Redux
import {
  bumpChat,
  changeRoomName,
  updateLastMessage,
  updateLastMessageStatus,
  updateUnreadCount,
} from "@redux/messenger/messengerSlice";
import { RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useMessengerData } from "@hooks/useMessengerData";

// Functions
import { truncate } from "@functions/messages.function";
import { formatTime } from "@functions/chat.functions";

// Services
import {
  MessagesDTO,
  MessageStatus,
  MessageType,
} from "@services/messenger/messenger.dto";

// Context
import { useSocketContext } from "@context/SocketContext";

const UserChats = () => {
  const dispatch = useDispatch();
  const { navigate } =
    useNavigation<NativeStackNavigationProp<StackParamList>>();
  const { filteredChats } = useSelector((state: RootState) => state.messenger);
  const { userData } = useSelector((state: RootState) => state.myProfile);
  const { fetchChats, isChatsLoading } = useMessengerData();

  const socket = useSocketContext();

  const [refrehing, setRefreshing] = React.useState<boolean>(false);
  const [onlineUsers, setOnlineUsers] = React.useState<Set<string>>(new Set());

  const [isRefreshChatsLoading, setIsRefreshChatsLoading] =
    React.useState<boolean>(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setIsRefreshChatsLoading(true);
    try {
      fetchChats();
    } finally {
      setRefreshing(false);
      setIsRefreshChatsLoading(false);
    }
  };

  React.useEffect(() => {
    const handleNewGlobal = (message: MessagesDTO) => {
      dispatch(
        bumpChat({
          chatId: message.room_id,
          message,
          user_id: userData.user.id,
        })
      );
    };

    const handleLastMessageUpdated = (payload: {
      roomId: string;
      lastMessage: MessagesDTO;
    }) => {
      if (payload.lastMessage) {
        dispatch(updateLastMessage(payload.lastMessage));

        if (payload.lastMessage.sender_id === userData.user.id) {
          dispatch(updateUnreadCount({ id: payload.roomId, count: 0 }));
        }
      }
    };

    const handleUpdateUnreadCount = (payload: {
      roomId: string;
      count: number;
    }) => {
      dispatch(updateUnreadCount({ id: payload.roomId, count: payload.count }));
    };

    const handleRoomNameChanged = (payload: {
      id: string;
      name: string | null;
    }) => {
      dispatch(changeRoomName({ id: payload.id, name: payload.name }));
    };

    const handleUpdateLastMessageStatus = (paylaod: {
      roomId: string;
      ids: string[];
    }) => {
      console.log("handleUpdateLastMessageStatus", paylaod);
      dispatch(updateLastMessageStatus(paylaod));
    };

    socket?.on("newMessage", handleNewGlobal);
    socket?.on("roomNameChanged", handleRoomNameChanged);
    socket?.on("messagesRead", handleUpdateLastMessageStatus);
    socket?.on("unreadCountUpdated", handleUpdateUnreadCount);
    socket?.on("lastMessageUpdated", handleLastMessageUpdated);
    return () => {
      socket?.off("newMessage", handleNewGlobal);
      socket?.off("roomNameChanged", handleRoomNameChanged);
      socket?.off("messagesRead", handleUpdateLastMessageStatus);
      socket?.off("unreadCountUpdated", handleUpdateUnreadCount);
      socket?.off("lastMessageUpdated", handleLastMessageUpdated);
    };
  }, [socket, dispatch, userData.user.id]);

  React.useEffect(() => {
    const handleActiveUsers = (ids: string[]) => {
      setOnlineUsers(new Set(ids));
    };

    socket?.on("activeUsers", handleActiveUsers);
    return () => {
      socket?.off("activeUsers", handleActiveUsers);
    };
  }, [socket]);

  React.useEffect(() => {
    const handleUserPresence = (payload: {
      userId: string;
      online: boolean;
    }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        if (payload.online) next.add(payload.userId);
        else next.delete(payload.userId);
        return next;
      });
    };

    socket?.on("userPresence", handleUserPresence);
    return () => {
      socket?.off("userPresence", handleUserPresence);
    };
  }, [socket, filteredChats]);

  const refreshControl = (
    <RefreshControl
      refreshing={refrehing}
      onRefresh={handleRefresh}
      colors={[color.primaryColor]}
      tintColor={color.primaryColor}
    />
  );

  return (
    <View style={styles.container}>
      {isChatsLoading || isRefreshChatsLoading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator
            size="small"
            color={color.primaryColor}
            style={styles.loadingIndicator}
          />
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            Your chats are loading
          </Text>
        </View>
      ) : (
        <React.Fragment>
          {filteredChats.length === 0 ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={refreshControl}
            >
              <Text style={styles.noChatsText}>No chats found.</Text>
            </ScrollView>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={refreshControl}
            >
              {filteredChats.map((chat) => {
                const isUserOnline = onlineUsers.has(chat.otherUser.id);
                const name = chat.name
                  ? truncate(chat.name, 25)
                  : truncate(
                      `${chat.otherUser.first_name} ${chat.otherUser.last_name} | @${chat.otherUser.username}`,
                      25
                    );

                let message;

                switch (chat.lastMessage?.message_type) {
                  case MessageType.IMAGE:
                    message = (
                      <View style={styles.lastMessageType}>
                        <Ionicons
                          name="image"
                          size={14}
                          color={color.boldColor}
                        />
                        <Text>Image</Text>
                      </View>
                    );
                    break;

                  case MessageType.VIDEO:
                    message = (
                      <View style={styles.lastMessageType}>
                        <MaterialIcons
                          name="video-collection"
                          size={14}
                          color={color.boldColor}
                        />
                        <Text>Video</Text>
                      </View>
                    );
                    break;

                  case MessageType.AUDIO:
                    message = (
                      <View style={styles.lastMessageType}>
                        <MaterialIcons
                          name="audiotrack"
                          size={14}
                          color={color.boldColor}
                        />
                        <Text>Audio</Text>
                      </View>
                    );
                    break;

                  case MessageType.FILE:
                    message = (
                      <View style={styles.lastMessageType}>
                        <MaterialIcons
                          name="description"
                          size={14}
                          color={color.boldColor}
                        />
                        <Text>File</Text>
                      </View>
                    );
                    break;

                  default:
                    message = truncate(chat.lastMessage?.content, 28);
                    break;
                }

                const time = formatTime(chat.lastMessage?.created_at);

                return (
                  <TouchableOpacity
                    key={chat.id}
                    style={styles.chat}
                    onPress={() =>
                      navigate("Chat", {
                        chat: chat,
                      })
                    }
                  >
                    <View>
                      <Image
                        source={
                          chat.otherUserAccount.profile_picture
                            ? { uri: chat.otherUserAccount.profile_picture }
                            : require("@assets/images/no-profile-photo.png")
                        }
                        style={styles.profilePhoto}
                      />

                      {isUserOnline && <View style={styles.onlineDot} />}
                    </View>

                    <View style={styles.chatDetail}>
                      <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                        {name}
                      </Text>

                      <View style={styles.lastMessage}>
                        <View style={styles.lastMessageContent}>
                          {chat.lastMessage?.sender_id === userData.user.id &&
                            chat.lastMessage.message_type !==
                              MessageType.DEFAULT && (
                              <Ionicons
                                name="checkmark-done-sharp"
                                size={15}
                                color={
                                  chat.lastMessage.status === MessageStatus.READ
                                    ? "#2196F3"
                                    : "#333"
                                }
                                style={{ marginTop: 2 }}
                              />
                            )}
                          <Text numberOfLines={1}>{message}</Text>
                        </View>
                        <Text style={{ fontSize: 9 }}>{time}</Text>
                      </View>
                    </View>

                    {chat.unreadCount! > 0 && (
                      <Text style={styles.unreadCount}>{chat.unreadCount}</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </React.Fragment>
      )}
    </View>
  );
};

export default UserChats;
