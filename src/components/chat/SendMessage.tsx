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

// Components
import SendMediaModal from "../modals/chat/SendMediaModal";

// Expo
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

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

// Hooks
import { useChatData } from "@hooks/useChatData";

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
  const socket = useSocketContext();

  const { handleUploadAudio, isMediasLoading } = useChatData();

  const { userData } = useSelector((state: RootState) => state.myProfile);
  const { inputHeight } = useSelector((state: RootState) => state.chat);
  const { blockList = [], blockerList = [] } = useSelector(
    (state: RootState) => state.myFriends
  );

  const animation = useRef(new Animated.Value(0)).current;
  const soundRef = React.useRef<Audio.Sound | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const route = useRoute<RouteProp<StackParamList, "Chat">>();
  const { chat } = route.params;

  const [recordingDuration, setRecordingDuration] = React.useState<number>(0);
  const [isBlocked, setIsBlocked] = React.useState<boolean>(false);
  const [isBlockedBy, setIsBlockedBy] = React.useState<boolean>(false);
  const [isRecording, setIsRecording] = React.useState<boolean>(false);
  const [showMediaModal, setShowMediaModal] = React.useState<boolean>(false);

  const [input, setInput] = React.useState<string>("");

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

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordingDuration(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [isRecording, scaleAnim]);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
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

  // Send Audio Message
  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();

      if (status !== "granted") {
        dispatch(setErrorMessage("Permission to access audio is required"));
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();

      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      await recording.startAsync();
      recordingRef.current = recording;
      setIsRecording(true);
    } catch (error) {
      dispatch(
        setErrorMessage((error as Error).message ?? "Failed to send message")
      );
    }
  };

  const stopRecording = async () => {
    try {
      const recording = recordingRef.current;
      if (!isRecording) return;

      setIsRecording(false);

      await recording?.stopAndUnloadAsync();
      const uri = recording?.getURI();
      if (!uri) return;

      const fileInfo = await FileSystem.getInfoAsync(uri);
      const { size } = fileInfo as { size: number };

      const name = uri.split("/").pop()!;

      const formData = new FormData();
      formData.append("message_audio", {
        uri,
        name,
        type: "audio/webm",
      } as any);

      const response = await handleUploadAudio(
        formData,
        chat.id,
        userData.user.id
      );

      if (!response?.success) return;

      socket?.emit("sendMessage", {
        roomId: chat.id,
        content: response.publicUrl,
        message_type: MessageType.AUDIO,
        message_name: name,
        message_size: size,
        parent_message_id: replyMessage?.id,
      });

      setReplyMessage(null);
      soundRef.current?.replayAsync();
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      dispatch(
        setErrorMessage((error as Error).message ?? "Failed to stop recording")
      );
    }
  };

  const cancelRecording = async () => {
    try {
      if (!isRecording || !recordingRef.current) return;
      await recordingRef.current.stopAndUnloadAsync();
    } catch (error) {
      dispatch(
        setErrorMessage(
          (error as Error).message ?? "Failed to cancel recording"
        )
      );
    } finally {
      setIsRecording(false);
      recordingRef.current = null;
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
            {isRecording ? (
              <React.Fragment>
                <Pressable
                  style={({ pressed }) => [
                    styles.leftButton,
                    { opacity: pressed ? 0.5 : 1 },
                  ]}
                  onPress={cancelRecording}
                >
                  <MaterialIcons name="delete-forever" size={29} color="red" />
                </Pressable>

                <View style={styles.recordingContainer}>
                  <Animated.View
                    style={[
                      styles.recordingIndicator,
                      { transform: [{ scale: scaleAnim }] },
                    ]}
                  >
                    <FontAwesome5 name="microphone" size={20} color={"red"} />
                  </Animated.View>
                  <Text style={styles.recordingTimer}>
                    {formatTime(recordingDuration)}
                  </Text>
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.sendButton,
                    {
                      backgroundColor: pressed
                        ? color.darkColor
                        : color.primaryColor,
                    },
                  ]}
                  onPress={stopRecording}
                >
                  <MaterialIcons name="send" size={24} color="white" />
                </Pressable>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Pressable
                  style={({ pressed }) => [
                    styles.leftButton,
                    {
                      backgroundColor: pressed ? "gray" : "transparent",
                      borderRadius: 15,
                      padding: 5,
                    },
                  ]}
                  onPress={() => setShowMediaModal(true)}
                >
                  <MaterialIcons name="attach-file" size={29} color="black" />
                </Pressable>

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
                      dispatch(
                        setInputHeight(e.nativeEvent.contentSize.height)
                      );
                    }}
                    value={input}
                    onChangeText={(text) => setInput(text)}
                    style={styles.textInput}
                  />
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.sendButton,
                    {
                      backgroundColor: pressed
                        ? color.darkColor
                        : color.primaryColor,
                    },
                  ]}
                  onPress={
                    input.trim() !== "" ? handleSendMessage : startRecording
                  }
                >
                  {input.trim() !== "" ? (
                    <MaterialIcons name="send" size={24} color="white" />
                  ) : (
                    <FontAwesome5 name="microphone" size={24} color="white" />
                  )}
                </Pressable>
              </React.Fragment>
            )}
          </View>
        </View>
      )}

      {showMediaModal && (
        <SendMediaModal
          visible={showMediaModal}
          onClose={() => setShowMediaModal(false)}
        />
      )}
    </React.Fragment>
  );
};

export default SendMessage;
