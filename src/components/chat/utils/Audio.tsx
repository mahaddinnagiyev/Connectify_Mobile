import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";

// Expo
import { MaterialIcons } from "@expo/vector-icons";
import { Audio as ExpoAudio, AVPlaybackStatus } from "expo-av";

// Services
import { MessagesDTO } from "@services/messenger/messenger.dto";

// Navigation
import { StackParamList } from "@navigation/UserStack";
import { RouteProp, useRoute } from "@react-navigation/native";

interface Props {
  message: MessagesDTO;
  bubbleStyle: any;
}

const Audio: React.FC<Props> = ({ message, bubbleStyle }) => {
  const route = useRoute<RouteProp<StackParamList, "Chat">>();
  const { chat } = route.params;

  const soundRef = useRef<ExpoAudio.Sound | null>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let isMounted = true;

    ExpoAudio.Sound.createAsync(
      { uri: message.content },
      { shouldPlay: false },
      (status: AVPlaybackStatus) => {
        if (!isMounted || !status.isLoaded) return;
        setDuration(status.durationMillis || 0);
      }
    ).then(({ sound }) => {
      soundRef.current = sound;
      sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (!isMounted || !status.isLoaded) return;
        setPlaying(status.isPlaying);
        setPosition(status.positionMillis);
      });
    });

    return () => {
      isMounted = false;
      soundRef.current?.unloadAsync();
    };
  }, [message.content]);

  const togglePlay = async () => {
    const sound = soundRef.current;
    if (!sound) return;

    if (playing) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const progressPercent = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View style={[styles.audioContainer, bubbleStyle]}>
      <TouchableOpacity style={styles.playButton} onPress={togglePlay}>
        <MaterialIcons
          name={playing ? "pause" : "play-arrow"}
          size={24}
          color={message.sender_id !== chat.otherUser.id ? "white" : "black"}
        />
      </TouchableOpacity>

      <View style={styles.progressWrapper}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${progressPercent}%`,
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
          {formatTime(Math.floor(position / 1000))} /{" "}
          {formatTime(Math.floor(duration / 1000))}
        </Text>
      </View>
    </View>
  );
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
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
