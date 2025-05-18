import { Dimensions, SafeAreaView } from "react-native";
import React from "react";
import MessengerHeader from "./utils/MessengerHeader";
import UserChats from "./utils/UserChats";

const { width, height } = Dimensions.get("window");

const Messenger = () => {
  return (
    <SafeAreaView style={{ flex: 1, maxHeight: height, maxWidth: width }}>
      <MessengerHeader />
      <UserChats />
    </SafeAreaView>
  );
};

export default Messenger;
