import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/myFriends.style";

// Hooks
import { useFriendData } from "@hooks/useFriendData";
import { useUserData } from "@hooks/useUserData";

// Redux
import { RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import { addChat } from "@redux/messenger/messengerSlice";

// Navigation
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { StackParamList } from "@navigation/UserStack";

// Context
import { useSocketContext } from "@context/SocketContext";

// Services
import { ChatRoomsDTO } from "@services/messenger/messenger.dto";
import { color } from "@/colors";

interface Props {
  isMyProfileScreen?: boolean;
}

const MyFriends: React.FC<Props> = ({ isMyProfileScreen = true }) => {
  const dispatch = useDispatch();
  const { navigate } =
    useNavigation<NativeStackNavigationProp<StackParamList>>();

  const { isLoading, fetchAllMyFriends } = useFriendData();
  const { getUserByID } = useUserData();

  const { friends } = useSelector((state: RootState) => state.myFriends);
  const { userData } = useSelector((state: RootState) => state.myProfile);

  const [searchQuery, setSearchQuery] = React.useState("");

  const socket = useSocketContext();

  React.useEffect(() => {
    fetchAllMyFriends();
  }, []);

  const filteredFriends = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return friends;
    }
    const q = searchQuery.toLowerCase();
    return friends.filter(
      (f) =>
        f.username.toLowerCase().includes(q) ||
        f.first_name.toLowerCase().includes(q) ||
        f.last_name.toLowerCase().includes(q)
    );
  }, [searchQuery, friends]);

  const handleGoChat = (userId: string) => {
    socket?.emit("joinRoom", { user2Id: userId });
    socket?.once("joinRoomSuccess", async (data: { room: ChatRoomsDTO }) => {
      if (data && data.room) {
        const otherUserId = data.room.user_ids.find(
          (id) => id !== userData.user.id
        );
        if (!otherUserId) return;
        const userInfo = await getUserByID(otherUserId);
        const newChat = {
          ...data.room,
          name: data.room.name ?? null,
          otherUser: userInfo?.user!,
          otherUserAccount: userInfo?.account!,
          otherUserPrivacySettings: userInfo?.privacy_settings!,
        };

        dispatch(addChat({ ...newChat, unreadCount: 0 }));
        navigate("Chat", {
          chat: { ...newChat, unreadCount: 0 },
        });
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      {isMyProfileScreen && <Text style={styles.headerText}>My Friends</Text>}

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={color.grayDark1} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search friends..."
          placeholderTextColor={color.emptyText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* No results message */}
      {filteredFriends.length === 0 && !isLoading && (
        <Text style={styles.noFriendsText}>No friends found</Text>
      )}

      {/* Friends list */}
      <FlatList
        data={filteredFriends}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <Pressable
            style={styles.friendItem}
            onPress={() => {
              navigate("OtherUserProfile", { username: item.username });
            }}
          >
            <View style={styles.profileContainer}>
              <Image
                source={
                  item.profile_picture
                    ? { uri: item.profile_picture }
                    : require("@assets/images/no-profile-photo.png")
                }
                style={styles.avatar}
              />
              <View style={styles.textContainer}>
                <Text style={styles.name}>
                  {item.first_name} {item.last_name}
                </Text>
                <Text style={styles.username}>@{item.username}</Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Pressable
                style={styles.statusIndicator}
                onPress={() => handleGoChat(item.friend_id)}
              >
                <Text style={styles.statusText}>G</Text>
              </Pressable>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

export default MyFriends;
