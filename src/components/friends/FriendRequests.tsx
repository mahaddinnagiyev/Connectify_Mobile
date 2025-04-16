import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { color } from "@/colors";
import { formatDistanceToNow } from "date-fns";

const FriendRequests = () => {
  const [activeTab, setActiveTab] = useState<"sent" | "received">("received");

  const receivedRequests = [
    {
      id: 1,
      name: "Aydan Məmmədova",
      username: "@aydan_m",
      avatar: require("@assets/images/no-profile-photo.png"),
      timestamp: new Date(2024, 2, 15),
    },
    {
      id: 2,
      name: "Elvin Həsənov",
      username: "@elvin_h",
      avatar: require("@assets/images/no-profile-photo.png"),
      timestamp: new Date(2024, 2, 16),
    },
  ];

  const sentRequests = [
    {
      id: 1,
      name: "Nərmin Hüseynova",
      username: "@nermin_h",
      avatar: require("@assets/images/no-profile-photo.png"),
      timestamp: new Date(2024, 2, 14),
    },
  ];

  const renderItem = ({ item }: any) => (
    <View style={styles.requestItem}>
      <View style={styles.userInfo}>
        <Image source={item.avatar} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.timestamp}>
            {formatDistanceToNow(item.timestamp)} ago
          </Text>
        </View>
      </View>

      {activeTab === "received" ? (
        <View style={styles.actions}>
          <Pressable style={[styles.button, styles.acceptButton]}>
            <Ionicons name="checkmark" size={18} color="white" />
          </Pressable>
          <Pressable style={[styles.button, styles.rejectButton]}>
            <Ionicons name="close" size={18} color="white" />
          </Pressable>
          <Pressable style={[styles.button, styles.blockButton]}>
            <Ionicons name="ban" size={16} color="white" />
          </Pressable>
        </View>
      ) : (
        <Text style={styles.sentText}>Pending</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.headerText}>Friendship Requests</Text>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tabItem, activeTab === "received" && styles.activeTab]}
          onPress={() => setActiveTab("received")}
        >
          <Text style={styles.tabText}>
            Received ({receivedRequests.length})
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tabItem, activeTab === "sent" && styles.activeTab]}
          onPress={() => setActiveTab("sent")}
        >
          <Text style={styles.tabText}>Sent ({sentRequests.length})</Text>
        </Pressable>
      </View>

      {/* Request List */}
      <FlatList
        data={activeTab === "received" ? receivedRequests : sentRequests}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No requests found</Text>
        }
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
  tabBar: {
    flexDirection: "row",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderColor: "transparent",
  },
  activeTab: {
    borderColor: color.primaryColor,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  requestItem: {
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
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#F44336",
  },
  blockButton: {
    backgroundColor: "#9E9E9E",
  },
  sentText: {
    color: "#888",
    fontWeight: "500",
    marginRight: 8,
  },
  listContent: {
    paddingBottom: 30,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
});

export default FriendRequests;
