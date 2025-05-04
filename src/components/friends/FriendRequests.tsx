import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { styles } from "./styles/friendRequests";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { useFriendData } from "@hooks/useFriendData";
import { BlockAction } from "@services/friends/blockList.dto";
import ConfirmModal from "../modals/confirm/ConfirmModal";
import { FriendshipAction } from "@enums/friendship.enum";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { StackParamList } from "@navigation/UserStack";

interface RequestItem {
  id: string;
  req_id: string;
  avatarUrl?: string;
  name: string;
  username: string;
  timestamp: Date;
}

const FriendRequests: React.FC = () => {
  const { navigate } =
    useNavigation<NativeStackNavigationProp<StackParamList>>();

  const [activeTab, setActiveTab] = useState<"sent" | "received">("received");
  const [blockUserId, setBlockUserId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { sentFriendshipRequests, receivedFriendshipRequests } = useSelector(
    (s: RootState) => s.myFriends
  );
  const {
    isBlocking,
    isAccepting,
    isRejecting,
    fetchAllFriendReuqest,
    acceptAndRejectFrienship,
    blockAndUnblockUser,
  } = useFriendData();

  useEffect(() => {
    fetchAllFriendReuqest();
  }, []);

  const handleBlockUser = async () => {
    await blockAndUnblockUser(blockUserId!, BlockAction.block);
    setBlockUserId(null);
    setShowConfirmModal(false);
  };

  const acceptAndRejectFriendship = async (
    id: string,
    action: FriendshipAction
  ) => {
    await acceptAndRejectFrienship(action, id);
  };

  const data: RequestItem[] =
    activeTab === "received"
      ? receivedFriendshipRequests.map<RequestItem>((r) => ({
          id: r.id,
          req_id: r.requester.id,
          avatarUrl: r.requester.profile_picture,
          name: `${r.requester.first_name} ${r.requester.last_name}`,
          username: r.requester.username,
          timestamp: new Date(r.created_at + "Z"),
        }))
      : sentFriendshipRequests.map<RequestItem>((r) => ({
          id: r.id,
          req_id: r.requestee.id,
          avatarUrl: r.requestee.profile_picture,
          name: `${r.requestee.first_name} ${r.requestee.last_name}`,
          username: r.requestee.username,
          timestamp: new Date(r.created_at + "Z"),
        }));

  const renderItem = ({ item }: { item: RequestItem }) => (
    <View style={styles.requestItem}>
      <Pressable
        style={styles.userInfo}
        onPress={() => {
          navigate("OtherUserProfile", { username: item.username });
        }}
      >
        <Image
          source={
            item.avatarUrl
              ? { uri: item.avatarUrl }
              : require("@assets/images/no-profile-photo.png")
          }
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.username}>@{item.username}</Text>
          <Text style={styles.timestamp}>
            {formatDistanceToNow(item.timestamp)} ago
          </Text>
        </View>
      </Pressable>

      {activeTab === "received" ? (
        <View style={styles.actions}>
          <Pressable
            style={[styles.button, styles.acceptButton]}
            onPress={() =>
              acceptAndRejectFriendship(item.id, FriendshipAction.accept)
            }
          >
            {isAccepting ? (
              <ActivityIndicator size={"small"} color={"white"} />
            ) : (
              <Ionicons name="checkmark" size={18} color="white" />
            )}
          </Pressable>
          <Pressable
            style={[styles.button, styles.rejectButton]}
            onPress={() =>
              acceptAndRejectFriendship(item.id, FriendshipAction.reject)
            }
          >
            {isRejecting ? (
              <ActivityIndicator size={"small"} color={"white"} />
            ) : (
              <Ionicons name="close" size={18} color="white" />
            )}
          </Pressable>
          <Pressable
            style={[styles.button, styles.blockButton]}
            onPress={() => {
              setBlockUserId(item.req_id);
              setShowConfirmModal(true);
            }}
          >
            <Ionicons name="ban" size={16} color="white" />
          </Pressable>
        </View>
      ) : (
        <Text style={styles.sentText}>Pending</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Friendship Requests</Text>

      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tabItem, activeTab === "received" && styles.activeTab]}
          onPress={() => setActiveTab("received")}
        >
          <Text style={styles.tabText}>
            Received ({receivedFriendshipRequests.length})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabItem, activeTab === "sent" && styles.activeTab]}
          onPress={() => setActiveTab("sent")}
        >
          <Text style={styles.tabText}>
            Sent ({sentFriendshipRequests.length})
          </Text>
        </Pressable>
      </View>

      <FlatList<RequestItem>
        data={data}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No requests found</Text>
        }
      />

      <ConfirmModal
        visible={showConfirmModal}
        title="Block User"
        message="Are you sure you want to block this user?"
        confirmText="Block"
        cancelText="Cancel"
        confirmColor="red"
        isLoading={isBlocking}
        onConfirm={handleBlockUser}
        onCancel={() => setShowConfirmModal(false)}
      />
    </View>
  );
};

export default FriendRequests;
