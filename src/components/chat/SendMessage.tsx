import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Animated,
  ScrollView,
} from "react-native";
import { styles } from "./styles/sendMessage.style";
import { color } from "@/colors";

// Expo
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";

// Redux
import { RootState } from "@redux/store";
import { setInputHeight } from "@redux/chat/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { setErrorMessage } from "@redux/messages/messageSlice";

// Navigation
import { RouteProp, useRoute } from "@react-navigation/native";
import { StackParamList } from "@navigation/UserStack";

// Services
import { MessagesDTO, MessageType } from "@services/messenger/messenger.dto";

// Functions
import { isUrl } from "@functions/messages.function";

// Context
import { useSocketContext } from "@context/SocketContext";

interface Props {
  setReplyMessage: (message: MessagesDTO | null) => void;
  replyMessage: MessagesDTO | null;
  scrollViewRef: React.RefObject<ScrollView>;
}

const SendMessage: React.FC<Props> = ({
  replyMessage,
  setReplyMessage,
  scrollViewRef,
}) => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state: RootState) => state.myProfile);
  const { inputHeight } = useSelector((state: RootState) => state.chat);
  const { blockList = [], blockerList = [] } = useSelector(
    (state: RootState) => state.myFriends
  );
  const socket = useSocketContext();

  const animation = useRef(new Animated.Value(0)).current;

  const soundRef = React.useRef<Audio.Sound | null>(null);

  const route = useRoute<RouteProp<StackParamList, "Chat">>();
  const { chat } = route.params;

  const [isBlocked, setIsBlocked] = React.useState(false);
  const [isBlockedBy, setIsBlockedBy] = React.useState(false);

  const [input, setInput] = React.useState("");

  useEffect(() => {
    if (replyMessage) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [replyMessage]);

  useEffect(() => {
    if (blockList.find((b) => b.blocked_id === chat.otherUser.id)) {
      setIsBlocked(true);
    }
    if (blockerList.find((b) => b.blocked_id === userData.user.id)) {
      setIsBlockedBy(true);
    }
  }, [blockList, blockerList, chat.otherUser.id, userData.user.id]);

  useEffect(() => {
    Audio.Sound.createAsync(
      require("@assets/sounds/message-sent-audio.mp3")
    ).then(({ sound }) => {
      soundRef.current = sound;
    });
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const renderReplyContent = () => {
    if (!replyMessage) return null;

    switch (replyMessage.message_type) {
      case MessageType.AUDIO:
        return (
          <View style={styles.replyMessageType}>
            <MaterialIcons
              name="audiotrack"
              size={14}
              color={color.boldColor}
            />
            <Text style={styles.replyText}>Audio</Text>
          </View>
        );
      case MessageType.IMAGE:
        return (
          <View style={styles.replyMessageType}>
            <Ionicons name="image" size={14} color={color.boldColor} />
            <Text style={styles.replyText}>Image</Text>
          </View>
        );
      case MessageType.VIDEO:
        return (
          <View style={styles.replyMessageType}>
            <MaterialIcons
              name="video-collection"
              size={14}
              color={color.boldColor}
            />
            <Text style={styles.replyText}>Video</Text>
          </View>
        );
      case MessageType.FILE:
        return (
          <View style={styles.replyMessageType}>
            <MaterialIcons
              name="upload-file"
              size={14}
              color={color.boldColor}
            />
            <Text style={styles.replyText}>File</Text>
          </View>
        );
      default:
        if (isUrl(replyMessage.content)) {
          return (
            <Text style={[styles.replyText, styles.urlText]} numberOfLines={3}>
              {replyMessage.content}
            </Text>
          );
        }
        return (
          <Text style={styles.replyText} numberOfLines={3}>
            {replyMessage.content}
          </Text>
        );
    }
  };

  // Send Message
  const handleSendMessage = () => {
    try {
      if (!input.trim()) return;

      socket?.emit("sendMessage", {
        roomId: chat.id,
        content: input,
        message_type: MessageType.TEXT,
        parent_message_id: replyMessage?.id,
      });

      setReplyMessage(null);
      setInput("");
      dispatch(setInputHeight(0));

      soundRef.current?.replayAsync();
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      dispatch(setErrorMessage("Failed to send message"));
    } finally {
      setInput("");
      dispatch(setInputHeight(0));
    }
  };

  return (
    <React.Fragment>
      {isBlocked && (
        <View style={[styles.container, { height: 60 }]}>
          <Text style={styles.blockedText}>
            You have blocked {chat.otherUser.first_name}{" "}
            {chat.otherUser.last_name}
          </Text>
        </View>
      )}

      {isBlockedBy && (
        <View style={[styles.container, { height: 60 }]}>
          <Text style={styles.blockedText}>
            {chat.otherUser.first_name} {chat.otherUser.last_name} has blocked
            you
          </Text>
        </View>
      )}

      {!isBlocked && !isBlockedBy && (
        <View
          style={[
            styles.mainContainer,
            { borderTopWidth: replyMessage ? 0 : 1 },
          ]}
        >
          {replyMessage && (
            <Animated.View
              style={[
                styles.replyPreviewContainer,
                {
                  opacity: animation,
                  transform: [
                    {
                      translateY: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [60, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.replyPreview}>
                <View style={styles.replyPreviewLine} />
                <View style={styles.replyContent}>
                  <Text style={styles.replySender}>
                    {replyMessage.sender_id === userData.user.id
                      ? "You"
                      : `@${chat.otherUser.username}`}
                  </Text>
                  {renderReplyContent()}
                </View>
                <Pressable
                  onPress={() => setReplyMessage(null)}
                  style={styles.closeButton}
                >
                  <MaterialIcons name="close" size={20} color="gray" />
                </Pressable>
              </View>
            </Animated.View>
          )}

          <View style={styles.container}>
            <View style={styles.leftButton}>
              <MaterialIcons name="attach-file" size={29} color="black" />
            </View>

            <View
              style={[
                styles.messageInput,
                {
                  height: Math.min(inputHeight, 100),
                  borderWidth: inputHeight > 40 ? 1 : 0,
                  borderColor: color.borderColor,
                  borderRadius: 5,
                },
              ]}
            >
              <TextInput
                placeholder="Type a message"
                multiline
                scrollEnabled={false}
                onContentSizeChange={(e) => {
                  dispatch(setInputHeight(e.nativeEvent.contentSize.height));
                }}
                value={input}
                onChangeText={(text) => setInput(text)}
                style={styles.textInput}
              />
            </View>

            <View style={styles.sendButton}>
              {input.trim() !== "" ? (
                <Pressable onPress={handleSendMessage}>
                  <MaterialIcons name="send" size={24} color="white" />
                </Pressable>
              ) : (
                <Pressable>
                  <FontAwesome5 name="microphone" size={24} color="white" />
                </Pressable>
              )}
            </View>
          </View>
        </View>
      )}
    </React.Fragment>
  );
};

export default SendMessage;
