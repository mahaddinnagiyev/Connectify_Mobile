import React from "react";
import {
  ScrollView,
  useWindowDimensions,
  View,
  StyleSheet,
} from "react-native";
import { TabView } from "react-native-tab-view";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import ProfileHeader from "@components/profile/ProfileHeader";
import ProfilePage from "@components/profile/ProfilePage";
import MyFriends from "@components/friends/MyFriends";
import FriendRequests from "@components/friends/FriendRequests";
import BlockList from "@components/block/BlockList";
import { setActiveIndex } from "@redux/profile/myProfileSlice";

export default function MyProfileScreen() {
  const layout = useWindowDimensions();
  const dispatch = useDispatch();
  const activeIndex = useSelector(
    (state: RootState) => state.myProfile.activeIndex
  );

  const routes = [
    { key: "profile", title: "Profile" },
    { key: "friends", title: "Friends" },
    { key: "requests", title: "Requests" },
    { key: "blocked", title: "Blocked" },
  ];

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "profile":
        return (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <ProfilePage />
          </ScrollView>
        );
      case "friends":
        return (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <MyFriends />
          </ScrollView>
        );
      case "requests":
        return (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <FriendRequests />
          </ScrollView>
        );
      case "blocked":
        return (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <BlockList />
          </ScrollView>
        );
      default:
        return null;
    }
  };

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
  container: { flex: 1, backgroundColor: "#fff" },
  tabView: { flex: 1 },
  scrollContainer: {
    paddingBottom: 100,
    flexGrow: 1,
  },
});
