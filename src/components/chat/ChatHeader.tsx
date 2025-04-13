import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { color } from "@/colors";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/src/redux/store";
import { toggleMenu } from "@redux/chat/chatSilce";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { StackParamList } from "@navigation/Navigator";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

const ChatHeader = () => {
  const { isMenuVisible } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();

  const navigate = useNavigation<NativeStackNavigationProp<StackParamList>>();

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
          <Pressable onPress={() => navigate.goBack()}>
            <MaterialIcons name="arrow-back-ios" size={18} color="black" />
          </Pressable>
        </View>

        {/* User Details */}
        <View style={styles.userDetail}>
          <Image
            source={require("@assets/images/no-profile-photo.png")}
            style={styles.profilePhoto}
          />

          <View style={{ gap: 5 }}>
            <Text style={styles.roomName}>John Doe | @johndoe</Text>
            <Text style={styles.lastSeen}>Last Seen: 12:00</Text>
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
              <TouchableOpacity style={styles.menuItem}>
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

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    borderBottomColor: color.borderColor,
    borderBottomWidth: 1,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    height: 75,
    position: "relative",
  },

  leftHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  userDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  profilePhoto: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: color.primaryColor,
  },

  roomName: {
    fontSize: 16,
    fontWeight: "bold",
  },

  lastSeen: {
    fontSize: 11,
  },

  dropdownMenu: {
    position: "absolute",
    top: 75,
    right: 15,
    backgroundColor: "#fff",
    borderColor: color.borderColor,
    borderWidth: 1,
    borderTopWidth: 0,
    borderRadius: 10,
    borderTopRightRadius: 0,
    zIndex: 100,
  },

  menuItem: {
    width: 150,
    height: 50,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  menuText: {
    fontSize: 15,
    color: "black",
    fontWeight: 600,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
