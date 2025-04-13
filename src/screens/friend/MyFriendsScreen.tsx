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
import { MaterialIcons } from "@expo/vector-icons";
import { color } from "@/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { StackParamList } from "@/src/navigation/Navigator";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const MyFriendsScreen = () => {
  const navigate = useNavigation<NativeStackNavigationProp<StackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      {/* Friends Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Friend List</Text>
        <Pressable
          style={styles.headerButton}
          onPress={() => navigate.goBack()}
        >
          <MaterialIcons
            name="chevron-left"
            size={20}
            color={color.primaryColor}
          />
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
      <View style={{ height: 60 }}>
        <TextInput placeholder="Search friends" style={styles.searchBar} />
      </View>

      {/* Friend List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {Array.from({ length: 20 }).map((_, index) => (
          <TouchableOpacity
            style={styles.chat}
            key={index}
            onPress={() => navigate.navigate("Chat")}
          >
            {/* Profile Photo */}
            <Image
              source={require("@assets/images/no-profile-photo.png")}
              style={styles.profilePhoto}
            />
            {/* Chat Detail */}
            <View style={styles.chatDetail}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                John Doe | @johndoe
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
  },

  header: {
    width: screenWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    height: 50,
    position: "relative",
  },

  headerButton: {
    width: 80,
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    paddingRight: 20,
    marginLeft: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: color.primaryColor,
  },

  searchBar: {
    width: screenWidth * 0.94,
    borderWidth: 1,
    borderRadius: 10,
    margin: "auto",
    paddingLeft: 10,
    marginTop: 10,
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
