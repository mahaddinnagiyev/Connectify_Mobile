import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Swipeable } from "react-native-gesture-handler";
import { MessagesDTO } from "@services/messenger/messenger.dto";
import { color } from "@/colors";

interface SwipeableMessageProps {
  message: MessagesDTO;
  setIsDetailMenuVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMessage: React.Dispatch<React.SetStateAction<MessagesDTO | null>>;
  children: React.ReactNode;
  setReplyMessage: (message: MessagesDTO | null) => void;
}

export const SwipeableMessage: React.FC<SwipeableMessageProps> = ({
  message,
  setIsDetailMenuVisible,
  setSelectedMessage,
  children,
  setReplyMessage,
}) => {
  const swipeableRef = useRef<Swipeable>(null);

  const renderReplyAction = () => (
    <View style={styles.replyAction}>
      <MaterialIcons name="reply" size={24} color={color.white} />
    </View>
  );

  const renderDtailAction = () => (
    <View style={styles.detailAction}>
      <MaterialIcons name="info" size={24} color={color.white} />
    </View>
  );

  const handleLeftOpen = () => {
    setReplyMessage(message);
    swipeableRef.current?.close();
  };

  const handleRightOpen = () => {
    setSelectedMessage(message);
    setIsDetailMenuVisible(true);
    swipeableRef.current?.close();
  };

  return (
    <Swipeable
      ref={swipeableRef}
      friction={1}
      leftThreshold={40}
      rightThreshold={40}
      renderLeftActions={renderReplyAction}
      renderRightActions={renderDtailAction}
      onSwipeableOpen={(direction) => {
        if (direction === "left") handleLeftOpen();
        if (direction === "right") handleRightOpen();
      }}
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

  detailAction: {
    justifyContent: "center",
    alignItems: "flex-end",
    width: 60,
    paddingRight: 8,
    marginLeft: -15,
    backgroundColor: "transparent",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    marginVertical: 5,
  },
});
