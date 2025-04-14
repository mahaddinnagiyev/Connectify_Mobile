import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { color } from "@/colors";

const BlockList = () => {

  const blockedUsers = [
    {
      id: 1,
      name: "Elvin Həsənov",
      username: "@elvin_h",
      avatar: require("@assets/images/no-profile-photo.png"),
    },
    {
      id: 2,
      name: "Aydan Məmmədova",
      username: "@aydan_m",
      avatar: require("@assets/images/no-profile-photo.png"),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.headerText}>
        Blocked Users ({blockedUsers.length})
      </Text>

      {/* Blocked Users List */}
      <FlatList
        data={blockedUsers}
        scrollEnabled={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            {/* Profile Info */}
            <View style={styles.userInfo}>
              <Image source={item.avatar} style={styles.avatar} />
              <View style={styles.textContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.username}>{item.username}</Text>
              </View>
            </View>

            {/* Unblock Button */}
            <Pressable
              style={styles.unblockButton}
              onPress={() => console.log("Unblock:", item.id)}
            >
              <Ionicons name="lock-open" size={20} color="white" />
              <Text style={styles.buttonText}>Unblock</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No blocked users</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 20,
    margin: "auto",
  },
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#ff4444",
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3436",
  },
  username: {
    fontSize: 14,
    color: "#636E72",
    marginTop: 2,
  },
  unblockButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: color.primaryColor,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
});

export default BlockList;
