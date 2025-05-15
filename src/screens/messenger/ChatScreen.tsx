import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Components
import ChatHeader from "@components/chat/ChatHeader";
import Messages from "@components/chat/Messages";
import SendMessage from "@components/chat/SendMessage";

// Services
import { MessagesDTO } from "@services/messenger/messenger.dto";

// Context
import { useSocketContext } from "@context/SocketContext";

// Navigation
import { RouteProp, useRoute } from "@react-navigation/native";
import { StackParamList } from "@navigation/UserStack";

// Redux
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";

const ChatScreen = () => {
  const route = useRoute<RouteProp<StackParamList, "Chat">>();
  const { chat } = route.params;

  const selectedChat = useSelector((state: RootState) =>
    state.messenger.filteredChats.find((c) => c.id === chat.id)
  )!;

  const [replyMessage, setReplyMessage] = useState<MessagesDTO | null>(null);

  const socket = useSocketContext();

  useEffect(() => {
    socket?.emit("joinRoom", { user2Id: selectedChat.otherUser.id });
  }, [socket]);

  return (
    <SafeAreaView style={styles.container}>
      <ChatHeader />
      <Messages
        setReplyMessage={setReplyMessage}
      />
      <SendMessage
        setReplyMessage={setReplyMessage}
        replyMessage={replyMessage}
      />
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
