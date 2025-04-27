import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

interface Props {
  message: any;
  bubbleStyle: any;
}

const Audio: React.FC<Props> = ({ message, bubbleStyle }) => {
  return (
    <View style={[styles.audioContainer, bubbleStyle]}>
      <MaterialIcons
        name="play-arrow"
        size={24}
        color={message.type === "sent" ? "white" : "black"}
      />
      <Text
        style={{
          marginLeft: 8,
          ...(message.type === "sent" ? styles.sentText : styles.receivedText),
        }}
      >
        Audio Message
      </Text>
    </View>
  );
};

export default Audio;

const styles = StyleSheet.create({
  sentText: {
    color: "white",
    fontSize: 14,
  },
  receivedText: {
    color: "black",
    fontSize: 14,
  },
  audioContainer: {
    marginHorizontal: 10,
    maxWidth: "75%",
    borderRadius: 15,
    overflow: "hidden",
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
});
