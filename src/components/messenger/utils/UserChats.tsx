import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { StackParamList } from "@navigation/UserStack";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { useMessengerData } from "@hooks/useMessengerData";
import { styles } from "../styles/userChats.style";
import { color } from "@/colors";

const truncate = (text: string = "", maxLength: number): string => {
  return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
};

const formatTime = (input?: string | Date): string => {
  if (!input) return "";
  const date = typeof input === "string" ? new Date(input) : input;
  let h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
};

const UserChats = () => {
  const navigate = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const { filteredChats } = useSelector((state: RootState) => state.messenger);
  const { fetchChats } = useMessengerData();

  const [refrehing, setRefreshing] = React.useState<boolean>(false);
  const [isChatsLoading, setIsChatsLoading] = React.useState<boolean>(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setIsChatsLoading(true);
    try {
      fetchChats();
    } finally {
      setRefreshing(false);
      setIsChatsLoading(false);
    }
  };

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
      {isChatsLoading ? (
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
        <>
          {filteredChats.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.noChatsText}>No chats found.</Text>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={refreshControl}
            >
              {filteredChats.map((chat) => {
                const name = chat.name
                  ? truncate(chat.name, 25)
                  : truncate(
                      `${chat.otherUser.first_name} ${chat.otherUser.last_name} | @${chat.otherUser.username}`,
                      25
                    );

                const message = truncate(chat.lastMessage?.content, 30);

                const time = formatTime(chat.lastMessage?.created_at);

                return (
                  <TouchableOpacity
                    key={chat.id}
                    style={styles.chat}
                    onPress={() =>
                      navigate.navigate("Chat", {
                        chat: chat,
                      })
                    }
                  >
                    <Image
                      source={
                        chat.otherUserAccount.profile_picture
                          ? { uri: chat.otherUserAccount.profile_picture }
                          : require("@assets/images/no-profile-photo.png")
                      }
                      style={styles.profilePhoto}
                    />

                    <View style={styles.chatDetail}>
                      <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                        {name}
                      </Text>

                      <View style={styles.lastMessage}>
                        <Text>{message}</Text>
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
        </>
      )}
    </View>
  );
};

export default UserChats;
