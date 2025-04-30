import { View } from "react-native";
import React from "react";
import MessengerHeader from "./utils/MessengerHeader";
import UserChats from "./utils/UserChats";

const Messenger = () => {
  return (
    <View>
      <MessengerHeader />
      <UserChats />
    </View>
  );
};

export default Messenger;
