import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Components
import DetailHeader from "@components/detail/DetailHeader";
import DetailActions from "@components/detail/DetailActions";
import DetailMedia from "@components/detail/DetailMedia";

const ChatDetailScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <DetailHeader />

        {/* Actions */}
        <DetailActions />

        {/* Media */}
        <DetailMedia />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatDetailScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    paddingBottom: 30,
  },
});
