import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Animated,
  Dimensions,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { color } from "@/colors";

// Components
import MyFriends from "@components/friends/MyFriends";
import FriendRequests from "@components/friends/FriendRequests";
import AllUsers from "@components/users/AllUsers";

// Redux
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";

const { width } = Dimensions.get("window");
const TABS = [
  { key: "ALL_USERS", label: "All", icon: "people", isBadgeActive: false },
  {
    key: "MY_FRIENDS",
    label: "Friends",
    icon: "diversity-3",
    isBadgeActive: false,
  },
  { key: "REQUESTS", label: "Requests", icon: "mail", isBadgeActive: true },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const UsersScreen: React.FC = () => {
  const { receivedFriendshipRequests = [] } = useSelector(
    (state: RootState) => state.myFriends
  );

  const [activeTab, setActiveTab] = useState<TabKey>("ALL_USERS");
  const indicatorX = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  const onTabPress = (index: number, key: TabKey) => {
    setActiveTab(key);
    Animated.spring(indicatorX, {
      toValue: ((width * 0.9) / TABS.length) * index,
      stiffness: 150,
      damping: 15,
      mass: 1,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "MY_FRIENDS":
        return <MyFriends isMyProfileScreen={false} />;
      case "REQUESTS":
        return <FriendRequests isMyProfileScreen={false} />;
      default:
        return <AllUsers />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={[color.primary, color.primaryDark]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.headerContainer}
      >
        <Text style={styles.headerTitle}>Explore Users</Text>
      </LinearGradient>

      {/* Tabs with Icons */}
      <View style={styles.tabContainer}>
        {TABS.map(({ key, label, icon, isBadgeActive }, idx) => {
          const active = key === activeTab;
          return (
            <Pressable
              key={key}
              onPress={() => onTabPress(idx, key)}
              style={[styles.tabButton, active && styles.tabButtonActive]}
            >
              <View style={styles.iconWrapper}>
                <MaterialIcons
                  name={icon as any}
                  size={24}
                  color={active ? color.white : color.primaryDark}
                />

                {isBadgeActive && receivedFriendshipRequests.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {receivedFriendshipRequests.length > 99
                        ? "99+"
                        : receivedFriendshipRequests.length}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
        <Animated.View
          style={[
            styles.indicator,
            {
              transform: [{ translateX: indicatorX }],
              marginLeft:
                activeTab === "ALL_USERS"
                  ? 10
                  : activeTab === "MY_FRIENDS"
                  ? 3
                  : -2,
            },
          ]}
        />
      </View>

      {/* Content Area */}
      <View style={styles.contentContainer}>{renderContent()}</View>
    </SafeAreaView>
  );
};

export default UsersScreen;

const tabWidth = (width * 0.9) / TABS.length;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  headerContainer: {
    width: "100%",
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: color.white,
    letterSpacing: 1,
    marginTop: 20,
  },
  tabContainer: {
    flexDirection: "row",
    alignSelf: "center",
    width: width * 0.9,
    marginTop: 10,
    position: "relative",
    paddingVertical: 8,
    backgroundColor: color.white,
    borderRadius: 20,
    elevation: 2,
    shadowColor: color.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: 20,
  },
  tabButtonActive: {
    backgroundColor: color.primary,
    marginHorizontal: 8,
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
    color: color.primaryDark,
  },
  tabLabelActive: {
    color: color.white,
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: tabWidth * 0.95,
    height: 3,
    backgroundColor: color.darkColor,
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
    marginTop: 10,
    width: "100%",
  },
  iconWrapper: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 9,
    fontWeight: "bold",
  },
});
