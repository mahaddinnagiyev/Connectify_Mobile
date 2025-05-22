import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  FlatList,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { color } from "@/colors";
import { styles } from "./styles/forward.style";
import { MaterialIcons, Feather } from "@expo/vector-icons";

// Services
import { Chat } from "@services/messenger/messenger.dto";

// Redux
import { RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useSocketContext } from "@context/SocketContext";
import { clearSelectedMessages } from "@redux/chat/chatSlice";
import { setErrorMessage } from "@redux/messages/messageSlice";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const ForwardModal: React.FC<Props> = ({ visible, onClose }) => {
  const dispatch = useDispatch();

  const socket = useSocketContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChats, setSelectedChats] = useState<Chat[]>([]);

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const contentScale = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const chats = useSelector((state: RootState) => state.messenger.chats);
  const { selectedMessages } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(contentScale, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      overlayOpacity.setValue(0);
      fadeAnim.setValue(0);
      contentScale.setValue(0.9);
      setSearchQuery("");
      setSelectedChats([]);
    }
  }, [visible]);

  const handleForwardMesages = async () => {
    try {
      if (selectedChats.length === 0 || selectedMessages.length === 0) return;

      selectedChats.forEach((chat) => {
        selectedMessages.forEach((message) => {
          socket?.emit("sendMessage", {
            roomId: chat.id,
            content: message.content,
            message_type: message.message_type,
            parent_message_id: message.parent_message_id ?? null,
          });
        });
      });
    } catch (error) {
      dispatch(setErrorMessage("Failed to forward message"));
    } finally {
      dispatch(clearSelectedMessages());
      onClose();
    }
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(contentScale, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) onClose();
    });
  };

  const toggleSelect = (chat: Chat) => {
    const exists = selectedChats.find((c) => c.id === chat.id);
    if (exists) {
      setSelectedChats(selectedChats.filter((c) => c.id !== chat.id));
    } else {
      setSelectedChats([...selectedChats, chat]);
    }
  };

  const filteredChats = chats.filter((c: Chat) => {
    const fullName =
      `${c.otherUser.first_name} ${c.otherUser.last_name}`.toLowerCase();
    const username = c.otherUser.username.toLowerCase();
    const roomName = c.name;
    const q = searchQuery.toLowerCase();
    return (
      fullName.includes(q) || username.includes(q) || roomName?.includes(q)
    );
  });

  const renderSelected = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.selectedContainer}
    >
      {selectedChats.map((chat) => (
        <Pressable
          key={chat.id}
          style={styles.selectedItem}
          onPress={() => toggleSelect(chat)}
        >
          <Image
            source={
              chat.otherUserAccount.profile_picture
                ? { uri: chat.otherUserAccount.profile_picture }
                : require("@assets/images/no-profile-photo.png")
            }
            style={styles.selectedAvatar}
          />
          <View style={styles.removeButton}>
            <MaterialIcons name="close" size={16} color={color.white} />
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );

  const renderItem = ({ item }: { item: Chat }) => {
    const isSelected = !!selectedChats.find((c) => c.id === item.id);
    return (
      <Pressable
        style={({ pressed }) => [
          styles.userContainer,
          pressed && styles.pressedUser,
          isSelected && styles.selectedHighlight,
        ]}
        onPress={() => toggleSelect(item)}
      >
        <Image
          source={
            item.otherUserAccount.profile_picture
              ? { uri: item.otherUserAccount.profile_picture }
              : require("@assets/images/no-profile-photo.png")
          }
          style={styles.userAvatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>
            {item.otherUser.first_name} {item.otherUser.last_name}
          </Text>
          <Text style={styles.userUsername} numberOfLines={1}>
            @{item.otherUser.username}
          </Text>
        </View>
        <Feather
          name={isSelected ? "check-circle" : "arrow-up-circle"}
          size={24}
          color={isSelected ? color.primary : color.gray}
        />
      </Pressable>
    );
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ scale: contentScale }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              Forward {selectedMessages.length} Message
              {selectedMessages.length > 1 && "s"}
            </Text>
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={28} color={color.textPrimary} />
            </Pressable>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color={color.textSecondary} />
            <TextInput
              placeholder="Search contacts..."
              placeholderTextColor={color.textSecondary}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Selected Chats */}
          {selectedChats.length > 0 && renderSelected()}

          {/* Users List */}
          <FlatList
            data={filteredChats}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />

          {/* Forward Button */}
          {selectedChats.length > 0 && (
            <Pressable
              style={styles.forwardAction}
              onPress={handleForwardMesages}
            >
              <Text style={styles.forwardText}>
                Forward to {selectedChats.length} Chat
                {selectedChats.length > 1 ? "s" : ""}
              </Text>
            </Pressable>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default ForwardModal;
