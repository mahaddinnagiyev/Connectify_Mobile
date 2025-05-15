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
import SelectedModal, { FileData } from "../modals/chat/SelectedModal";

// Expo
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

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
import { UIImagePickerControllerQualityType } from "expo-image-picker";

interface Props {
  setReplyMessage: (message: MessagesDTO | null) => void;
  replyMessage: MessagesDTO | null;
}

const SendMessage: React.FC<Props> = ({ replyMessage, setReplyMessage }) => {
  const dispatch = useDispatch();
  const socket = useSocketContext();

  const {
    handleUploadAudio,
    isUploadingAudio,
    handleUploadImage,
    isImageUploading,
    handleUploadVideo,
    isVideoUploading,
    handleFileUpload,
    isFileUploading,
  } = useChatData();

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
  const [showMediaModal, setShowMediaModal] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<FileData | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState<
    number | undefined
  >();

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

  // Send Media
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      dispatch(setErrorMessage("Permission to access photos is required"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    const uri = asset.uri;
    const info = (await FileSystem.getInfoAsync(uri)) as FileSystem.FileInfo & {
      size: number;
    };
    const name = uri.split("/").pop()!;
    const match = /\.(\w+)$/.exec(name ?? "");
    const mimeType = match ? `image/${match[1]}` : `image`;

    if (info.size > 50 * 1024 * 1024)
      return dispatch(setErrorMessage("File size is too large"));

    setSelectedFile({
      uri,
      name,
      size: info.size ?? 0,
      type: "image",
      mimeType,
    });
    setShowMediaModal(false);
  };

  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      dispatch(
        setErrorMessage("Permission to access media library is required")
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.8,
      videoMaxDuration: 600,
      videoQuality: UIImagePickerControllerQualityType.High,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    const uri = asset.uri;
    const info = (await FileSystem.getInfoAsync(uri)) as FileSystem.FileInfo & {
      size: number;
    };
    const name = uri.split("/").pop()!;
    const match = /\.(\w+)$/.exec(name);
    const mimeType = match ? `video/${match[1]}` : "video";

    if (info.size > 50 * 1024 * 1024) {
      return dispatch(setErrorMessage("Video is too large (max 50 MB)"));
    }

    setSelectedFile({
      uri,
      name,
      size: info.size,
      type: "video",
      mimeType,
    });
    setShowMediaModal(false);
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;

      const { uri, name, size, mimeType } = result.assets![0];
      if (size && size > 50 * 1024 * 1024) {
        return dispatch(setErrorMessage("File is too large (max 50 MB)"));
      }

      setSelectedFile({
        uri,
        name,
        size: size ?? 0,
        type: "file",
        mimeType: mimeType ?? `application/${name.split(".").pop()}`,
      });
      setShowMediaModal(false);
    } catch (err) {
      dispatch(
        setErrorMessage((err as Error).message ?? "Failed to pick file")
      );
    }
  };

  const uploadAndSend = async () => {
    if (!selectedFile) return dispatch(setErrorMessage("No file selected"));

    const formData = new FormData();

    if (selectedFile.type === "image") {
      formData.append("message_image", {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: selectedFile.mimeType,
      } as any);
    } else if (selectedFile.type === "video") {
      formData.append("message_video", {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: selectedFile.mimeType,
      } as any);
    } else if (selectedFile.type === "file") {
      formData.append("message_file", {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: selectedFile.mimeType,
      } as any);
    } else {
      return dispatch(setErrorMessage("Unsupported file type"));
    }

    let response;

    if (selectedFile.type === "image") {
      response = await handleUploadImage(formData, chat.id, userData.user.id);
    } else if (selectedFile.type === "video") {
      response = await handleUploadVideo(formData, chat.id, userData.user.id);
    } else if (selectedFile.type === "file") {
      response = await handleFileUpload(formData, chat.id, userData.user.id);
    }

    if (!response?.success) return;

    socket?.emit("sendMessage", {
      roomId: chat.id,
      content: response.publicUrl,
      message_type:
        selectedFile.type === "image"
          ? MessageType.IMAGE
          : selectedFile.type === "video"
          ? MessageType.VIDEO
          : MessageType.FILE,
      message_name: selectedFile.name,
      message_size: selectedFile.size,
      parent_message_id: replyMessage?.id,
    });

    setReplyMessage(null);
    setSelectedFile(null);
  };

  return (
    <React.Fragment>
      {/* Blocked Situations */}
      {isBlocked && (
        <View style={styles.blockedContainer}>
          <Text style={styles.blockedText}>
            ⚠️ You've blocked {chat.otherUser.first_name}{" "}
            {chat.otherUser.last_name}
          </Text>
        </View>
      )}

      {isBlockedBy && (
        <View style={styles.blockedContainer}>
          <Text style={styles.blockedText}>
            ⚠️ {chat.otherUser.first_name} {chat.otherUser.last_name} has
            blocked you
          </Text>
        </View>
      )}

      {!isBlocked && !isBlockedBy && (
        <View style={styles.container}>
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
              <View style={styles.mediaTypeIcon}>
                <MaterialIcons name="reply" size={16} color={color.primary} />
              </View>
              <View style={styles.replyContent}>
                <Text style={styles.replySender}>
                  {replyMessage.sender_id === userData.user.id
                    ? "Your message"
                    : `@${chat.otherUser.username}`}
                </Text>
                {renderReplyContent()}
              </View>
              <Pressable
                onPress={() => setReplyMessage(null)}
                style={styles.closeButton}
              >
                <MaterialIcons
                  name="close"
                  size={18}
                  color={color.textSecondary}
                />
              </Pressable>
            </Animated.View>
          )}

          <View style={styles.inputContainer}>
            {isRecording ? (
              <View style={styles.recordingContainer}>
                <View style={styles.recordingIndicator}>
                  <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <FontAwesome5
                      name="microphone"
                      size={14}
                      color={color.white}
                    />
                  </Animated.View>
                </View>
                <Text style={styles.recordingTimer}>
                  {formatTime(recordingDuration)}
                </Text>
                <Pressable
                  style={styles.cancelRecordingButton}
                  onPress={cancelRecording}
                >
                  <MaterialIcons name="delete" size={24} color={color.danger} />
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.sendButton,
                    pressed && {
                      backgroundColor: color.primaryDark,
                      width: 30,
                      height: 30,
                    },
                  ]}
                  onPress={stopRecording}
                >
                  <Ionicons name="send" size={20} color={color.white} />
                </Pressable>
              </View>
            ) : (
              <React.Fragment>
                <Pressable
                  style={({ pressed }) => [
                    styles.attachmentButton,
                    pressed && { backgroundColor: color.border },
                  ]}
                  onPress={() => setShowMediaModal(true)}
                >
                  <MaterialIcons
                    name="attach-file"
                    size={24}
                    color={color.iconDark}
                  />
                </Pressable>

                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Type a message..."
                    placeholderTextColor={color.textSecondary}
                    multiline
                    scrollEnabled={false}
                    onContentSizeChange={(e) => {
                      dispatch(
                        setInputHeight(e.nativeEvent.contentSize.height)
                      );
                    }}
                    value={input}
                    onChangeText={setInput}
                  />
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.sendButton,
                    pressed && { backgroundColor: color.primaryDark },
                  ]}
                  onPress={input.trim() ? handleSendMessage : startRecording}
                >
                  {input.trim() ? (
                    <Ionicons name="send" size={24} color={color.white} />
                  ) : (
                    <FontAwesome5
                      name="microphone"
                      size={20}
                      color={color.white}
                    />
                  )}
                </Pressable>
              </React.Fragment>
            )}
          </View>
        </View>
      )}

      {/* Modallar */}
      <SendMediaModal
        visible={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        onPickImage={pickImage}
        onPickVideo={pickVideo}
        onPickFile={pickFile}
      />

      <SelectedModal
        visible={!!selectedFile}
        file={selectedFile}
        uploadProgress={uploadProgress}
        onCancel={() => setSelectedFile(null)}
        onUpload={uploadAndSend}
      />
    </React.Fragment>
  );
};

export default SendMessage;
