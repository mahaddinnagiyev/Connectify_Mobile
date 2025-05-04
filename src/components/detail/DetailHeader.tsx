import { Text, View, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { styles } from "./styles/detailHeader.style";
import { Ionicons } from "@expo/vector-icons";

// Services
import { Chat } from "@services/messenger/messenger.dto";
import { PrivacySettingsChoice } from "@services/account/dto/privacy.dto";

// Navigation
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { StackParamList } from "@navigation/UserStack";

// Redux
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";

// Components
import ProfilePhotoModal from "../modals/profile/ProfilePhotoModal";

interface Props {
  chat: Chat;
}

const DetailHeader: React.FC<Props> = ({ chat }) => {
  const { goBack } = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const { friends = [] } = useSelector((state: RootState) => state.myFriends);

  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [isFriend, setIsFriend] = useState<boolean>(false);

  useEffect(() => {
    const isFriend = friends.some(
      (friend) => friend.friend_id === chat.otherUser.id
    );
    setIsFriend(isFriend);
  }, [friends]);

  const renderBio = () => {
    switch (chat.otherUserPrivacySettings.bio) {
      case PrivacySettingsChoice.everyone:
        return chat.otherUserAccount.bio ?? "No bio yet";
      case PrivacySettingsChoice.my_friends:
        if (isFriend) return chat.otherUserAccount.bio ?? "No bio yet";
        return "";
      case PrivacySettingsChoice.nobody:
        return "";
    }
  };

  return (
    <>
      {/* Header */}
      <Pressable style={styles.topHeader} onPress={goBack}>
        <View style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#00ff00" />
        </View>
        <Text style={styles.roomName} numberOfLines={1}>
          {chat.name ?? "No Room Name"}
        </Text>
      </Pressable>

      {/* User Profile */}
      <View style={styles.profileSection}>
        <Pressable onPress={() => setShowImageModal(true)}>
          <Image
            source={
              chat.otherUserAccount.profile_picture
                ? { uri: chat.otherUserAccount.profile_picture }
                : require("@assets/images/no-profile-photo.png")
            }
            style={styles.profileImage}
          />
        </Pressable>
        <Text style={styles.fullName}>
          {chat.otherUser.first_name} {chat.otherUser.last_name}
        </Text>
        <Text style={styles.username}>@{chat.otherUser.username}</Text>
        <Text
          style={[
            styles.bio,
            { fontStyle: chat.otherUserAccount.bio ? "normal" : "italic" },
          ]}
        >
          {renderBio()}
        </Text>
      </View>

      {showImageModal && (
        <ProfilePhotoModal
          visible={showImageModal}
          onClose={() => setShowImageModal(false)}
          imageSource={
            chat.otherUserAccount.profile_picture
              ? { uri: chat.otherUserAccount.profile_picture }
              : require("@assets/images/no-profile-photo.png")
          }
        />
      )}
    </>
  );
};

export default DetailHeader;
