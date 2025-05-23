import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Pressable } from "react-native";

// Expo
import { Video, ResizeMode } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";

// UI Components
import { color } from "@/colors";
import Modal from "react-native-modal";
import CustomVideoPlayer from "../../modals/chat/CustomVideoPlayer";

// Services
import { MessagesDTO } from "@services/messenger/messenger.dto";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import {
  addSelectedMessages,
  removeSelectedMessages,
} from "@redux/chat/chatSlice";

interface Props {
  message: MessagesDTO;
  bubbleStyle: any;
  thumbnailStyle?: any;
  isSelected?: boolean;
  onLongPress?: () => void;
}

const VideoWithModal: React.FC<Props> = ({
  message,
  bubbleStyle,
  thumbnailStyle,
  onLongPress,
  isSelected,
}) => {
  const dispatch = useDispatch();
  const { isSelectMenuVisible } = useSelector((state: RootState) => state.chat);

  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <>
      <Pressable
        onLongPress={onLongPress}
        hitSlop={10}
        onPress={() => {
          if (!isSelectMenuVisible) {
            openModal();
          } else {
            isSelected
              ? dispatch(removeSelectedMessages(message))
              : dispatch(addSelectedMessages(message));
          }
        }}
        style={[
          {
            backgroundColor: isSelected ? color.solidColor : "transparent",
            borderRadius: 10,
          },
        ]}
      >
        <View style={[styles.videoContainer, bubbleStyle]}>
          <Video
            source={{ uri: message.content }}
            style={[styles.videoPreview, thumbnailStyle]}
            resizeMode={ResizeMode.COVER}
            shouldPlay={false}
            isMuted={true}
            useNativeControls={false}
          />
          <View style={styles.playIconContainer}>
            <MaterialIcons
              name="play-circle-outline"
              size={50}
              color={color.primaryColor}
            />
          </View>
        </View>
      </Pressable>

      <Modal
        isVisible={modalVisible}
        onBackdropPress={closeModal}
        onBackButtonPress={closeModal}
        propagateSwipe={true}
        swipeDirection={["down"]}
        onSwipeComplete={closeModal}
        animationIn="fadeIn"
        animationOut="fadeOut"
        useNativeDriver
        style={styles.modal}
      >
        <CustomVideoPlayer
          uri={message.content}
          autoPlay={modalVisible}
          onClose={closeModal}
        />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    marginHorizontal: 10,
    maxWidth: "75%",
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  videoPreview: {
    width: 200,
    height: 200,
  },
  playIconContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default VideoWithModal;
