import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  LayoutChangeEvent,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";

// Expo
import { MaterialIcons } from "@expo/vector-icons";
import { Audio as ExpoAudio, AVPlaybackStatus } from "expo-av";

// Services
import { MessagesDTO } from "@services/messenger/messenger.dto";

// Navigation
import { StackParamList } from "@navigation/UserStack";
import { RouteProp, useRoute } from "@react-navigation/native";

// Redux
import { RootState } from "@redux/store";
import { useSelector } from "react-redux";

interface Props {
  message: MessagesDTO;
  bubbleStyle: any;
}

const Audio: React.FC<Props> = ({ message, bubbleStyle }) => {
  const route = useRoute<RouteProp<StackParamList, "Chat">>();
  const { chat } = route.params;

  const { selectedMessages } = useSelector((state: RootState) => state.chat);

  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const isSent = message.sender_id !== chat.otherUser.id;

  const soundRef = useRef<ExpoAudio.Sound | null>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = async () => {
    const sound = soundRef.current;
    if (!sound) return;

    if (playing) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const handleProgressPress = async (event: any) => {
    if (!soundRef.current || duration === 0) return;

    const touchX = event.nativeEvent.locationX;
    const newPosition = (touchX / progressBarWidth) * duration;

    await soundRef.current.setPositionAsync(Math.floor(newPosition));
  };

  const handleProgressLayout = (e: LayoutChangeEvent) => {
    setProgressBarWidth(e.nativeEvent.layout.width);
  };

  const progressPercent = duration > 0 ? (position / duration) * 100 : 0;

  useEffect(() => {
    let isMounted = true;

    const loadSound = async () => {
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
    };

    loadSound();
    return () => {
      isMounted = false;
      soundRef.current?.unloadAsync();
    };
  }, [message.content]);

  return (
    <View
      style={[
        styles.audioContainer,
        isSent ? styles.sentBubble : styles.receivedBubble,
        bubbleStyle,
      ]}
    >
      <TouchableOpacity
        style={[styles.playButton, isSent && styles.sentPlayButton]}
        onPress={togglePlay}
        disabled={selectedMessages.length > 0}
      >
        <MaterialIcons
          name={playing ? "pause" : "play-arrow"}
          size={24}
          color={isSent ? "#fff" : "#000"}
        />
      </TouchableOpacity>

      <View style={styles.progressWrapper}>
        <TouchableOpacity
          style={styles.progressTouchable}
          onPress={handleProgressPress}
          activeOpacity={0.7}
          onLayout={handleProgressLayout}
          disabled={selectedMessages.length > 0}
        >
          <View
            style={[
              styles.progressBarBackground,
              isSent && styles.sentProgressBackground,
            ]}
          >
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressPercent}%` },
                isSent ? styles.sentProgressFill : styles.receivedProgressFill,
              ]}
            />
          </View>
        </TouchableOpacity>

        <Text style={[styles.timeText, isSent && styles.sentTimeText]}>
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
    borderRadius: 20,
    paddingVertical: 9,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sentBubble: {
    backgroundColor: "#2979FF",
  },
  receivedBubble: {
    backgroundColor: "#F1F0F5",
  },
  playButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: 8,
  },
  sentPlayButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  progressWrapper: {
    flex: 1,
    gap: 8,
  },
  progressTouchable: {
    width: "100%",
  },
  progressBarBackground: {
    height: 7,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 3,
    overflow: "hidden",
  },
  sentProgressBackground: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  sentProgressFill: {
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  receivedProgressFill: {
    backgroundColor: "#666",
  },
  timeText: {
    fontSize: 12,
    color: "rgba(0,0,0,0.6)",
  },
  sentTimeText: {
    color: "rgba(255,255,255,0.9)",
  },
});
