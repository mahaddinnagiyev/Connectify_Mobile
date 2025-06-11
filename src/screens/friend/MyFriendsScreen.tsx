import {
  View,
  Text,
  TextInput,
  SectionList,
  Pressable,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles/myFriends.style";
import { Ionicons } from "@expo/vector-icons";
import { color } from "@/colors";

// Navigation
import { useNavigation } from "@react-navigation/native";
import type { StackParamList } from "@navigation/UserStack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Redux
import { RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import { addChat } from "@redux/messenger/messengerSlice";

// Hooks
import { useFriendData } from "@hooks/useFriendData";
import { useUserData } from "@hooks/useUserData";

// Functions
import { truncate } from "@functions/messages.function";

// Services
import { ChatRoomsDTO } from "@services/messenger/messenger.dto";

// Context
import { useSocketContext } from "@context/SocketContext";

interface Friend {
  id: string;
  friend_id: string;
  first_name: string;
  last_name: string;
  username: string;
  profile_picture?: string;
}

const MyFriendsScreen = () => {
  const dispatch = useDispatch();
  const { navigate, goBack } =
    useNavigation<NativeStackNavigationProp<StackParamList>>();
  const { friends } = useSelector((state: RootState) => state.myFriends);
  const { userData } = useSelector((state: RootState) => state.myProfile);

  const { fetchAllMyFriends } = useFriendData();
  const { getUserByID } = useUserData();

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAllMyFriends().finally(() => setRefreshing(false));
  }, []);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const truncateUsername = (name: string) => {
    if (name.length > 25) {
      return name.slice(0, 25) + "...";
    }
    return name;
  };

  const sections = useMemo(() => {
    const sorted = [...friends].sort((a, b) => {
      const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
      const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });

    const filtered = searchQuery
      ? sorted.filter((friend) => {
          const fullName =
            `${friend.first_name} ${friend.last_name}`.toLowerCase();
          const username = friend.username.toLowerCase();
          const q = searchQuery.toLowerCase();
          return fullName.includes(q) || username.includes(q);
        })
      : sorted;

    return filtered.reduce<Array<{ title: string; data: Friend[] }>>(
      (acc, friend) => {
        const letter = friend.first_name.charAt(0).toUpperCase();
        const section = acc.find((s) => s.title === letter);
        if (section) {
          section.data.push(friend);
        } else {
          acc.push({ title: letter, data: [friend] });
        }
        return acc;
      },
      []
    );
  }, [friends, searchQuery]);

  const socket = useSocketContext();

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

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      colors={[color.primaryColor]}
      tintColor={color.primaryColor}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Friends Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Friend List</Text>
        <Pressable style={styles.headerButton} onPress={() => goBack()}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: color.primaryColor,
            }}
          >
            Back
          </Text>
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={color.emptyText}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor={color.emptyText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Friend List */}
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `${item.username}-${index}`}
        refreshControl={refreshControl}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chat}
            onPress={() => handleGoChat(item.friend_id)}
          >
            <Image
              source={
                item.profile_picture
                  ? { uri: item.profile_picture }
                  : require("@assets/images/no-profile-photo.png")
              }
              style={styles.profilePhoto}
            />
            <View style={styles.chatDetail}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {truncateUsername(`${item.first_name} ${item.last_name}`)}
              </Text>
              <Text>{truncate(`@${item.username}`, 20)}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.noFriendsText}>No Friends Found</Text>
        }
      />
    </SafeAreaView>
  );
};

export default MyFriendsScreen;
