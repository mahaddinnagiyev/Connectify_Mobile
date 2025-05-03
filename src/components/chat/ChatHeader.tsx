import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { styles } from "./styles/chatHeader.style";
import { MaterialIcons } from "@expo/vector-icons";

// Navigation
import type { StackParamList } from "@navigation/UserStack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

// Context
import { useSocketContext } from "@context/SocketContext";

// Functions
import { truncate } from "@functions/messages.function";

const ChatHeader = () => {
  // Functions
  const { navigate, goBack } =
    useNavigation<NativeStackNavigationProp<StackParamList>>();
  const route = useRoute<RouteProp<StackParamList, "Chat">>();
  const { chat } = route.params;

  const socket = useSocketContext();

  const handleBack = () => {
    socket?.emit("leaveRoom", { roomId: chat.id });
    goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftHeader}>
        {/* Back Icon */}
        <View>
          <Pressable onPress={handleBack}>
            <MaterialIcons name="arrow-back-ios" size={18} color="black" />
          </Pressable>
        </View>

        {/* User Details */}
        <Pressable
          style={styles.userDetail}
          onPress={() => navigate("ChatDetail")}
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
              {chat.name
                ? truncate(chat.name, 30)
                : truncate(
                    `${chat.otherUser.first_name} ${chat.otherUser.last_name} | @${chat.otherUser.username}`,
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
  );
};

export default ChatHeader;
