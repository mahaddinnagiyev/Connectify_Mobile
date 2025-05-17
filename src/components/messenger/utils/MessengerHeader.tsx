import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { color } from "@/colors";
import { styles } from "../styles/messengerHeader.style";

// Navigation
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { StackParamList } from "@navigation/Navigator";

// Enums
import { MessengerFilter } from "@enums/messenger.enum";

// Redux
import { RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import { filterChats, setMenuFilter } from "@redux/messenger/messengerSlice";

const MessengerHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [searchQuery, setSearchQuery] = useState("");

  const menuFilter = useSelector((s: RootState) => s.messenger.menuFilter);

  React.useEffect(() => {
    dispatch(filterChats(searchQuery));
  }, [searchQuery]);

  const renderButton = (filter: MessengerFilter, label: string) => (
    <TouchableOpacity
      onPress={() => dispatch(setMenuFilter(filter))}
      style={[
        styles.filterBtn,
        menuFilter === filter && styles.filterBtnActive,
      ]}
    >
      <Text
        style={[
          styles.filterBtnText,
          menuFilter === filter && styles.filterBtnTextActive,
        ]}
      >
        {menuFilter === filter && "✓"} {label}
      </Text>
    </TouchableOpacity>
  );

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

      <View style={styles.filterBar}>
        {renderButton(MessengerFilter.LATEST, "Latest")}
        {renderButton(MessengerFilter.OLDEST, "Oldest")}
        {renderButton(MessengerFilter.ACTIVE_USERS, "Active")}
        {renderButton(MessengerFilter.UNREAD, "Unread")}
      </View>
    </View>
  );
};

export default MessengerHeader;
