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
import { styles } from "./styles/myFriends.style";
import { Ionicons } from "@expo/vector-icons";
import { color } from "@/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { StackParamList } from "@navigation/Navigator";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { useFriendData } from "@hooks/useFriendData";

interface Friend {
  first_name: string;
  last_name: string;
  username: string;
  profile_picture?: string;
}

const MyFriendsScreen = () => {
  const navigate = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const { friends } = useSelector((state: RootState) => state.myFriends);
  const { fetchAllMyFriends } = useFriendData();

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

  // Group friends by first-letter, with sorting and filtering
  const sections = useMemo(() => {
    // 1. Sort by full name
    const sorted = [...friends].sort((a, b) => {
      const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
      const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });

    // 2. Filter by search query
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
        <Pressable
          style={styles.headerButton}
          onPress={() => navigate.goBack()}
        >
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
          color="#888"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#888"
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
            onPress={() => navigate.navigate("Chat")}
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
                {truncateUsername(
                  `${item.first_name} ${item.last_name} | @${item.username}`
                )}
              </Text>
              <View style={styles.lastMessage}>
                <Text>Whats's Up Man</Text>
                <Text style={{ fontSize: 9 }}>12:00</Text>
              </View>
            </View>
            <View>
              <Text style={styles.unreadCount}>2</Text>
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
