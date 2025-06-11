import React, { useCallback, useEffect, useState } from "react";
import { BackHandler, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Components
import ChatHeader from "@components/chat/ChatHeader";
import Messages from "@components/chat/Messages";
import SendMessage from "@components/chat/SendMessage";
import ForwardModal from "@components/modals/chat/ForwardModal";

// Services
import { MessagesDTO } from "@services/messenger/messenger.dto";

// Context
import { useSocketContext } from "@context/SocketContext";

// Navigation
import { RouteProp, useRoute, useFocusEffect } from "@react-navigation/native";
import { StackParamList } from "@navigation/UserStack";

// Redux
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { color } from "@/colors";

const ChatScreen = () => {
  const route = useRoute<RouteProp<StackParamList, "Chat">>();
  const { chat } = route.params;

  const selectedChat = useSelector((state: RootState) =>
    state.messenger.filteredChats.find((c) => c.id === chat.id)
  )!;

  const [showForwardModal, setShowForwardModal] = useState<boolean>(false);
  const [replyMessage, setReplyMessage] = useState<MessagesDTO | null>(null);

  const socket = useSocketContext();

  useEffect(() => {
    socket?.emit("joinRoom", { user2Id: selectedChat.otherUser.id });
  }, [socket]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        socket?.emit("leaveRoom", { roomId: selectedChat.id });
        return false;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [socket, selectedChat.id])
  );

  return (
    <React.Fragment>
      <SafeAreaView style={styles.container}>
        <ChatHeader
          setReplyMessage={setReplyMessage}
          setShowForwardModal={setShowForwardModal}
        />
        <Messages setReplyMessage={setReplyMessage} />
        <SendMessage
          setReplyMessage={setReplyMessage}
          replyMessage={replyMessage}
        />
      </SafeAreaView>

      <ForwardModal
        onClose={() => setShowForwardModal(false)}
        visible={showForwardModal}
      />
    </React.Fragment>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
});
