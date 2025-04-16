import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import React from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { color } from "@/colors";

const AllUsers = () => {
  const friends = [
    {
      id: 1,
      name: "Mahaddin Nagiyev",
      username: "@nagiyev_mahaddin",
      avatar: require("@assets/images/no-profile-photo.png"),
    },
    {
      id: 2,
      name: "Nərmin Hüseynova",
      username: "@nermin_h",
      avatar: require("@assets/images/no-profile-photo.png"),
    },
    {
      id: 3,
      name: "Mahaddin Nagiyev",
      username: "@nagiyev_mahaddin",
      avatar: require("@assets/images/no-profile-photo.png"),
    },
    {
      id: 4,
      name: "Nərmin Hüseynova",
      username: "@nermin_h",
      avatar: require("@assets/images/no-profile-photo.png"),
    },
    {
      id: 5,
      name: "Mahaddin Nagiyev",
      username: "@nagiyev_mahaddin",
      avatar: require("@assets/images/no-profile-photo.png"),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.headerText}>All Users</Text>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          placeholderTextColor="#888"
        />
      </View>

      {/* Friends list */}
      <FlatList
        data={friends}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <Pressable style={styles.friendItem}>
            <View style={styles.profileContainer}>
              <Image source={item.avatar} style={styles.avatar} />
              <View style={styles.textContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.username}>{item.username}</Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <View style={styles.statusIndicator}>
                <Text>
                  <MaterialIcons
                    name="chat"
                    size={22}
                    color={color.primaryColor}
                  />
                </Text>
              </View>
              <View style={styles.statusIndicator}>
                <Text>
                  <MaterialIcons
                    name="person-add"
                    size={24}
                    color={color.primaryColor}
                  />
                </Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 16,
    backgroundColor: "#fff",
  },

  headerText: {
    fontSize: 24,
    margin: "auto",
    fontWeight: "700",
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  friendItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  profileContainer: {
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
    borderColor: color.primaryColor,
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
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  statusIndicator: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AllUsers;
