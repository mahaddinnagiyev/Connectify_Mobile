import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatHeader from "@components/chat/ChatHeader";
import Messages from "@components/chat/Messages";
import SendMessage from "@components/chat/SendMessage";

const ChatScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ChatHeader />
      <Messages />
      <SendMessage />
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
