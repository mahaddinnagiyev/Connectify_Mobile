import React, { useState } from "react";
import { StyleSheet, View, Pressable, Dimensions } from "react-native";
import Modal from "react-native-modal";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";
import { MessagesDTO } from "@services/messenger/messenger.dto";
import { color } from "@/colors";
import CustomVideoPlayer from "../../modals/chat/CustomVideoPlayer";

interface Props {
  message: MessagesDTO;
  bubbleStyle: any;
}

const { width, height } = Dimensions.get("window");

const VideoWithModal: React.FC<Props> = ({ message, bubbleStyle }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState<AVPlaybackStatus>(
    {} as AVPlaybackStatus
  );

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <>
      <Pressable onPress={openModal} hitSlop={10}>
        <View style={[styles.videoContainer, bubbleStyle]}>
          <Video
            source={{ uri: message.content }}
            style={styles.videoPreview}
            resizeMode={ResizeMode.COVER}
            shouldPlay={false}
            isMuted={true}
            useNativeControls={false}
            onPlaybackStatusUpdate={setStatus}
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
