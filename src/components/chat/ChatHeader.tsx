import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  Animated,
} from "react-native";
import { color } from "@/colors";
import { styles } from "./styles/chatHeader.style";
import { BlurView } from "expo-blur";
import * as Clipboard from "expo-clipboard";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

// Navigation
import type { StackParamList } from "@navigation/UserStack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

// Context
import { useSocketContext } from "@context/SocketContext";

// Functions
import { truncate } from "@functions/messages.function";

// Redux
import {
  clearSelectedMessages,
  markUnsending,
  setSelectedMenuVisible,
} from "@redux/chat/chatSlice";
import { RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";

// Hooks
import { useFriendData } from "@hooks/useFriendData";

// Enums
import { FriendshipAction } from "@enums/friendship.enum";

// Services
import { MessagesDTO, MessageType } from "@services/messenger/messenger.dto";

interface Props {
  setReplyMessage: (message: MessagesDTO | null) => void;
}

const ChatHeader: React.FC<Props> = ({ setReplyMessage }) => {
  const dispatch = useDispatch();

  const { navigate, goBack } =
    useNavigation<NativeStackNavigationProp<StackParamList>>();
  const route = useRoute<RouteProp<StackParamList, "Chat">>();
  const { chat } = route.params;

  const selectedChat = useSelector((state: RootState) =>
    state.messenger.filteredChats.find((c) => c.id === chat.id)
  )!;

  const socket = useSocketContext();
  const { acceptAndRejectFrienship, isAccepting, isRejecting } =
    useFriendData();

  const handleBack = () => {
    socket?.emit("leaveRoom", { roomId: chat.id });
    goBack();
  };

  const handleCloseSelectMenu = () => {
    setTimeout(() => {
      dispatch(clearSelectedMessages());
    }, 50);
  };

  const { userData } = useSelector((state: RootState) => state.myProfile);
  const { receivedFriendshipRequests = [] } = useSelector(
    (state: RootState) => state.myFriends
  );
  const { isSelectMenuVisible, selectedMessages } = useSelector(
    (state: RootState) => state.chat
  )!;

  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [isFriendRequestReceived, setIsFriendRequestReceived] =
    useState<boolean>(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isOnline ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOnline, fadeAnim]);

  useEffect(() => {
    const handleUserPresence = (payload: {
      userId: string;
      online: boolean;
      inRoom?: boolean;
    }) => {
      if (payload.userId === chat.otherUser.id) {
        setIsOnline(payload.online);
      }
    };

    socket?.on("userPresence", handleUserPresence);
    return () => {
      socket?.off("userPresence", handleUserPresence);
    };
  }, [socket, chat.otherUser.id]);

  useEffect(() => {
    const isFriendRequestReceived = receivedFriendshipRequests.some(
      (friend) => friend.requester.id === chat.otherUser.id
    );
    setIsFriendRequestReceived(isFriendRequestReceived);
  }, [receivedFriendshipRequests]);

  const unsend = useCallback(() => {
    selectedMessages.forEach((m) => dispatch(markUnsending(m.id)));
    socket?.emit("unsendMessage", {
      roomId: chat.id,
      messageIds: [selectedMessages.map((m) => m.id)],
    });
    handleCloseSelectMenu();
  }, [chat.id, socket, dispatch, selectedMessages]);

  const handleAcceptAndRejectFriendship = async (action: FriendshipAction) => {
    const friendRequest = receivedFriendshipRequests.find(
      (request) => request.requester.id === chat.otherUser.id
    );

    await acceptAndRejectFrienship(action, friendRequest!.id);
  };

  const renderButtons = useCallback(() => {
    if (isSelectMenuVisible) {
      const pressableStyle = {
        backgroundColor: color.secondaryColor,
        borderRadius: 10,
      };

      const isSingle = selectedMessages.length === 1;

      const allDownloadable = selectedMessages.every(
        (m) =>
          m.message_type === MessageType.IMAGE ||
          m.message_type === MessageType.VIDEO ||
          m.message_type === MessageType.FILE
      );

      const isAllMine = selectedMessages.every(
        (m) => m.sender_id === userData.user.id
      );

      const textMessages = selectedMessages.filter(
        (m) => m.message_type === MessageType.TEXT
      );

      const handleCopy = () => {
        if (isSingle && selectedMessages[0].message_type === MessageType.TEXT)
          return selectedMessages[0].content;

        const formatted = textMessages.map((m) => {
          const author =
            m.sender_id === userData.user.id
              ? userData.user.username
              : chat.otherUser.username;
          const time = new Date(m.created_at).toLocaleTimeString("az", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
          return `[@${author}, at ${time}]: ${m.content}`;
        });
        return formatted.join("\n");
      };

      return (
        <React.Fragment>
          {isSingle && (
            <Pressable
              onPress={() => {
                setReplyMessage(selectedMessages[0]);
                handleCloseSelectMenu();
              }}
              style={({ pressed }) => [pressed && pressableStyle]}
            >
              <MaterialCommunityIcons
                name="reply"
                size={24}
                color={color.primaryColor}
                style={styles.iconStyle}
              />
            </Pressable>
          )}

          {allDownloadable && (
            <MaterialCommunityIcons
              name="download"
              size={24}
              color={color.primaryColor}
              style={styles.iconStyle}
            />
          )}

          <Pressable
            onPress={async () => {
              const textToCopy = handleCopy();
              await Clipboard.setStringAsync(textToCopy);
              handleCloseSelectMenu();
            }}
            style={({ pressed }) => [pressed && pressableStyle]}
          >
            <MaterialCommunityIcons
              name="content-copy"
              size={24}
              color={color.primaryColor}
              style={styles.iconStyle}
            />
          </Pressable>

          {isAllMine && (
            <Pressable
              onPress={unsend}
              style={({ pressed }) => [pressed && pressableStyle]}
            >
              <MaterialCommunityIcons
                name="delete-empty"
                size={24}
                color={color.danger}
                style={styles.iconStyle}
              />
            </Pressable>
          )}
        </React.Fragment>
      );
    }
  }, [
    selectedMessages,
    isSelectMenuVisible,
    userData.user.id,
    chat.otherUser.username,
    unsend,
  ]);

  return (
    <React.Fragment>
      <View style={styles.container}>
        <View
          style={[
            styles.leftHeader,
            {
              justifyContent: isSelectMenuVisible
                ? "space-between"
                : "flex-start",
            },
          ]}
        >
          {/* Back Icon */}
          <View>
            <Pressable
              onPress={isSelectMenuVisible ? handleCloseSelectMenu : handleBack}
            >
              {isSelectMenuVisible ? (
                <MaterialIcons name="close" size={24} color="black" />
              ) : (
                <MaterialIcons name="arrow-back" size={24} color="black" />
              )}
            </Pressable>
          </View>

          {/* User Details */}
          {isSelectMenuVisible ? (
            <React.Fragment>
              <View style={{ flexDirection: "row" }}>{renderButtons()}</View>
            </React.Fragment>
          ) : (
            <Pressable
              style={styles.userDetail}
              onPress={() => navigate("ChatDetail", { chat: chat })}
            >
              <Image
                source={
                  chat.otherUserAccount.profile_picture
                    ? { uri: chat.otherUserAccount.profile_picture }
                    : require("@assets/images/no-profile-photo.png")
                }
                style={styles.profilePhoto}
              />

              <View style={{ gap: 5 }}>
                <Text style={styles.roomName}>
                  {selectedChat.name
                    ? truncate(selectedChat.name, 30)
                    : truncate(
                        `${selectedChat.otherUser.first_name} ${selectedChat.otherUser.last_name} | @${selectedChat.otherUser.username}`,
                        30
                      )}
                </Text>
                {isOnline ? (
                  <Animated.Text
                    style={[
                      styles.onlineStatus,
                      {
                        opacity: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1],
                        }),
                      },
                    ]}
                  >
                    ● Online
                  </Animated.Text>
                ) : (
                  <Animated.Text
                    style={[
                      styles.lastSeen,
                      {
                        opacity: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 0],
                        }),
                      },
                    ]}
                  >
                    Last Seen:{" "}
                    {new Date(
                      chat.otherUserAccount.last_login! + "Z"
                    ).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </Animated.Text>
                )}
              </View>
            </Pressable>
          )}
        </View>
      </View>

      {isFriendRequestReceived && (
        <View style={styles.notificationWrapper}>
          <BlurView intensity={30} tint="light" style={styles.blurContainer}>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationText}>
                {`${chat.otherUser.first_name} ${chat.otherUser.last_name} sent you a friend request.`}
              </Text>

              <View style={styles.actionsContainer}>
                <Pressable
                  style={[styles.iconButton, styles.acceptButton]}
                  onPress={() => {
                    handleAcceptAndRejectFriendship(FriendshipAction.accept);
                  }}
                  disabled={isAccepting || isRejecting}
                >
                  {isAccepting ? (
                    <ActivityIndicator size={"small"} color={"white"} />
                  ) : (
                    <Text style={styles.btnText}>Accept</Text>
                  )}
                </Pressable>

                <Pressable
                  style={[styles.iconButton, styles.rejectButton]}
                  onPress={() => {
                    handleAcceptAndRejectFriendship(FriendshipAction.reject);
                  }}
                  disabled={isAccepting || isRejecting}
                >
                  {isRejecting ? (
                    <ActivityIndicator size={"small"} color={"white"} />
                  ) : (
                    <Text style={styles.btnText}>Reject</Text>
                  )}
                </Pressable>

                <Pressable
                  style={[styles.iconButton, styles.closeButton]}
                  onPress={() => setIsFriendRequestReceived(false)}
                  disabled={isAccepting || isRejecting}
                >
                  <Text style={styles.btnText}>Close</Text>
                </Pressable>
              </View>
            </View>
          </BlurView>
        </View>
      )}
    </React.Fragment>
  );
};

export default ChatHeader;
