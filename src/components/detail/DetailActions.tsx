import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles/detailActions.style";
import { color } from "@/colors";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";

// Components
import ConfirmModal from "../modals/confirm/ConfirmModal";
import RoomNameModal from "../modals/chat/RoomNameModal";

// Services
import { Chat } from "@services/messenger/messenger.dto";
import { BlockAction } from "@services/friends/blockList.dto";

// Navigation
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "@navigation/UserStack";

// Redux
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";

// Hooks
import { useFriendData } from "@hooks/useFriendData";

// Enums
import { FriendshipAction } from "@enums/friendship.enum";

interface Props {
  chat: Chat;
}

const DetailActions: React.FC<Props> = ({ chat }) => {
  const { navigate } =
    useNavigation<NativeStackNavigationProp<StackParamList>>();

  const {
    acceptAndRejectFrienship,
    isAccepting,
    isRejecting,
    blockAndUnblockUser,
    sentFriendshipRequest,
    removeFriend,
    isRemovingOrAdding,
    isBlocking,
  } = useFriendData();

  const {
    friends = [],
    receivedFriendshipRequests = [],
    sentFriendshipRequests = [],
    blockList = [],
  } = useSelector((state: RootState) => state.myFriends);

  const [isFriendRequestReceived, setIsFriendRequestReceived] =
    useState<boolean>(true);
  const [isFriendRequestSent, setIsFriendRequestSent] =
    useState<boolean>(false);
  const [isFriend, setIsFriend] = useState<boolean>(true);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showRoomNameModal, setShowRoomNameModal] = useState<boolean>(false);

  useEffect(() => {
    const isFriend = friends.some(
      (friend) => friend.friend_id === chat.otherUser.id
    );

    const isFriendRequestReceived = receivedFriendshipRequests.some(
      (request) => request.requester.id === chat.otherUser.id
    );

    const isFriendRequestSent = sentFriendshipRequests.some(
      (request) => request.requestee.id === chat.otherUser.id
    );

    const isBlocked = blockList.some(
      (list) => list.blocked_id === chat.otherUser.id
    );

    setIsFriend(isFriend);
    setIsBlocked(isBlocked);
    setIsFriendRequestSent(isFriendRequestSent);
    setIsFriendRequestReceived(isFriendRequestReceived);
  }, [friends, receivedFriendshipRequests]);

  const handleAcceptAndRejectFriendship = async (status: FriendshipAction) => {
    const friendRequest = receivedFriendshipRequests.find(
      (request) => request.requester.id === chat.otherUser.id
    );

    await acceptAndRejectFrienship(status, friendRequest!.id);
  };

  const handleBlockAndUnblockUser = async (action: BlockAction) => {
    await blockAndUnblockUser(chat.otherUser.id, action);
  };

  const handleAddOrRemoveFriend = async () => {
    if (isFriendRequestSent) return;
    if (isFriend) {
      const friendship = friends.find(
        (friend) => friend.friend_id === chat.otherUser.id
      );
      await removeFriend(friendship!.id);
    } else {
      await sentFriendshipRequest(chat.otherUser.id);
    }
  };

  return (
    <>
      {/* Friend Request Hissəsi */}
      {isFriendRequestReceived && (
        <View style={styles.friendRequestBox}>
          <Text
            style={styles.requestTitle}
          >{`${chat.otherUser.first_name} ${chat.otherUser.last_name} sent you a friend request`}</Text>
          <View style={styles.requestButtonRow}>
            <TouchableOpacity
              style={[styles.requestButton, styles.accept]}
              onPress={() =>
                handleAcceptAndRejectFriendship(FriendshipAction.accept)
              }
              disabled={isAccepting || isRejecting}
            >
              {isAccepting ? (
                <ActivityIndicator color={"white"} size={"small"} />
              ) : (
                <Text style={styles.buttonText}>Accept</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.requestButton, styles.decline]}
              onPress={() =>
                handleAcceptAndRejectFriendship(FriendshipAction.reject)
              }
              disabled={isRejecting || isAccepting}
            >
              {isRejecting ? (
                <ActivityIndicator color={"white"} size={"small"} />
              ) : (
                <Text style={styles.buttonText}>Reject</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Action Düymələri */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.borderBottom]}
          onPress={() =>
            navigate("OtherUserProfile", { username: chat.otherUser.username })
          }
        >
          <MaterialIcons
            name="person-outline"
            size={22}
            color={color.primaryColor}
          />
          <Text style={styles.actionText}>See Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.borderBottom]}
          onPress={() => setShowRoomNameModal(true)}
        >
          <Feather name="edit-2" size={22} color={color.primaryColor} />
          <Text style={styles.actionText}>Change Room Name</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.borderBottom]}
          onPress={() => setShowConfirmModal(true)}
        >
          {isBlocking ? (
            <ActivityIndicator color={color.primaryColor} size={"small"} />
          ) : (
            <MaterialIcons name="block" size={22} color="red" />
          )}
          <Text style={[styles.actionText]}>
            {isBlocked ? "Unblock" : "Block"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleAddOrRemoveFriend}
          disabled={isFriendRequestSent}
        >
          {isRemovingOrAdding ? (
            <ActivityIndicator color={color.primaryColor} size={"small"} />
          ) : (
            <FontAwesome
              name={
                isFriend
                  ? "user-times"
                  : isFriendRequestSent
                  ? "clock-o"
                  : "user-plus"
              }
              size={22}
              color={isFriend ? "red" : color.primaryColor}
            />
          )}
          <Text style={[styles.actionText]}>
            {isFriend
              ? "Remove Friend"
              : isFriendRequestSent
              ? "Pending"
              : "Add Friend"}
          </Text>
        </TouchableOpacity>
      </View>

      <ConfirmModal
        visible={showConfirmModal}
        title="Are you sure?"
        message={`Are you sure you want to ${isBlocked ? "unblock" : "block"} ${
          chat.otherUser.first_name
        } ${chat.otherUser.last_name}?`}
        confirmText={isBlocked ? "Unblock" : "Block"}
        cancelText="Cancel"
        confirmColor="red"
        isLoading={isBlocking}
        onConfirm={() =>
          handleBlockAndUnblockUser(
            isBlocked ? BlockAction.unblock : BlockAction.block
          )
        }
        onCancel={() => setShowConfirmModal(false)}
      />

      {showRoomNameModal && (
        <RoomNameModal
          visible={showRoomNameModal}
          onClose={() => setShowRoomNameModal(false)}
          chat={chat}
        />
      )}
    </>
  );
};

export default DetailActions;
