import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { color } from "@/colors";
import { useUserData } from "@hooks/useUserData";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { StackParamList } from "@navigation/UserStack";

interface IUserItem {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  profile_picture?: string;
}

const AllUsers: React.FC = () => {
  const [users, setUsers] = React.useState<IUserItem[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const { searchUser, isSearching } = useUserData();
  const { navigate } =
    useNavigation<NativeStackNavigationProp<StackParamList>>();
  const searchTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setUsers([]);

    if (text === "") {
      return;
    }

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(async () => {
      const formatted = text.trim().replace(/\s+/g, "+");
      const results = await searchUser(formatted);
      setUsers(results ?? []);
    }, 500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          placeholderTextColor={color.emptyText}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {isSearching && (
        <ActivityIndicator
          size="large"
          color={color.primaryColor}
          style={{ marginVertical: 10 }}
        />
      )}

      {searchQuery === "" && !isSearching && (
        <Text
          style={{
            marginTop: 10,
            color: "#666",
            fontSize: 16,
            textAlign: "center",
          }}
        >
          Let's start searching!
        </Text>
      )}

      {users.length === 0 && !isSearching && searchQuery !== "" && (
        <Text
          style={{
            marginTop: 10,
            color: "#666",
            fontSize: 16,
            textAlign: "center",
          }}
        >
          No users found.
        </Text>
      )}

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <Pressable
            style={styles.friendItem}
            onPress={() =>
              navigate("OtherUserProfile", { username: item.username })
            }
          >
            <View style={styles.profileContainer}>
              <Image
                source={
                  item.profile_picture
                    ? { uri: item.profile_picture }
                    : require("@assets/images/no-profile-photo.png")
                }
                style={styles.avatar}
              />
              <View style={styles.textContainer}>
                <Text
                  style={styles.name}
                >{`${item.first_name} ${item.last_name}`}</Text>
                <Text style={styles.username}>@{item.username}</Text>
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
    backgroundColor: color.white,
    margin: "auto",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
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
    shadowColor: color.black,
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
    borderColor: color.borderLight,
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
    color: color.headerTextColor,
  },
  username: {
    fontSize: 14,
    color: color.usernameText,
    marginTop: 2,
  },
  statusIndicator: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AllUsers;
