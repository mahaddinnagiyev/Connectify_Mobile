import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, ActivityIndicator } from "react-native";
import { styles } from "./styles/chatHeader.style";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

// Navigation
import type { StackParamList } from "@navigation/UserStack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

// Context
import { useSocketContext } from "@context/SocketContext";

// Functions
import { truncate } from "@functions/messages.function";

// Redux
import { RootState } from "@redux/store";
import { useSelector } from "react-redux";

// Hooks
import { useFriendData } from "@hooks/useFriendData";

// Enums
import { FriendshipAction } from "@enums/friendship.enum";

const ChatHeader = () => {
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

  const { receivedFriendshipRequests = [] } = useSelector(
    (state: RootState) => state.myFriends
  );

  const [isFriendRequestReceived, setIsFriendRequestReceived] =
    useState<boolean>(false);

  useEffect(() => {
    const isFriendRequestReceived = receivedFriendshipRequests.some(
      (friend) => friend.requester.id === chat.otherUser.id
    );
    setIsFriendRequestReceived(isFriendRequestReceived);
  }, [receivedFriendshipRequests]);

  const handleAcceptAndRejectFriendship = async (action: FriendshipAction) => {
    const friendRequest = receivedFriendshipRequests.find(
      (request) => request.requester.id === chat.otherUser.id
    );

    await acceptAndRejectFrienship(action, friendRequest!.id);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.leftHeader}>
          {/* Back Icon */}
          <View>
            <Pressable onPress={handleBack}>
              <MaterialIcons name="arrow-back" size={24} color="black" />
            </Pressable>
          </View>

          {/* User Details */}
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
              <Text style={styles.lastSeen}>
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
              </Text>
            </View>
          </Pressable>
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
    </>
  );
};

export default ChatHeader;
