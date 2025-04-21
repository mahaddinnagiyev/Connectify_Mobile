import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { color } from "@/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { StackParamList } from "@navigation/Navigator";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const MyFriendsScreen = () => {
  const navigate = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const { friends } = useSelector((state: RootState) => state.myFriends);

  const truncateUsername = (name: string) => {
    if (name.length > 25) {
      return name.slice(0, 25) + "...";
    }
    return name;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Friends Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Friend List</Text>
        <Pressable
          style={styles.headerButton}
          onPress={() => navigate.goBack()}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: color.primaryColor,
            }}
          >
            Back
          </Text>
        </Pressable>
      </View>

      {/* Serach Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#888"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#888"
        />
      </View>

      {/* Friend List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {friends.map((friend, index) => (
          <TouchableOpacity
            style={styles.chat}
            key={index}
            onPress={() => navigate.navigate("Chat")}
          >
            {/* Profile Photo */}
            <Image
              source={
                friend.profile_picture
                  ? { uri: friend.profile_picture }
                  : require("@assets/images/no-profile-photo.png")
              }
              style={styles.profilePhoto}
            />
            {/* Chat Detail */}
            <View style={styles.chatDetail}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {truncateUsername(
                  friend.first_name +
                    " " +
                    friend.last_name +
                    " " +
                    "|" +
                    " " +
                    "@" +
                    friend.username
                )}{" "}
              </Text>
              <View style={styles.lastMessage}>
                <Text>Whats's Up Man</Text>
                <Text style={{ fontSize: 9 }}>12:00</Text>
              </View>
            </View>
            {/* Unread Count */}
            <View>
              <Text style={styles.unreadCount}>2</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyFriendsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    backgroundColor: "#fff",
  },

  header: {
    width: screenWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 10,
    position: "relative",
  },

  headerButton: {
    fontSize: 16,
    fontWeight: 800,
    color: color.primaryColor,
    backgroundColor: color.inputBgColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 18,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: color.primaryColor,
  },

  searchContainer: {
    width: "94%",
    height: 40,
    margin: "auto",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#333",
  },

  chat: {
    width: screenWidth * 0.94,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 80,
    position: "relative",
    marginVertical: 3,
  },

  profilePhoto: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: color.primaryColor,
  },

  chatDetail: {
    flexDirection: "column",
    gap: 4,
    width: "80%",
    height: "58%",
  },

  lastMessage: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  unreadCount: {
    backgroundColor: color.primaryColor,
    width: 20,
    height: 20,
    borderRadius: 50,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    position: "absolute",
    right: 10,
    bottom: -5,
  },
});
