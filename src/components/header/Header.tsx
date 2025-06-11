import React from "react";
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  PanResponder,
} from "react-native";
import { color } from "@/colors";
import { style } from "./style/header-style";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

// Components
import Alert from "../modals/error/Alert";

// Navigation
import { useNavigation } from "@react-navigation/native";
import type { StackParamList } from "@navigation/UserStack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Services
import { logout } from "@services/auth/auth.service";

// Functions
import { clearStorage } from "@functions/storage.function";

// Redux
import { RootState } from "@redux/store";
import { useSelector, useDispatch } from "react-redux";
import {
  setErrorMessage,
  setSuccessMessage,
} from "@redux/messages/messageSlice";
import { toggleModal } from "@redux/header/headerSlice";
import { setChats } from "@redux/messenger/messengerSlice";
import { setIsAuthenticated, setToken } from "@redux/auth/authSlice";
import {
  setBlockerList,
  setBlockList,
  setMyFriends,
  setReceivedFriendshipRequests,
  setSentFriendshipRequests,
} from "@redux/friend/myFriendsSlice";
import { clearDownloadMessages } from "@redux/chat/chatSlice";

interface HeaderProps {
  activeTab: string;
  onTabChange: (key: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const dispatch = useDispatch();

  const { isModalVisible } = useSelector((state: RootState) => state.header);
  const { userData } = useSelector((state: RootState) => state.myProfile);
  const { chats } = useSelector((state: RootState) => state.messenger);
  const { receivedFriendshipRequests } = useSelector(
    (state: RootState) => state.myFriends
  );

  const [isAlertVisible, setIsAlertVisible] = React.useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = React.useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 30) {
          dispatch(toggleModal());
        }
      },
    })
  ).current;

  // Logout
  const handleLogout = async () => {
    try {
      setIsLogoutLoading(true);
      const response = await logout();

      if (response.success) {
        dispatch(setSuccessMessage(response.message ?? "Logout successful"));
        dispatch(setChats([]));
        dispatch(setMyFriends([]));
        dispatch(setSentFriendshipRequests([]));
        dispatch(setReceivedFriendshipRequests([]));
        dispatch(setBlockList([]));
        dispatch(setBlockerList([]));
        dispatch(setIsAuthenticated(false));
        dispatch(clearDownloadMessages());
        dispatch(setToken(null));

        await clearStorage();
      } else {
        dispatch(
          setErrorMessage(
            response.response?.message ??
              response.response?.error ??
              response.message ??
              response.error ??
              "Something went wrong while logging out"
          )
        );
      }
    } catch (error) {
      dispatch(
        setErrorMessage(
          (error as Error).message ?? "Something went wrong while logging out"
        )
      );
    } finally {
      setIsLogoutLoading(false);
    }
  };

  const totalUnread = React.useMemo(
    () => chats.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0),
    [chats]
  );

  return (
    <>
      {isLogoutLoading && (
        <View style={style.loadingOverlay}>
          <ActivityIndicator
            size="large"
            color={color.primaryColor}
            style={style.loadingIndicator}
          />
        </View>
      )}

      <View style={style.header}>
        {/* Messenger */}
        <TouchableOpacity
          onPress={() => onTabChange("messenger")}
          style={style.menuContainer}
        >
          <View style={style.iconWrapper}>
            {activeTab === "Messenger" ? (
              <MaterialIcons name="chat" size={30} color={color.primaryColor} />
            ) : (
              <MaterialIcons
                name="chat-bubble-outline"
                size={30}
                color={color.black}
              />
            )}
            {totalUnread > 0 && (
              <View style={style.badge}>
                <Text style={style.badgeText}>
                  {totalUnread > 99 ? "99+" : totalUnread}
                </Text>
              </View>
            )}
          </View>
          <Text
            style={[
              style.menuText,
              {
                fontSize: 12,
                bottom: 0,
                color: activeTab === "Messenger" ? color.primaryColor : color.black,
              },
            ]}
          >
            Messenger
          </Text>
        </TouchableOpacity>

        {/* Groups */}
        <TouchableOpacity
          onPress={() => setIsAlertVisible(true)}
          style={style.menuContainer}
        >
          <MaterialCommunityIcons
            name="account-group-outline"
            size={30}
            color={color.black}
          />
          <Text
            style={[
              style.menuText,
              {
                fontSize: 12,
                color: activeTab === "Groups" ? color.primaryColor : color.black,
              },
            ]}
          >
            Groups
          </Text>
        </TouchableOpacity>

        {/* Users */}
        <TouchableOpacity
          onPress={() => onTabChange("users")}
          style={style.menuContainer}
        >
          <View style={style.iconWrapper}>
            {activeTab === "Users" ? (
              <MaterialIcons
                name="people"
                size={31}
                color={color.primaryColor}
              />
            ) : (
              <MaterialIcons name="people-outline" size={31} color={color.black} />
            )}
            {receivedFriendshipRequests.length > 0 && (
              <View style={style.badge}>
                <Text style={style.badgeText}>
                  {receivedFriendshipRequests.length}
                </Text>
              </View>
            )}
          </View>
          <Text
            style={[
              style.menuText,
              {
                fontSize: 12,
                bottom: 0,
                color: activeTab === "Users" ? color.primaryColor : color.black,
              },
            ]}
          >
            Users
          </Text>
        </TouchableOpacity>

        {/* My Profile */}
        <TouchableOpacity
          onLongPress={() => dispatch(toggleModal())}
          onPress={() => onTabChange("myProfile")}
          style={[style.menuContainer]}
        >
          {activeTab === "MyProfile" ? (
            <Image
              source={
                userData.account.profile_picture
                  ? { uri: userData.account.profile_picture }
                  : require("@assets/images/no-profile-photo.png")
              }
              style={[style.profileIcon, { borderColor: color.primaryColor }]}
            />
          ) : (
            <Image
              source={
                userData.account.profile_picture
                  ? { uri: userData.account.profile_picture }
                  : require("@assets/images/no-profile-photo.png")
              }
              style={[style.profileIcon]}
            />
          )}
          <Text
            style={[
              style.menuText,
              {
                fontSize: 12,
                bottom: 0,
                color: activeTab === "MyProfile" ? color.primaryColor : color.black,
              },
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => dispatch(toggleModal())}
      >
        <TouchableOpacity
          style={style.modalOverlay}
          activeOpacity={1}
          onPress={() => dispatch(toggleModal())}
        >
          <View style={style.modalContent}>
            <View style={style.handleContainer} {...panResponder.panHandlers}>
              <View style={style.handleBar} />
            </View>
            {/* Settings */}
            <Pressable
              style={({ pressed }) => [
                style.menuItem,
                pressed && style.pressedItem,
              ]}
              onPress={() => {
                dispatch(toggleModal());
                navigation.navigate("Settings");
              }}
            >
              <MaterialIcons name="settings" size={24} color="#444" />
              <Text style={style.menuText}>Settings</Text>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color="#666"
                style={style.chevron}
              />
            </Pressable>

            {/* Change Theme */}
            <Pressable
              style={({ pressed }) => [
                style.menuItem,
                pressed && style.pressedItem,
              ]}
              onPress={() => {
                dispatch(toggleModal());
                navigation.navigate("BackgrounTheme");
              }}
            >
              <MaterialIcons name="palette" size={24} color="#444" />
              <Text style={style.menuText}>Change Theme</Text>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color="#666"
                style={style.chevron}
              />
            </Pressable>

            {/* Contact Us */}
            <Pressable
              style={({ pressed }) => [
                style.menuItem,
                pressed && style.pressedItem,
              ]}
              onPress={() => {
                dispatch(toggleModal());
                navigation.navigate("ContactUs");
              }}
            >
              <MaterialIcons name="contact-phone" size={24} color="#444" />
              <Text style={style.menuText}>Contact Us</Text>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color="#666"
                style={style.chevron}
              />
            </Pressable>

            {/* Logout */}
            <Pressable
              style={({ pressed }) => [
                style.menuItem,
                pressed && style.pressedItem,
              ]}
              onPress={() => {
                dispatch(toggleModal());
                handleLogout();
              }}
            >
              <MaterialIcons name="logout" size={24} color="red" />
              <Text style={[style.menuText, { color: "red" }]}>Logout</Text>
            </Pressable>
          </View>
        </TouchableOpacity>
      </Modal>

      {isAlertVisible && (
        <Alert
          title="Project in Development Phase"
          message="Groups feature is currently under development. We're working hard to bring you this functionality as soon as possible!"
          buttonText="Got It!"
          footerNote="Stay tuned for updates!"
          visible={isAlertVisible}
          iconName="construct"
          onClose={() => setIsAlertVisible(false)}
        />
      )}
    </>
  );
};

export default Header;
