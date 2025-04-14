import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/src/components/header/Header"; // Sizin mövcud Header komponentiniz
import { color } from "@/colors";

const UsersScreen = () => {
  const [activeTab, setActiveTab] = useState<
    "ALL_USERS" | "MY_FRIENDS" | "REQUESTS"
  >("ALL_USERS");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>All Users</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[
            activeTab === "ALL_USERS" ? styles.activeTabTitle : styles.tabTitle,
            { borderTopLeftRadius: 50, borderBottomLeftRadius: 50 },
          ]}
          onPress={() => setActiveTab("ALL_USERS")}
        >
          <Text
            style={
              activeTab === "ALL_USERS" ? styles.activeTabText : styles.tabText
            }
          >
            All Users
          </Text>
        </Pressable>

        <Pressable
          style={
            activeTab === "MY_FRIENDS" ? styles.activeTabTitle : styles.tabTitle
          }
          onPress={() => setActiveTab("MY_FRIENDS")}
        >
          <Text
            style={
              activeTab === "MY_FRIENDS" ? styles.activeTabText : styles.tabText
            }
          >
            My Friends
          </Text>
        </Pressable>

        <Pressable
          style={[
            activeTab === "REQUESTS" ? styles.activeTabTitle : styles.tabTitle,
            { borderTopRightRadius: 50, borderBottomRightRadius: 50 },
          ]}
          onPress={() => setActiveTab("REQUESTS")}
        >
          <Text
            style={
              activeTab === "REQUESTS" ? styles.activeTabText : styles.tabText
            }
          >
            Requests
          </Text>
        </Pressable>
      </View>

      {/* Search Bar */}
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
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  titleContainer: {
    width: "95%",
    marginLeft: "auto",
    marginBottom: 10,
    justifyContent: "flex-start",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: color.primaryColor,
  },

  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    width: "94%",
    marginBottom: 10,
  },

  tabTitle: {
    width: "31%",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    borderColor: color.primaryColor,
    borderWidth: 2,
  },

  tabText: {
    fontSize: 15,
    fontWeight: "bold",
    color: color.primaryColor,
    margin: "auto",
  },

  activeTabTitle: {
    width: "31%",
    padding: 10,
    borderRadius: 8,
    backgroundColor: color.primaryColor,
    borderColor: color.primaryColor,
    color: "#fff",
    borderWidth: 2,
  },

  activeTabText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
    margin: "auto",
  },

  searchContainer: {
    width: "92%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
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
});

export default UsersScreen;
