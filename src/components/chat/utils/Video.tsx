import { StyleSheet, Image, View } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { MessagesDTO } from "@services/messenger/messenger.dto";

interface Props {
  message: MessagesDTO;
  bubbleStyle: any;
}

const Video: React.FC<Props> = ({ message, bubbleStyle }) => {
  return (
    <View style={[styles.videoContainer, bubbleStyle]}>
      <Image
        source={{ uri: message.content }}
        style={styles.videoThumbnail}
        resizeMode="cover"
      />
      <View style={styles.playIconContainer}>
        <MaterialIcons
          name="play-circle-outline"
          size={50}
          color="rgba(255,255,255,0.8)"
        />
      </View>
    </View>
  );
};

export default Video;

const styles = StyleSheet.create({
  videoContainer: {
    marginHorizontal: 10,
    maxWidth: "75%",
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  videoThumbnail: {
    width: 200,
    height: 200,
  },
  playIconContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});
