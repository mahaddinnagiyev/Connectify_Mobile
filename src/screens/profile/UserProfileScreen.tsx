import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import ProfilePage from "@components/profile/ProfilePage";
import { useUserData } from "@/src/hooks/useUserData";
import { color } from "@/colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { StackParamList } from "@/src/navigation/UserStack";
import { SafeAreaView } from "react-native-safe-area-context";

const UserProfileScreen = () => {
  const { isOtherUserDataLoading } = useUserData();

  const navigate = useNavigation<NativeStackNavigationProp<StackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{`Profile`}</Text>
        <Pressable
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          onPress={() => navigate.goBack()}
        >
          <Text style={styles.headerButtonText}>Back</Text>
        </Pressable>
      </View>
      {isOtherUserDataLoading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={color.primaryColor} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <ProfilePage isMyProfileScreen={false} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "stretch" },
  scrollContainer: { flexGrow: 1 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  loadingIndicator: {
    transform: [{ scale: 1.5 }],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 60,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ececec",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  headerButtonText: {
    fontSize: 16,
    fontWeight: 800,
    color: color.primaryColor,
    backgroundColor: color.inputBgColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: color.primaryColor,
  },
});
