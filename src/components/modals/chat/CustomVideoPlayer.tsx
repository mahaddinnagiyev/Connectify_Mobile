import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Pressable, Text, Dimensions } from "react-native";
import { Video, AVPlaybackStatus, ResizeMode } from "expo-av";
import Slider from "@react-native-community/slider";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { color } from "@/colors";

const { width, height } = Dimensions.get("window");

interface CustomVideoPlayerProps {
  uri: string;
  autoPlay?: boolean;
  onClose: () => void;
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  uri,
  autoPlay = false,
  onClose,
}) => {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus>(
    {} as AVPlaybackStatus
  );
  const [showControls, setShowControls] = useState(true);

  // Auto-play or pause when modal opens/closes
  useEffect(() => {
    if (videoRef.current) {
      if (autoPlay) {
        videoRef.current.playAsync();
      } else {
        videoRef.current.pauseAsync();
      }
    }
  }, [autoPlay]);

  // Hide controls after 3 seconds
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls]);

  const togglePlayback = async () => {
    if ("isPlaying" in status && status.isPlaying) {
      await videoRef.current?.pauseAsync();
    } else {
      await videoRef.current?.playAsync();
    }
    setShowControls(true);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View style={styles.container}>
      {/* Video playback area */}
      <Pressable
        style={styles.videoWrapper}
        onPress={() => setShowControls((v) => !v)}
      >
        <Pressable
          style={styles.closeButton}
          onPress={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <MaterialCommunityIcons
            name="close-octagon-outline"
            size={30}
            color={color.primaryColor}
          />
        </Pressable>
        <Video
          ref={videoRef}
          source={{ uri }}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls={false}
          onPlaybackStatusUpdate={setStatus}
        />
      </Pressable>

      {/* Custom controls overlay */}
      {showControls && (
        <View style={styles.controlsContainer}>
          <Pressable onPress={togglePlayback} style={styles.playButton}>
            <MaterialIcons
              name={
                "isPlaying" in status && status.isPlaying
                  ? "pause"
                  : "play-arrow"
              }
              size={32}
              color="white"
            />
          </Pressable>

          <View style={styles.progressContainer}>
            <Text style={styles.timeText}>
              {formatTime(
                "positionMillis" in status ? status.positionMillis : 0
              )}
            </Text>

            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={
                "durationMillis" in status && status.durationMillis
                  ? status.durationMillis
                  : 1
              }
              value={
                "positionMillis" in status && status.positionMillis
                  ? status.positionMillis
                  : 0
              }
              onSlidingComplete={async (value) => {
                await videoRef.current?.setPositionAsync(value);
              }}
              minimumTrackTintColor={color.primaryColor}
              maximumTrackTintColor="#FFFFFF50"
              thumbTintColor={color.primaryColor}
            />

            <Text style={styles.timeText}>
              {formatTime(
                "durationMillis" in status && status.durationMillis
                  ? status.durationMillis
                  : 0
              )}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  videoWrapper: {
    width,
    height,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  controlsContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "transparent",
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  playButton: {
    alignSelf: "center",
    marginBottom: 15,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  timeText: {
    color: "white",
    fontSize: 12,
    minWidth: 40,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 999,
    padding: 5,
  },
});

export default CustomVideoPlayer;
