import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { color } from "@/colors";
import { styles } from "./styles/roomName.style";
import { MaterialIcons } from "@expo/vector-icons";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { setErrorMessage } from "@redux/messages/messageSlice";
import { changeRoomName as changeRoomNameAction } from "@redux/messenger/messengerSlice";
import { addMessage } from "@redux/chat/chatSlice";
import { RootState } from "@redux/store";

// Services
import { Chat, MessagesDTO } from "@services/messenger/messenger.dto";
import { addNewMessageToStorage } from "@functions/storage.function";

// Context
import { useSocketContext } from "@context/SocketContext";

interface RoomNameModalProps {
  visible: boolean;
  onClose: () => void;
  chat: Chat;
}

const RoomNameModal: React.FC<RoomNameModalProps> = ({
  visible,
  onClose,
  chat,
}) => {
  const dispatch = useDispatch();
  const selectedChat = useSelector((state: RootState) =>
    state.messenger.filteredChats.find((c) => c.id === chat.id)
  )!;

  const [roomName, setRoomName] = useState<string>(selectedChat.name ?? "");
  const [loading, setLoading] = useState<"" | "save" | "remove">("");

  const socket = useSocketContext();

  const scaleValue = useRef(new Animated.Value(0)).current;

  const inputBorderColor =
    roomName.length < 25
      ? color.primaryColor
      : roomName.length < 30
      ? "orange"
      : color.avatarBorder;

  useEffect(() => {
    Animated.timing(scaleValue, {
      toValue: visible ? 1 : 0,
      duration: visible ? 300 : 200,
      easing: visible ? Easing.out(Easing.cubic) : undefined,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("joinRoom", { user2Id: chat.otherUser.id });

    const onRoomNameChanged = (payload: {
      id: string;
      name: string | null;
    }) => {
      dispatch(
        changeRoomNameAction({
          id: payload.id,
          name: payload.name,
        })
      );
      onClose();
    };

    const onNewMessage = async (message: MessagesDTO) => {
      dispatch(addMessage(message));
      await addNewMessageToStorage(chat.id, message);
    };

    socket.on("roomNameChanged", onRoomNameChanged);
    socket.on("newMessage", onNewMessage);

    return () => {
      socket.off("roomNameChanged", onRoomNameChanged);
      socket.off("newMessage", onNewMessage);
    };
  }, [socket, dispatch, onClose]);

  const saveRoomName = () => {
    if (!roomName.trim() || roomName === selectedChat.name) return;
    setLoading("save");
    socket?.emit("changeRoomName", {
      roomId: selectedChat.id,
      name: roomName.trim(),
    });
  };

  const removeRoomName = () => {
    setLoading("remove");
    socket?.emit(
      "changeRoomName",
      { roomId: selectedChat.id, name: null },
      (response: { success: boolean; message?: string }) => {
        setLoading("");
        if (!response.success) {
          dispatch(setErrorMessage(response.message || "Error removing name"));
        }
      }
    );
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Animated.View
          style={[styles.modal, { transform: [{ scale: scaleValue }] }]}
        >
          {/* Header */}
          <View style={styles.header}>
            <MaterialIcons name="edit" size={24} color={color.primaryColor} />
            <Text style={styles.title}>Rename Room</Text>
          </View>

          {/* Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                { borderColor: inputBorderColor, borderWidth: 2 },
              ]}
              value={roomName}
              onChangeText={setRoomName}
              maxLength={30}
              autoFocus
              placeholder="Enter new room name"
              placeholderTextColor={color.mediumGray}
            />
            <View style={styles.charCounterContainer}>
              {roomName.length >= 25 && (
                <MaterialIcons
                  name="warning"
                  size={14}
                  color={roomName.length < 30 ? "orange" : color.avatarBorder}
                />
              )}
              <Text
                style={[
                  styles.charCounter,
                  {
                    color:
                      roomName.length < 25
                        ? color.grayDark1
                        : roomName.length < 30
                        ? "orange"
                        : color.avatarBorder,
                  },
                ]}
              >
                {30 - roomName.length} characters remaining
              </Text>
            </View>
          </View>

          {/* Remove Button */}
          {selectedChat.name && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={removeRoomName}
              disabled={!!loading}
            >
              {loading === "remove" ? (
                <>
                  <ActivityIndicator size="small" color={color.avatarBorder} />
                  <Text style={styles.removeButtonText}>Removing...</Text>
                </>
              ) : (
                <>
                  <MaterialIcons
                    name="delete-outline"
                    size={18}
                    color={color.avatarBorder}
                  />
                  <Text style={styles.removeButtonText}>Remove room name</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Actions */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={!!loading}
            >
              <Text style={styles.cancelButtonText}>Discard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.saveButton,
                {
                  backgroundColor:
                    !roomName.trim() || roomName === selectedChat.name
                      ? color.inputBorderColor
                      : color.primaryColor,
                  opacity:
                    !roomName.trim() || roomName === selectedChat.name
                      ? 0.7
                      : 1,
                },
              ]}
              onPress={saveRoomName}
              disabled={
                !roomName.trim() || roomName === selectedChat.name || !!loading
              }
            >
              {loading === "save" ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color={color.white}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.saveButtonText}>Saving...</Text>
                </>
              ) : (
                <>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                  <MaterialIcons
                    name="arrow-forward"
                    size={20}
                    color={color.white}
                    style={{ marginLeft: 8 }}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default RoomNameModal;
