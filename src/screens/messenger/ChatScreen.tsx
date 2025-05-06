import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Components
import ChatHeader from "@components/chat/ChatHeader";
import Messages from "@components/chat/Messages";
import SendMessage from "@components/chat/SendMessage";

// Services
import { MessagesDTO } from "@services/messenger/messenger.dto";

const ChatScreen = () => {
  const [replyMessage, setReplyMessage] = useState<MessagesDTO | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <SafeAreaView style={styles.container}>
      <ChatHeader />
      <Messages
        setReplyMessage={setReplyMessage}
        scrollViewRef={scrollViewRef}
      />
      <SendMessage
        setReplyMessage={setReplyMessage}
        replyMessage={replyMessage}
        scrollViewRef={scrollViewRef}
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
