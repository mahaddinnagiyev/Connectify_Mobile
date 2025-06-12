import {
  View,
  Text,
  Image,
  Pressable,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { styles } from "./styles/personal-info";
import { color } from "@/colors";

// Expo And Components
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { UserData } from "./ProfilePage";
import ConfirmModal from "../modals/confirm/ConfirmModal";
import ChangePhotoModal from "../modals/profile/ChangePhotoModal";
import ProfilePhotoModal from "../modals/profile/ProfilePhotoModal";
import PrivacyLegendModal from "../modals/profile/PrivacyLegendModal";
import EditProfileInfoModal from "../modals/profile/EditProfileInfoModal";

// Context
import { useSocketContext } from "@context/SocketContext";

// Services
import { BlockAction } from "@services/friends/blockList.dto";
import { ChatRoomsDTO } from "@services/messenger/messenger.dto";
import { PrivacySettingsChoice } from "@services/account/dto/privacy.dto";

// Redux
import { RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import { addChat } from "@redux/messenger/messengerSlice";

// Navigation
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "@navigation/UserStack";

// Hooks
import { useUserData } from "@hooks/useUserData";
import { useFriendData } from "@hooks/useFriendData";

// Enums
import { FriendshipAction } from "@enums/friendship.enum";

interface PersonalInfoProps {
  isMyProfileScreen: boolean;
  isLoading: boolean;
  userData: UserData;
  shouldBlur: (privacy?: PrivacySettingsChoice) => boolean;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  isMyProfileScreen,
  isLoading,
  userData,
  shouldBlur,
}) => {
  // Animations
  const fadeAnim = React.useRef(new Animated.Value(0.5)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const SkeletonLoader = ({ style }: { style: any }) => (
    <Animated.View
      style={[
        {
          backgroundColor: color.divider,
          borderRadius: 4,
        },
        style,
        { opacity: fadeAnim },
      ]}
    />
  );

  // States And Functions
  const dispatch = useDispatch();
  const { navigate } =
    useNavigation<NativeStackNavigationProp<StackParamList>>();

  const { getUserByID } = useUserData();

  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [showImageModal, setShowImageModal] = React.useState<boolean>(false);
  const [showEditModal, setShowEditModal] = React.useState<boolean>(false);
  const [showPrivacyModal, setShowPrivacyModal] =
    React.useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] =
    React.useState<boolean>(false);
  const [isCreatingRoom, setIsCreatingRoom] = React.useState<boolean>(false);

  const socket = useSocketContext();

  const {
    friends,
    sentFriendshipRequests,
    receivedFriendshipRequests,
    blockList,
  } = useSelector((state: RootState) => state.myFriends);

  const {
    blockAndUnblockUser,
    isRemovingOrAdding: isFriendDataLoading,
    sentFriendshipRequest,
    removeFriend,
    acceptAndRejectFrienship,
    isAccepting,
    isRejecting,
    isBlocking,
  } = useFriendData();

  const handleBlockAndUnblockUser = async () => {
    await blockAndUnblockUser(
      userData.user.id,
      blockList.find((block) => block.blocked_id === userData.user.id)
        ? BlockAction.unblock
        : BlockAction.block
    );
    setShowConfirmModal(false);
  };

  const setFriendButton = () => {
    if (friends.find((friend) => friend.friend_id === userData.user.id)) {
      return (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "red" }]}
          onPress={async () =>
            await removeFriend(
              friends.find((friend) => friend.friend_id === userData.user.id)!
                .id
            )
          }
        >
          {isFriendDataLoading ? (
            <ActivityIndicator size={"small"} color={color.white} />
          ) : (
            <MaterialIcons name="person-remove" size={20} color={color.white} />
          )}
          <Text style={styles.actionButtonText}>Remove</Text>
        </TouchableOpacity>
      );
    }

    if (
      sentFriendshipRequests.find(
        (req) => req.requestee.id === userData.user.id
      ) ||
      receivedFriendshipRequests.find(
        (req) => req.requester.id === userData.user.id
      )
    ) {
      const pendingReq = sentFriendshipRequests.find(
        (req) => req.requestee.id === userData.user.id
      )!;
      return (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: color.primaryColor }]}
          onPress={async () => await removeFriend(pendingReq.id)}
        >
          {isFriendDataLoading ? (
            <ActivityIndicator size={"small"} color={color.white} />
          ) : (
            <MaterialIcons name="access-time" size={20} color={color.white} />
          )}
          <Text style={styles.actionButtonText}>Pending</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.actionButton}
        onPress={async () => await sentFriendshipRequest(userData.user.id)}
      >
        {isFriendDataLoading ? (
          <ActivityIndicator size={"small"} color={color.white} />
        ) : (
          <MaterialIcons name="person-add" size={20} color={color.white} />
        )}
        <Text style={styles.actionButtonText}>Add</Text>
      </TouchableOpacity>
    );
  };

  const setBlockButton = () => {
    if (blockList.find((block) => block.blocked_id === userData.user.id)) {
      return (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            setShowConfirmModal(true);
          }}
        >
          <MaterialIcons name="person-remove" size={20} color={color.white} />
          <Text style={styles.actionButtonText}>Unblock</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        style={[styles.actionButton, styles.blockButton]}
        onPress={() => {
          setShowConfirmModal(true);
        }}
      >
        <MaterialCommunityIcons
          name="block-helper"
          size={20}
          color={color.white}
        />
        <Text style={styles.actionButtonText}>Block</Text>
      </TouchableOpacity>
    );
  };

  const handleGoChat = (userId: string) => {
    socket?.emit("joinRoom", { user2Id: userId });
    socket?.once("joinRoomSuccess", async (data: { room: ChatRoomsDTO }) => {
      setIsCreatingRoom(true);
      if (data && data.room) {
        const otherUserId = data.room.user_ids.find(
          (id) => id === userData.user.id
        );
        if (!otherUserId) return;
        const userInfo = await getUserByID(otherUserId);
        const newChat = {
          ...data.room,
          name: data.room.name ?? null,
          otherUser: userInfo?.user!,
          otherUserAccount: userInfo?.account!,
          otherUserPrivacySettings: userInfo?.privacy_settings!,
        };

        setIsCreatingRoom(false);
        dispatch(addChat({ ...newChat, unreadCount: 0 }));
        navigate("Chat", {
          chat: {
            ...newChat,
            unreadCount: 0,
          },
        });
      }
    });
  };

  const handleAcceptAndRejectFriendship = async (status: FriendshipAction) => {
    const friendRequest = receivedFriendshipRequests.find(
      (request) => request.requester.id === userData.user.id
    );

    await acceptAndRejectFrienship(status, friendRequest!.id);
  };

  return (
    <>
      <View style={styles.container}>
        {/* Title And Profile Photo */}

        {receivedFriendshipRequests.find(
          (req) => req.requester.id === userData.user.id
        ) && (
          <View style={styles.friendRequestBox}>
            <Text
              style={styles.requestTitle}
            >{`${userData.user.first_name} ${userData.user.last_name} sent you a friend request`}</Text>
            <View style={styles.requestButtonRow}>
              <TouchableOpacity
                style={[styles.requestButton, styles.accept]}
                onPress={() =>
                  handleAcceptAndRejectFriendship(FriendshipAction.accept)
                }
                disabled={isAccepting || isRejecting}
              >
                {isAccepting ? (
                  <ActivityIndicator color={color.white} size={"small"} />
                ) : (
                  <Text style={styles.buttonText}>Accept</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.requestButton, styles.decline]}
                onPress={() =>
                  handleAcceptAndRejectFriendship(FriendshipAction.reject)
                }
                disabled={isRejecting || isAccepting}
              >
                {isRejecting ? (
                  <ActivityIndicator color={color.white} size={"small"} />
                ) : (
                  <Text style={styles.buttonText}>Reject</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {isLoading ? (
              <SkeletonLoader style={{ width: 150, height: 24 }} />
            ) : isMyProfileScreen ? (
              "My Profile"
            ) : (
              `@${userData.user.username}'s Profile`
            )}
          </Text>
          <View style={styles.profileImageContainer}>
            <Pressable onPress={() => setShowImageModal(true)}>
              <Image
                source={
                  userData.account.profile_picture
                    ? { uri: userData.account.profile_picture }
                    : require("@assets/images/no-profile-photo.png")
                }
                style={styles.profile_picture}
              />
            </Pressable>
            {isMyProfileScreen ? (
              <Pressable
                style={styles.profilePhotoEditIcon}
                onPress={() => setShowModal(true)}
              >
                <Ionicons name="camera" size={24} color={color.white} />
              </Pressable>
            ) : (
              <>
                {isLoading ? (
                  <SkeletonLoader
                    style={{ width: 100, height: 24, marginTop: 20 }}
                  />
                ) : (
                  <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleGoChat(userData.user.id)}
                    >
                      <Ionicons
                        name="chatbubble"
                        size={20}
                        color={color.white}
                      />
                      <Text style={styles.actionButtonText}>Message</Text>
                    </TouchableOpacity>

                    {setFriendButton()}

                    {setBlockButton()}
                  </View>
                )}
              </>
            )}
          </View>
        </View>

        {/* Personal Informations Container */}
        <View style={styles.personalContainer}>
          {/* Personal Informations Title */}
          <View style={styles.personalTitleContainer}>
            <View style={styles.personalTitleContainerLeft}>
              <Ionicons
                name="person-circle"
                size={24}
                color={color.primaryColor}
              />
              <Text style={styles.presonalTitle}>Personal Information</Text>
            </View>

            {isMyProfileScreen && (
              <View>
                <MaterialIcons
                  name="edit-square"
                  size={24}
                  color={color.primaryColor}
                  onPress={() => setShowEditModal(true)}
                />
              </View>
            )}
          </View>

          {/* Personal Informations Content */}
          <View style={styles.infoGrid}>
            {/* First Row */}
            <View style={styles.infoRow}>
              <View style={[styles.infoItem]}>
                <Text style={styles.infoLabel}>First Name</Text>
                <Text style={styles.infoValue}>
                  {isLoading ? (
                    <SkeletonLoader style={{ width: 100, height: 16 }} />
                  ) : (
                    userData.user.first_name
                  )}
                </Text>
                <View style={styles.infoLine} />
              </View>

              <View style={[styles.infoItem]}>
                <Text style={styles.infoLabel}>Last Name</Text>
                <Text style={styles.infoValue}>
                  {isLoading ? (
                    <SkeletonLoader style={{ width: 100, height: 16 }} />
                  ) : (
                    userData.user.last_name
                  )}
                </Text>
                <View style={styles.infoLine} />
              </View>
            </View>

            {/* Other Fields */}
            {[
              {
                label: "Username",
                value: userData.user.username,
                icon: "at" as const,
              },
              {
                label: "Email",
                value: userData.user.email,
                privacySetting: userData.privacySettings.email,
                icon: "mail" as const,
              },
              {
                label: "Gender",
                value: userData.user.gender,
                privacySetting: userData.privacySettings.gender,
                icon: "male-female" as const,
              },
            ].map((item, index) => (
              <View key={index} style={styles.infoItemFull}>
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={color.primaryColor}
                  style={styles.fieldIcon}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  {shouldBlur(item.privacySetting) ? (
                    <SkeletonLoader
                      style={{ width: 120, height: 16, marginVertical: 4 }}
                    />
                  ) : (
                    <View style={styles.infoTextWithLock}>
                      <Text style={styles.infoValue}>{item.value}</Text>
                      {isMyProfileScreen && (
                        <>
                          {item.privacySetting ===
                            PrivacySettingsChoice.nobody && (
                            <MaterialIcons
                              name="lock-person"
                              size={20}
                              color={color.black}
                              style={styles.lockIcon}
                              onPress={() => setShowPrivacyModal(true)}
                            />
                          )}

                          {item.privacySetting ===
                            PrivacySettingsChoice.everyone && (
                            <MaterialIcons
                              name="public"
                              size={20}
                              color={color.black}
                              style={styles.lockIcon}
                              onPress={() => setShowPrivacyModal(true)}
                            />
                          )}

                          {item.privacySetting ===
                            PrivacySettingsChoice.my_friends && (
                            <MaterialIcons
                              name="people-alt"
                              size={20}
                              color={color.black}
                              style={styles.lockIcon}
                              onPress={() => setShowPrivacyModal(true)}
                            />
                          )}
                        </>
                      )}
                    </View>
                  )}
                  <View style={styles.infoLine} />
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {showModal && isMyProfileScreen && (
        <ChangePhotoModal
          visible={showModal}
          onClose={() => setShowModal(false)}
        />
      )}

      {showImageModal && (
        <ProfilePhotoModal
          visible={showImageModal}
          onClose={() => setShowImageModal(false)}
          imageSource={
            userData.account.profile_picture
              ? { uri: userData.account.profile_picture }
              : require("@assets/images/no-profile-photo.png")
          }
        />
      )}

      {isMyProfileScreen && (
        <>
          <EditProfileInfoModal
            type="personal"
            visible={showEditModal}
            onClose={() => setShowEditModal(false)}
          />

          <PrivacyLegendModal
            visible={showPrivacyModal}
            onClose={() => setShowPrivacyModal(false)}
          />
        </>
      )}

      <ConfirmModal
        visible={showConfirmModal}
        title="Are you sure?"
        message="This action cannot be undone"
        confirmText={
          blockList.find((block) => block.blocked_id === userData.user.id)
            ? "Unblock"
            : "Block"
        }
        cancelText="Cancel"
        confirmColor="red"
        isLoading={isBlocking}
        onConfirm={handleBlockAndUnblockUser}
        onCancel={() => setShowConfirmModal(false)}
      />
    </>
  );
};

export default PersonalInfo;
