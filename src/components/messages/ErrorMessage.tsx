import React, { useEffect, useLayoutEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

const SCREEN_WIDTH = Dimensions.get("window").width;

type Props = {
  message: string;
  onClose?: () => void;
};

const ErrorMessage: React.FC<Props> = ({ message, onClose }) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const scaleY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dy) > 10,
    onPanResponderMove: (_, gs) => pan.setValue({ x: 0, y: gs.dy }),
    onPanResponderRelease: (_, gs) => {
      if (gs.dy < -50) {
        dismiss();
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      }
    },
  });

  useLayoutEffect(() => {
    Animated.sequence([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.parallel([
        Animated.spring(scaleY, {
          toValue: 1,
          useNativeDriver: true,
          tension: 30,
          friction: 7,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const id = setTimeout(dismiss, 5000);
    return () => clearTimeout(id);
  }, []);

  const dismiss = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onClose && onClose());
  };

  const containerAnimatedStyle: Animated.WithAnimatedObject<ViewStyle> = {
    transform: [{ translateY }, ...pan.getTranslateTransform(), { scaleY }],
    opacity,
  };

  return (
    <Animated.View
      style={[styles.wrapper, containerAnimatedStyle]}
      {...panResponder.panHandlers}
    >
      <LinearGradient
        colors={["#FF5252", "#E04848"]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.gradient}
      >
        <MaterialIcons
          name="error-outline"
          size={28}
          color="white"
          style={styles.icon}
        />
        <Text style={styles.messageText}>{message}</Text>
        <Pressable style={styles.closeButton} onPress={dismiss}>
          <MaterialIcons name="close" size={20} color="white" />
        </Pressable>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 50,
    left: 16,
    width: SCREEN_WIDTH - 32,
    zIndex: 1000,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  icon: {
    marginRight: 12,
  },
  messageText: {
    flex: 1,
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
  },
  closeButton: {
    marginLeft: 12,
    padding: 6,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
});

export default ErrorMessage;
