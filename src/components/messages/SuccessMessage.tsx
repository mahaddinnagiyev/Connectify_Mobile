import { color } from "@/colors";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
  PanResponder,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

type Props = {
  message: string;
  onClose?: () => void;
};

const SuccessMessage: React.FC<Props> = ({ message, onClose }) => {
  const translateY = new Animated.Value(-100);
  const pan = React.useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) =>
      Math.abs(gestureState.dy) > 10,
    onPanResponderMove: (_, gestureState) => {
      pan.setValue({ x: 0, y: gestureState.dy });
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy < -50) {
        closeMessage();
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const closeMessage = () => {
    Animated.timing(translateY, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose && onClose();
    });
  };

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      closeMessage();
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }, ...pan.getTranslateTransform()],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <Text style={styles.text}>{message}</Text>
      <Pressable style={styles.closeButton} onPress={closeMessage}>
        <FontAwesome6
          name="circle-check"
          size={24}
          color="white"
          style={styles.icon}
        />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    width: SCREEN_WIDTH - 32,
    marginHorizontal: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    backgroundColor: color.primaryColor,
    borderRadius: 12,
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    color: "white",
    fontSize: 15,
    flex: 1,
    fontWeight: "500",
    lineHeight: 20,
    marginRight: 12,
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    color: "white",
    fontSize: 24,
    lineHeight: 24,
  },
  icon: {
    marginRight: 12,
  },
});

export default SuccessMessage;
