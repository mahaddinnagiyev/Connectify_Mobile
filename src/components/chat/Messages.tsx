import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { color } from "@/colors";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@redux/store";
import { setShowBackToBottom } from "@redux/chat/chatSilce";

const sampleMessages = [
  {
    id: 1,
    message_type: "TEXT",
    text: "Salam, necəsən?",
    type: "received",
    created_at: "12:00",
  },
  {
    id: 2,
    message_type: "TEXT",
    text: "Salam, necəsən?",
    type: "received",
    created_at: "12:01",
  },
  {
    id: 3,
    message_type: "TEXT",
    text: "Çox yaxşı, sən?",
    type: "sent",
    created_at: "12:01",
  },
  {
    id: 4,
    message_type: "TEXT",
    text: "Mən də yaxşıyam, təşəkkürlər.",
    type: "received",
    created_at: "12:02",
  },
  {
    id: 5,
    message_type: "TEXT",
    text: "Görüşək, danışarıq daha ətraflı.",
    type: "sent",
    created_at: "12:03",
  },
  {
    id: 6,
    message_type: "TEXT",
    text: "Tamam, gözləyirəm.",
    type: "received",
    created_at: "12:04",
  },
  {
    id: 7,
    message_type: "IMAGE",
    text: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqsqm2FOnWM9i_0doLydjjps1z35IJr3cW6g&s",
    type: "sent",
    created_at: "12:05",
  },
  {
    id: 8,
    message_type: "VIDEO",
    text: "http://stimg.cardekho.com/images/carexteriorimages/930x620/BMW/5-Series-2024/10182/1685002609273/front-left-side-47.jpg",
    type: "received",
    created_at: "12:07",
  },
  {
    id: 9,
    message_type: "AUDIO",
    text: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    type: "sent",
    created_at: "12:08",
  },
  {
    id: 10,
    message_type: "AUDIO",
    text: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    type: "received",
    created_at: "12:08",
  },
];

const Messages = () => {
  const dispatch = useDispatch();
  const scrollViewRef = useRef<ScrollView>(null);

  const { showBackToBottom } = useSelector((state: RootState) => state.chat);

  const handleScroll = (event: any) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const distanceFromBottom =
      contentSize.height - layoutMeasurement.height - contentOffset.y;

    if (distanceFromBottom < 100) {
      dispatch(dispatch(setShowBackToBottom(false)));
    } else {
      dispatch(dispatch(setShowBackToBottom(true)));
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {sampleMessages.map((message) => {
          const bubbleStyle =
            message.type === "sent" ? styles.sentBubble : styles.receivedBubble;

          let messageContent = null;

          if (message.message_type === "IMAGE") {
            messageContent = (
              <View style={[styles.imageContainer, bubbleStyle]}>
                <Image
                  source={{ uri: message.text }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            );
          } else if (message.message_type === "VIDEO") {
            messageContent = (
              <View style={[styles.videoContainer, bubbleStyle]}>
                <Image
                  source={{ uri: message.text }}
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
          } else if (message.message_type === "AUDIO") {
            messageContent = (
              <View style={[styles.audioContainer, bubbleStyle]}>
                <MaterialIcons
                  name="play-arrow"
                  size={24}
                  color={message.type === "sent" ? "white" : "black"}
                />
                <Text
                  style={[
                    { marginLeft: 8 },
                    message.type === "sent"
                      ? styles.sentText
                      : styles.receivedText,
                  ]}
                >
                  Audio Message
                </Text>
              </View>
            );
          } else {
            const textStyle =
              message.type === "sent" ? styles.sentText : styles.receivedText;
            messageContent = (
              <View style={[styles.messageBubble, bubbleStyle]}>
                <Text style={textStyle}>{message.text}</Text>
              </View>
            );
          }

          return (
            <View key={message.id} style={styles.messageWrapper}>
              {messageContent}
              <Text
                style={[
                  styles.timeText,
                  {
                    alignSelf:
                      message.type === "sent" ? "flex-end" : "flex-start",
                  },
                ]}
              >
                {message.created_at}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {showBackToBottom && (
        <MaterialIcons
          name="keyboard-arrow-down"
          size={24}
          color="black"
          style={styles.backToBottom}
          onPress={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        />
      )}
    </View>
  );
};

export default Messages;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    position: "relative",
  },
  container: {
    flex: 1,
    backgroundColor: color.inputBorderColor,
    paddingTop: 5,
  },
  contentContainer: {
    paddingVertical: 5,
  },
  messageWrapper: {
    marginBottom: 10,
    alignSelf: "stretch",
  },
  messageBubble: {
    marginHorizontal: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    maxWidth: "75%",
    borderRadius: 15,
  },
  sentBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#00ff00",
    borderBottomRightRadius: 0,
  },
  receivedBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#eee",
    borderBottomLeftRadius: 0,
  },
  sentText: {
    color: "white",
    fontSize: 14,
  },
  receivedText: {
    color: "black",
    fontSize: 14,
  },
  imageContainer: {
    marginHorizontal: 10,
    maxWidth: "75%",
    borderRadius: 15,
    overflow: "hidden",
  },
  image: {
    width: 200,
    height: 200,
  },
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
  audioContainer: {
    marginHorizontal: 10,
    maxWidth: "75%",
    borderRadius: 15,
    overflow: "hidden",
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 10,
    color: "#999",
    marginHorizontal: 15,
    marginTop: 4,
  },
  backToBottom: {
    position: "absolute",
    bottom: 15,
    right: 15,
    zIndex: 50,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 4,
  },
});
