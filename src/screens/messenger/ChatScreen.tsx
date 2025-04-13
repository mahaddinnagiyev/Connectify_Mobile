import { View, Text, StyleSheet } from "react-native";
import React from "react";
import ChatHeader from "@/src/components/chat/ChatHeader";
import SendMessage from "@/src/components/chat/SendMessage";

const ChatScreen = () => {
  return (
    <View style={styles.container}>
      <ChatHeader />
      <SendMessage />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  text: {
    fontSize: 20,
    color: "black",
  },
});
