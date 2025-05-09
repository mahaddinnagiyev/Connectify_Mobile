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
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { useMessengerData } from "@hooks/useMessengerData";

// Functions
import { truncate } from "@functions/messages.function";
import { formatTime } from "@functions/chat.functions";

// Services
import { MessageType } from "@services/messenger/messenger.dto";

const UserChats = () => {
  const { navigate } =
    useNavigation<NativeStackNavigationProp<StackParamList>>();
  const { filteredChats } = useSelector((state: RootState) => state.messenger);
  const { fetchChats, isChatsLoading } = useMessengerData();

  const [refrehing, setRefreshing] = React.useState<boolean>(false);
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
        <>
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
                        <Text numberOfLines={1}>{message}</Text>
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
