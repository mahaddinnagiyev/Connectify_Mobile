import React, { useRef } from "react";
import { View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Swipeable } from "react-native-gesture-handler";
import { MessagesDTO } from "@services/messenger/messenger.dto";
import { useDispatch } from "react-redux";
import { setReplyMessage } from "@/src/redux/chat/chatSlice";
import { StyleSheet } from "react-native";

interface SwipeableMessageProps {
  message: MessagesDTO;
  children: React.ReactNode;
}

export const SwipeableMessage: React.FC<{
  message: MessagesDTO;
  children: React.ReactNode;
}> = ({ message, children }) => {
  const dispatch = useDispatch();
  const swipeableRef = useRef<Swipeable>(null);

  const renderReplyAction = () => (
    <View style={styles.replyAction}>
      <MaterialIcons name="reply" size={24} color="white" />
    </View>
  );

  const handleLeftOpen = () => {
    dispatch(setReplyMessage(message));
    swipeableRef.current?.close();
  };

  return (
    <Swipeable
      ref={swipeableRef}
      friction={1}
      leftThreshold={15}
      renderLeftActions={renderReplyAction}
      onSwipeableLeftOpen={handleLeftOpen}
    >
      {children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  replyAction: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: 60,
    paddingLeft: 8,
    marginRight: -15,
    backgroundColor: "transparent",
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    marginVertical: 5,
  },
});
