import { StyleSheet, View, ActivityIndicator } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { MessagesDTO } from "@services/messenger/messenger.dto";
import { ResizeMode, Video } from "expo-av";
import { color } from "@/colors";

interface Props {
  message: MessagesDTO;
  bubbleStyle: any;
}

const VideoMessage: React.FC<Props> = ({ message, bubbleStyle }) => {
  return (
    <View style={[styles.videoContainer, bubbleStyle]}>
      <Video
        source={{ uri: message.content }}
        style={styles.videoPreview}
        resizeMode={ResizeMode.COVER}
        shouldPlay={false}
        isMuted={true}
        useNativeControls={false}
      />

      <View style={styles.playIconContainer}>
        <MaterialIcons
          name="play-circle-outline"
          size={50}
          color={color.primaryColor}
        />
      </View>
    </View>
  );
};

export default VideoMessage;

const styles = StyleSheet.create({
  videoContainer: {
    marginHorizontal: 10,
    maxWidth: "75%",
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  videoPreview: {
    width: 200,
    height: 200,
  },
  playIconContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});
