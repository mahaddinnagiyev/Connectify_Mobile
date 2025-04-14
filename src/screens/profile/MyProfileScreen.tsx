import { View, StyleSheet, ScrollView } from "react-native";
import React from "react";
import Header from "@components/header/Header";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import ProfilePage from "@components/profile/ProfilePage";
import ProfileHeader from "@components/profile/ProfileHeader";
import MyFriends from "@components/friends/MyFriends";
import FriendRequests from "@components/friends/FriendRequests";

const MyProfileScreen = () => {
  const activeIndex = useSelector(
    (state: RootState) => state.myProfile.activeIndex
  );

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Menu */}
        <ProfileHeader />

        {/* Personal Information */}
        {activeIndex === 0 && <ProfilePage />}
        {activeIndex === 1 && <MyFriends />}
        {activeIndex === 2 && <FriendRequests />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollContainer: {
    paddingBottom: 100,
  },
});

export default MyProfileScreen;
