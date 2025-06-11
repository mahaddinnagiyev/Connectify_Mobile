import React, { useLayoutEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { color } from "@/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type InfoMessageProps = {
  message: string;
  onClose: () => void;
};

const InfoMessage: React.FC<InfoMessageProps> = ({ message, onClose }) => {
  const translateY = useRef(new Animated.Value(50)).current;
  const panY = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(100)).current;
  const timer = useRef<NodeJS.Timeout | null>(null);

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
          }).start(onClose);
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useLayoutEffect(() => {
    Animated.spring(translateY, {
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

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [message]);

  const animatedTranslateY = Animated.add(translateY, panY);

  const containerStyle: Animated.WithAnimatedObject<ViewStyle> = {
    transform: [{ translateY: animatedTranslateY }],
  };

  return (
    <Animated.View
      style={[styles.wrapper, containerStyle]}
      {...panResponder.panHandlers}
    >
      <LinearGradient
        colors={["#42A5F5", "#1E88E5"]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.gradient}
      >
        <MaterialIcons
          name="info"
          size={24}
          color={color.white}
          style={styles.icon}
        />
        <Text style={styles.messageText}>{message}</Text>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <MaterialIcons name="close" size={20} color={color.white} />
        </Pressable>
      </LinearGradient>
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
  wrapper: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: color.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  icon: {
    marginRight: 12,
  },
  messageText: {
    flex: 1,
    color: color.white,
    fontSize: 14,
    fontWeight: "500",
  },
  closeButton: {
    padding: 6,
    marginLeft: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
  },
  progressBar: {
    height: 3,
    backgroundColor: color.white,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
});

export default InfoMessage;
