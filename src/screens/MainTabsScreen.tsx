// MainTabsScreen.tsx
import * as React from "react";
import { View, useWindowDimensions, StyleSheet } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import MessengerScreen from "./messenger/MessengerScreen";
import UsersScreen from "./users/UsersScreen";
import Header from "@components/header/Header";
import MyProfileScreen from "./profile/MyProfileScreen";

const renderScene = SceneMap({
  messenger: MessengerScreen,
  users: UsersScreen,
  myProfile: MyProfileScreen,
});

export default function MainTabsScreen() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "messenger", title: "Messenger", routeName: "Messenger" },
    { key: "users", title: "Users", routeName: "Users" },
    { key: "myProfile", title: "MyProfile", routeName: "MyProfile" },
  ]);

  return (
    <View style={{ flex: 1 }}>
      <Header
        activeTab={routes[index].routeName}
        onTabChange={(key) => {
          const newIndex = routes.findIndex((r) => r.key === key);
          if (newIndex !== -1) setIndex(newIndex);
        }}
      />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        swipeEnabled={true}
        renderTabBar={() => null}
      />
    </View>
  );
}
