import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { MessagesDTO } from "@services/messenger/messenger.dto";
import { RouteProp, useRoute } from "@react-navigation/native";
import { StackParamList } from "@navigation/UserStack";
import { Audio as ExpoAudio } from "expo-av";

interface Props {
  message: MessagesDTO;
  bubbleStyle: any;
}

const Audio: React.FC<Props> = ({ message, bubbleStyle }) => {
  const route = useRoute<RouteProp<StackParamList, "Chat">>();
  const { chat } = route.params;

  // const audioRef = React.useRef<ExpoAudio.Sound>(null);
  const [audioStatus, setAudioStatus] = React.useState<"play" | "pause">(
    "pause"
  );

  const playAudio = async () => {
    const { sound } = await ExpoAudio.Sound.createAsync({
      uri: message.content,
    });
    if (audioStatus === "play") {
      await sound.pauseAsync();
      setAudioStatus("pause");
    } else {
      await sound.playAsync();
      setAudioStatus("play");
    }
  };

  return (
    <View style={[styles.audioContainer, bubbleStyle]}>
      {/* Play/Pause düyməsi */}
      <TouchableOpacity style={styles.playButton} onPress={playAudio}>
        <MaterialIcons
          name={audioStatus === "play" ? "pause" : "play-arrow"}
          size={24}
          color={message.sender_id !== chat.otherUser.id ? "white" : "black"}
        />
      </TouchableOpacity>

      {/* Proqres bar və vaxt eyni sətirdə */}
      <View style={styles.progressWrapper}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                backgroundColor:
                  message.sender_id !== chat.otherUser.id
                    ? "rgba(255,255,255,0.8)"
                    : "#666",
              },
            ]}
          />
        </View>
        <Text
          style={[
            styles.timeText,
            message.sender_id !== chat.otherUser.id && styles.sentTimeText,
          ]}
        >
          00:00
        </Text>
      </View>
    </View>
  );
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default Audio;

const styles = StyleSheet.create({
  audioContainer: {
    marginHorizontal: 10,
    maxWidth: "75%",
    borderRadius: 15,
    overflow: "hidden",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  playButton: {
    paddingHorizontal: 4,
  },
  progressWrapper: {
    flex: 1,
    gap: 6,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  timeText: {
    fontSize: 12,
    color: "rgba(0,0,0,0.6)",
    alignSelf: "flex-end",
  },
  sentTimeText: {
    color: "rgba(255,255,255,0.8)",
  },
});
