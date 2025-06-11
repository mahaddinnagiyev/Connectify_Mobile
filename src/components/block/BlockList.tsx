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
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { useFriendData } from "@hooks/useFriendData";
import { BlockAction } from "@services/friends/blockList.dto";
import ConfirmModal from "../modals/confirm/ConfirmModal";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { StackParamList } from "@navigation/UserStack";
import { useNavigation } from "@react-navigation/native";

const BlockList = () => {
  const { navigate } =
    useNavigation<NativeStackNavigationProp<StackParamList>>();

  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [blockId, setBlockId] = React.useState<string | null>(null);

  const { blockList } = useSelector((state: RootState) => state.myFriends);

  const { fetchBlockList, blockAndUnblockUser, isBlocking } = useFriendData();

  React.useEffect(() => {
    const handleFetchBlockList = async () => {
      await fetchBlockList();
    };

    handleFetchBlockList();
  }, []);

  const handleUnblockUser = async () => {
    await blockAndUnblockUser(blockId!, BlockAction.unblock);
    setBlockId(null);
    setShowConfirmModal(false);
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.headerText}>Blocked Users ({blockList.length})</Text>

      {/* Blocked Users List */}
      <FlatList
        data={blockList}
        scrollEnabled={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            {/* Profile Info */}
            <Pressable
              style={styles.userInfo}
              onPress={() => {
                navigate("OtherUserProfile", { username: item.username });
              }}
            >
              <Image
                source={
                  item.profile_picture
                    ? { uri: item.profile_picture }
                    : require("@assets/images/no-profile-photo.png")
                }
                style={styles.avatar}
              />
              <View style={styles.textContainer}>
                <Text style={styles.name}>
                  {item.first_name} {item.last_name}
                </Text>
                <Text style={styles.username}>@{item.username}</Text>
              </View>
            </Pressable>

            {/* Unblock Button */}
            <Pressable
              style={styles.unblockButton}
              onPress={() => {
                setBlockId(item.blocked_id);
                setShowConfirmModal(true);
              }}
            >
              <Ionicons name="lock-open" size={20} color={color.white} />
              <Text style={styles.buttonText}>Unblock</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No blocked users</Text>
        }
      />

      <ConfirmModal
        visible={showConfirmModal}
        title="Unblock User"
        message="Are you sure you want to unblock this user?"
        confirmText="Unblock"
        cancelText="Cancel"
        isLoading={isBlocking}
        onConfirm={handleUnblockUser}
        onCancel={() => setShowConfirmModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: color.white,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    color: color.headerTextColor,
    marginBottom: 20,
    margin: "auto",
  },
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: color.borderLight,
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
    borderColor: color.avatarBorder,
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
    color: color.white,
    fontWeight: "500",
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    color: color.emptyText,
    marginTop: 20,
  },
});

export default BlockList;
