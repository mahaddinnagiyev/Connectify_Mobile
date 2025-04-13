import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { color } from "@/colors";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { StackParamList } from "@navigation/Navigator";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const UserChats = () => {
  const navigate = useNavigation<NativeStackNavigationProp<StackParamList>>();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {Array.from({ length: 10 }).map((_, index) => (
          <TouchableOpacity
            key={index}
            style={styles.chat}
            onPress={() => navigate.navigate("Chat")}
          >
            {/* <Text>{index + 1}</Text> */}
            <Image
              source={require("@assets/images/no-profile-photo.png")}
              style={styles.profilePhoto}
            />
            <View style={styles.chatDetail}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                John Doe | @johndoe
              </Text>
              <View style={styles.lastMessage}>
                <Text>Whats's Up Man</Text>
                <Text style={{ fontSize: 9 }}>12:00</Text>
              </View>
            </View>
            <View>
              <Text style={styles.unreadCount}>2</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default UserChats;

const styles = StyleSheet.create({
  container: {
    height: screenHeight - 200,
  },

  chat: {
    flexDirection: "row",
    width: screenWidth - 80,
    gap: 10,
    height: 80,
    alignItems: "center",
    paddingHorizontal: 10,
    position: "relative",
    marginBottom: 10,
  },

  profilePhoto: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: color.primaryColor,
  },

  chatDetail: {
    height: "58%",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  lastMessage: {
    flexDirection: "row",
    width: "100%",
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
