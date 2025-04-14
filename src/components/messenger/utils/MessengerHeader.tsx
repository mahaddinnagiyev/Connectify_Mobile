import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Pressable,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { color } from "@/colors";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { StackParamList } from "@navigation/Navigator";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const MessengerHeader = () => {
  const navigate = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View style={styles.header}>
      <View style={styles.upperHeader}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 15,
            color: color.primaryColor,
          }}
        >
          Messenger
        </Text>

        <Pressable
          style={{ marginLeft: "auto" }}
          onPress={() => navigate.navigate("MyFriends")}
        >
          <MaterialIcons name="person-search" size={30} color="black" />
        </Pressable>
      </View>

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

export default MessengerHeader;

const styles = StyleSheet.create({
  header: {
    width: screenWidth,
    height: 100,
  },

  upperHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "96%",
    marginBottom: 10,
  },

  searchContainer: {
    width: "94%",
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
});
