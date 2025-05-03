import React, { useEffect, useRef } from "react";
import { View, Text, TextInput, Pressable, Animated } from "react-native";
import { styles } from "./styles/sendMessage.style";
import { color } from "@/colors";
import { useDispatch, useSelector } from "react-redux";
import { setInputHeight } from "@redux/chat/chatSlice";
import { RootState } from "@redux/store";
import { RouteProp, useRoute } from "@react-navigation/native";
import { StackParamList } from "@navigation/UserStack";
import { useChatData } from "@hooks/useChatData";
import { MessageType } from "@services/messenger/messenger.dto";
import { isUrl } from "@functions/messages.function";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const SendMessage = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state: RootState) => state.myProfile);
  const { inputHeight } = useSelector((state: RootState) => state.chat);
  const { blockList = [], blockerList = [] } = useSelector(
    (state: RootState) => state.myFriends
  );
  const { replyMessage } = useSelector((state: RootState) => state.chat);

  const { handleReplyMessage } = useChatData();
  const animation = useRef(new Animated.Value(0)).current;

  const route = useRoute<RouteProp<StackParamList, "Chat">>();
  const { chat } = route.params;

  const [isBlocked, setIsBlocked] = React.useState(false);
  const [isBlockedBy, setIsBlockedBy] = React.useState(false);

  useEffect(() => {
    if (replyMessage) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
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
        <View style={styles.mainContainer}>
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
                  onPress={() => handleReplyMessage(null)}
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
                style={styles.textInput}
              />
            </View>

            <View style={styles.sendButton}>
              <Pressable>
                <MaterialIcons name="send" size={24} color="white" />
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </React.Fragment>
  );
};

export default SendMessage;
