import React, { useEffect, useRef } from "react";
import { View, Text, ScrollView } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@redux/store";
import { setShowBackToBottom } from "@redux/chat/chatSilce";
import Image from "./utils/Image";
import Video from "./utils/Video";
import File from "./utils/File";
import Audio from "./utils/Audio";
import { styles } from "./styles/messages.style";
import { MessageType } from "@services/messenger/messenger.dto";

const sampleMessages = [
  {
    id: 1,
    message_type: MessageType.TEXT,
    text: "Salam, necəsən?",
    type: "received",
    created_at: "12:00",
  },
  {
    id: 2,
    message_type: MessageType.TEXT,
    text: "Salam, necəsən?",
    type: "received",
    created_at: "12:01",
  },
  {
    id: 3,
    message_type: MessageType.TEXT,
    text: "Çox yaxşı, sən?",
    type: "sent",
    created_at: "12:01",
  },
  {
    id: 4,
    message_type: MessageType.TEXT,
    text: "Mən də yaxşıyam, təşəkkürlər.",
    type: "received",
    created_at: "12:02",
  },
  {
    id: 5,
    message_type: MessageType.TEXT,
    text: "Görüşək, danışarıq daha ətraflı.",
    type: "sent",
    created_at: "12:03",
  },
  {
    id: 6,
    message_type: MessageType.TEXT,
    text: "Tamam, gözləyirəm.",
    type: "received",
    created_at: "12:04",
  },
  {
    id: 7,
    message_type: MessageType.IMAGE,
    text: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqsqm2FOnWM9i_0doLydjjps1z35IJr3cW6g&s",
    type: "sent",
    created_at: "12:05",
  },
  {
    id: 8,
    message_type: MessageType.VIDEO,
    text: "http://stimg.cardekho.com/images/carexteriorimages/930x620/BMW/5-Series-2024/10182/1685002609273/front-left-side-47.jpg",
    type: "received",
    created_at: "12:07",
  },
  {
    id: 9,
    message_type: MessageType.AUDIO,
    text: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    type: "sent",
    created_at: "12:08",
  },
  {
    id: 10,
    message_type: MessageType.AUDIO,
    text: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    type: "received",
    created_at: "12:08",
  },
  {
    id: 11,
    message_type: MessageType.DEFAULT,
    text: "User Johndoe created this chatroom.",
    created_at: "12:08",
  },
  {
    id: 12,
    message_type: MessageType.FILE,
    message_name: "file.pdf",
    message_size: 1024,
    text: "https://file.url.com/file.pdf",
    type: "sent",
    created_at: "12:08",
  },
  {
    id: 13,
    message_type: MessageType.FILE,
    message_name: "file.pdf",
    message_size: 1024,
    text: "https://file.url.com/file.pdf",
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
      dispatch(setShowBackToBottom(false));
    } else {
      dispatch(setShowBackToBottom(true));
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

          const textStyle =
            message.type === "sent" ? styles.sentText : styles.receivedText;

          let messageContent = null;

          switch (message.message_type) {
            case MessageType.IMAGE:
              messageContent = (
                <Image message={message} bubbleStyle={bubbleStyle} />
              );
              break;

            case MessageType.VIDEO:
              messageContent = (
                <Video message={message} bubbleStyle={bubbleStyle} />
              );
              break;

            case MessageType.AUDIO:
              messageContent = (
                <Audio
                  message={message}
                  bubbleStyle={bubbleStyle}
                  duration={20}
                  currentTime={10}
                />
              );
              break;

            case MessageType.FILE:
              messageContent = (
                <File message={message} bubbleStyle={bubbleStyle} />
              );
              break;

            case MessageType.DEFAULT:
              messageContent = (
                <View style={[styles.messageBubble, styles.defaultContainer]}>
                  <Text style={styles.defaultText}>{message.text}</Text>
                </View>
              );
              break;

            default:
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

                    display:
                      message.message_type === MessageType.DEFAULT
                        ? "none"
                        : "flex",
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
