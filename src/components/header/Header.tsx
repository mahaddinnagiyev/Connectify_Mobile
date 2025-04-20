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
import { style } from "./style/header-style";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSelector, useDispatch } from "react-redux";
import { toggleModal } from "@redux/header/headerSlice";
import { RootState } from "@redux/store";
import { useNavigation } from "@react-navigation/native";
import { color } from "@/colors";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { StackParamList } from "@navigation/Navigator";
import Alert from "../modals/error/Alert";
import { logout } from "@services/auth/auth.service";
import {
  setErrorMessage,
  setSuccessMessage,
} from "@redux/messages/messageSlice";
import { setIsAuthenticated } from "@redux/auth/authSlice";

interface HeaderProps {
  activeTab: string;
  onTabChange: (key: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const dispatch = useDispatch();

  const { isModalVisible } = useSelector((state: RootState) => state.header);
  const { userData } = useSelector((state: RootState) => state.myProfile);

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
        dispatch(setIsAuthenticated(false));
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
        <TouchableOpacity
          onPress={() => onTabChange("messenger")}
          style={style.menuContainer}
        >
          {activeTab === "Messenger" ? (
            <MaterialIcons name="chat" size={30} color={color.primaryColor} />
          ) : (
            <MaterialIcons name="chat-bubble-outline" size={30} color="black" />
          )}
          <Text
            style={[
              style.menuText,
              {
                fontSize: 12,
                bottom: 0,
                color: activeTab === "Messenger" ? color.primaryColor : "black",
              },
            ]}
          >
            Messenger
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsAlertVisible(true)}
          style={style.menuContainer}
        >
          <MaterialCommunityIcons
            name="account-group-outline"
            size={30}
            color="black"
          />
          <Text
            style={[
              style.menuText,
              {
                fontSize: 12,
                color: activeTab === "Groups" ? color.primaryColor : "black",
              },
            ]}
          >
            Groups
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onTabChange("users")}
          style={style.menuContainer}
        >
          {activeTab === "Users" ? (
            <MaterialIcons name="people" size={31} color={color.primaryColor} />
          ) : (
            <MaterialIcons name="people-outline" size={31} color="black" />
          )}
          <Text
            style={[
              style.menuText,
              {
                fontSize: 12,
                bottom: 0,
                color: activeTab === "Users" ? color.primaryColor : "black",
              },
            ]}
          >
            Users
          </Text>
        </TouchableOpacity>
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
                color: activeTab === "MyProfile" ? color.primaryColor : "black",
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
