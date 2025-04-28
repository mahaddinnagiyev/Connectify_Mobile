import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@redux/store";
import { toggleMenu } from "@redux/chat/chatSilce";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { StackParamList } from "@navigation/UserStack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { styles } from "./styles/chatHeader.style";

const truncate = (text: string = "", maxLength: number): string => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const ChatHeader = () => {
  const { isMenuVisible } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();

  const { navigate, goBack } =
    useNavigation<NativeStackNavigationProp<StackParamList>>();
  const route = useRoute<RouteProp<StackParamList, "Chat">>();
  const { chat } = route.params;

  const animationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isMenuVisible) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animationValue, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [isMenuVisible, animationValue]);

  const animatedStyle = {
    transform: [
      {
        translateY: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-10, 0],
        }),
      },
    ],
    opacity: animationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftHeader}>
        {/* Back Icon */}
        <View>
          <Pressable onPress={() => goBack()}>
            <MaterialIcons name="arrow-back-ios" size={18} color="black" />
          </Pressable>
        </View>

        {/* User Details */}
        <View style={styles.userDetail}>
          <Image
            source={
              chat.otherUserAccount.profile_picture
                ? { uri: chat.otherUserAccount.profile_picture }
                : require("@assets/images/no-profile-photo.png")
            }
            style={styles.profilePhoto}
          />

          <View style={{ gap: 5 }}>
            <Text style={styles.roomName}>
              {chat.name
                ? truncate(chat.name, 25)
                : truncate(
                    `${chat.otherUser.first_name} ${chat.otherUser.last_name} | @${chat.otherUser.username}`,
                    25
                  )}
            </Text>
            <Text style={styles.lastSeen}>
              Last Seen:{" "}
              {new Date(chat.otherUserAccount.last_login! + "Z").toLocaleDateString(
                "az",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                }
              )}
            </Text>
          </View>
        </View>
      </View>

      {/* More Options Icon */}
      <Pressable onPress={() => dispatch(toggleMenu())}>
        <MaterialIcons name="more-vert" size={24} color="black" />
      </Pressable>

      {/* Dropdown Menu */}
      {isMenuVisible && (
        <Modal
          visible={isMenuVisible}
          transparent={true}
          onRequestClose={() => dispatch(toggleMenu())}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => dispatch(toggleMenu())}
          >
            <Animated.View style={[styles.dropdownMenu, animatedStyle]}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() =>
                  navigate("OtherUserProfile", {
                    username: chat.otherUser.username,
                  })
                }
              >
                <MaterialIcons name="person" size={24} color="black" />
                <Text style={styles.menuText}>User Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <MaterialIcons name="image" size={24} color="black" />
                <Text style={styles.menuText}>Media</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <FontAwesome6 name="address-card" size={24} color="black" />
                <Text style={styles.menuText}>Room Name</Text>
              </TouchableOpacity>
            </Animated.View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};

export default ChatHeader;
