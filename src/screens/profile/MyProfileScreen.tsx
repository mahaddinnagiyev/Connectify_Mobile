import React, { useEffect } from "react";
import {
  ScrollView,
  useWindowDimensions,
  View,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { TabView } from "react-native-tab-view";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import ProfileHeader from "@components/profile/ProfileHeader";
import ProfilePage from "@components/profile/ProfilePage";
import MyFriends from "@components/friends/MyFriends";
import FriendRequests from "@components/friends/FriendRequests";
import BlockList from "@components/block/BlockList";
import { setActiveIndex, setUserData } from "@redux/profile/myProfileSlice";
import { setErrorMessage } from "@redux/messages/messageSlice";
import { useUserData } from "@hooks/useUserData";
import { color } from "@/colors";
import { useFriendData } from "@hooks/useFriendData";

export default function MyProfileScreen() {
  const layout = useWindowDimensions();
  const dispatch = useDispatch();
  const { activeIndex } = useSelector((state: RootState) => state.myProfile);
  const { userResponse, isLoading, refetch } = useUserData();
  const { fetchBlockList, fetchBlockerList, fetchAllFriendReuqest } =
    useFriendData();

  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  // Fetch User Datas
  useEffect(() => {
    const fetchMyData = async () => {
      if (userResponse) {
        if (userResponse.success) {
          await Promise.all([
            fetchBlockList(),
            fetchBlockerList(),
            fetchAllFriendReuqest(),
          ]);
          dispatch(
            setUserData({
              user: userResponse.user,
              account: userResponse.account,
              privacySettings: userResponse.privacy_settings,
            })
          );
        } else {
          dispatch(
            setErrorMessage(
              Array.isArray(userResponse.response?.message)
                ? userResponse.response!.message![0]
                : userResponse.response?.message ||
                    userResponse.response?.error ||
                    userResponse.message ||
                    userResponse.error ||
                    "Something went wrong"
            )
          );
        }
      }
    };

    fetchMyData();
  }, [userResponse, dispatch]);

  const routes = [
    { key: "profile", title: "Profile" },
    { key: "friends", title: "Friends" },
    { key: "requests", title: "Requests" },
    { key: "blocked", title: "Blocked" },
  ];

  const renderScene = ({ route }: { route: { key: string } }) => {
    const refreshControl = (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={handleRefresh}
        colors={[color.primaryColor]}
        tintColor={color.primaryColor}
      />
    );

    switch (route.key) {
      case "profile":
        return (
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            refreshControl={refreshControl}
          >
            <ProfilePage isMyProfileScreen={true} isLoading={isLoading} />
          </ScrollView>
        );
      case "friends":
        return (
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            refreshControl={refreshControl}
          >
            <MyFriends />
          </ScrollView>
        );
      case "requests":
        return (
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            refreshControl={refreshControl}
          >
            <FriendRequests />
          </ScrollView>
        );
      case "blocked":
        return (
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            refreshControl={refreshControl}
          >
            <BlockList />
          </ScrollView>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={color.primaryColor} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProfileHeader />

      <TabView
        navigationState={{ index: activeIndex, routes }}
        renderScene={renderScene}
        onIndexChange={(idx) => dispatch(setActiveIndex(idx))}
        initialLayout={{ width: layout.width }}
        style={styles.tabView}
        renderTabBar={() => null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", justifyContent: "center" },
  tabView: { flex: 1 },
  scrollContainer: { paddingBottom: 100, flexGrow: 1 },
});
