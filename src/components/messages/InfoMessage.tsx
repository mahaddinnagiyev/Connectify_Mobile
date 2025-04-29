import React, { useEffect, useRef } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface InfoMessageProps {
  message: string;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const InfoMessage = ({ message, onClose }: InfoMessageProps) => {
  const progress = useRef(new Animated.Value(100)).current;
  const panY = useRef(new Animated.Value(0)).current;
  const entryY = useRef(new Animated.Value(50)).current;
  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (message) {
      Animated.spring(entryY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();

      Animated.timing(progress, {
        toValue: 0,
        duration: 10000,
        useNativeDriver: false,
      }).start();

      timer.current = setTimeout(onClose, 10000);
    }
    return () => {
      timer.current && clearTimeout(timer.current);
    };
  }, [message]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, { dy }) => {
        if (dy > 0) panY.setValue(dy);
      },
      onPanResponderRelease: (_, { dy }) => {
        if (dy > 20) {
          Animated.timing(panY, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          }).start(() => onClose());
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (!message) return null;

  const translateY = Animated.add(entryY, panY);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity: translateY.interpolate({
            inputRange: [0, 100],
            outputRange: [1, 0],
            extrapolate: "clamp",
          }),
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.content}>
        <MaterialIcons
          name="info"
          size={24}
          color={"#fff"}
          style={styles.icon}
        />
        <Text style={styles.text}>{message}</Text>
      </View>

      <Animated.View
        style={[
          styles.progressBar,
          {
            width: progress.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
          },
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#2196F3",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  text: {
    color: "white",
    fontSize: 14,
    flexShrink: 1,
  },
  progressBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 3,
    backgroundColor: "#fff",
  },
});

export default InfoMessage;
