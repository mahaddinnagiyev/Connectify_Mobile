import React, { useCallback } from "react";
import {
  Pressable,
  SafeAreaView,
  Text,
  View,
  Image,
  ImageBackground,
  ImageSourcePropType,
  FlatList,
  ListRenderItemInfo,
} from "react-native";
import { color } from "@/colors";
import { styles } from "./style/previewScreen.style";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// Navigation
import { StackParamList } from "@navigation/UserStack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

// Functions
import { bannerDateLabel } from "@functions/messages.function";
import { setThemeKeyToStorage } from "@functions/storage.function";

interface Message {
  id: number;
  sender_id: string;
  content: string;
  message_type: string;
  created_at: Date;
}

const PreviewScreen: React.FC = () => {
  const { goBack } = useNavigation<NativeStackNavigationProp<StackParamList>>();

  const route = useRoute<RouteProp<StackParamList, "Preview">>();
  const { theme, themeKey, setSelectedKey } = route.params;

  const messages: Message[] = [
    {
      id: 1,
      sender_id: "me",
      content: "Hello",
      message_type: "text",
      created_at: new Date(),
    },
    {
      id: 2,
      sender_id: "other",
      content: "Hi there!",
      message_type: "text",
      created_at: new Date(),
    },
    {
      id: 3,
      sender_id: "me",
      content: "How are you?",
      message_type: "text",
      created_at: new Date(),
    },
    {
      id: 4,
      sender_id: "other",
      content: "I’m good, thanks!",
      message_type: "text",
      created_at: new Date(),
    },
  ];

  const handleSet = async () => {
    setSelectedKey(themeKey);
    await setThemeKeyToStorage(themeKey);
    goBack();
  };

  const keyExtractor = (item: Message) => item.id.toString();

  const renderMessage = useCallback(
    ({ item, index }: ListRenderItemInfo<Message>) => {
      const currDate = new Date(item.created_at).toDateString();
      const nextDate =
        index < messages.length - 1
          ? new Date(messages[index + 1].created_at).toDateString()
          : null;
      const showSeparator = currDate !== nextDate;

      const isMine = item.sender_id === "me";
      const bubbleStyle = isMine ? styles.sentBubble : styles.receivedBubble;
      const textStyle = isMine ? styles.sentText : styles.receivedText;

      return (
        <React.Fragment key={item.id}>
          <View
            style={[
              styles.timeContainer,
              {
                justifyContent: isMine ? "flex-end" : "flex-start",

                marginRight: !isMine ? 0 : 10,
                marginLeft: !isMine ? 10 : 0,
              },
            ]}
          >
            <Text style={[styles.timeText]}>
              {new Date(item.created_at).toLocaleTimeString("az", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            {isMine && (
              <Ionicons
                name="checkmark-done-sharp"
                size={15}
                color={color.primaryColor}
                style={{ marginTop: 2 }}
              />
            )}
          </View>
          <View
            style={[
              styles.messageWrapper,
              isMine
                ? { alignItems: "flex-end" }
                : { alignItems: "flex-start" },
            ]}
          >
            <View style={[styles.messageBubble, bubbleStyle]}>
              <Text style={textStyle}>{item.content}</Text>
            </View>
          </View>

          {showSeparator && (
            <View style={styles.dateSeparator}>
              <Text style={styles.dateText}>
                {bannerDateLabel(item.created_at.toString())}
              </Text>
            </View>
          )}
        </React.Fragment>
      );
    },
    []
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </Pressable>
        <View style={styles.userDetail}>
          <Image
            source={require("@assets/images/no-profile-photo.png")}
            style={styles.profilePhoto}
          />
          <View>
            <Text style={styles.roomName}>Preview User</Text>
            <Text style={styles.onlineStatus}>● Online</Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <ImageBackground
        source={theme as ImageSourcePropType}
        style={styles.background}
        imageStyle={{ resizeMode: "cover" }}
      >
        <FlatList
          data={messages.reverse()}
          keyExtractor={keyExtractor}
          renderItem={renderMessage}
          inverted
          contentContainerStyle={styles.flatListContent}
        />
      </ImageBackground>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <Pressable style={styles.cancelButton} onPress={goBack}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.setButton} onPress={handleSet}>
          <Text style={styles.setText}>Set</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default PreviewScreen;
