import React, { useState } from "react";
import { StyleSheet, Image as RNImage, View, Pressable } from "react-native";
import { color } from "@/colors";
import Modal from "react-native-modal";
import ImageViewer from "react-native-image-zoom-viewer";

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

const Image: React.FC<Props> = ({
  message,
  bubbleStyle,
  thumbnailStyle,
  onLongPress,
  isSelected,
}) => {
  const dispatch = useDispatch();
  const { isSelectMenuVisible } = useSelector((state: RootState) => state.chat);

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Pressable
        hitSlop={10}
        onLongPress={onLongPress}
        onPress={() => {
          if (!isSelectMenuVisible) {
            setModalVisible(true);
          } else {
            isSelected
              ? dispatch(removeSelectedMessages(message))
              : dispatch(addSelectedMessages(message));
          }
        }}
        style={({ pressed }) => [
          {
            backgroundColor:
              pressed || isSelected ? color.solidColor : "transparent",
            borderRadius: 10,
          },
        ]}
      >
        <View style={[styles.imageContainer, bubbleStyle]}>
          <RNImage
            source={{ uri: message.content }}
            style={[styles.thumbnail, thumbnailStyle]}
            resizeMode="cover"
          />
        </View>
      </Pressable>

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        animationIn="fadeIn"
        animationOut="zoomOut"
        useNativeDriver
        style={styles.modal}
      >
        <View style={styles.viewerWrapper}>
          <ImageViewer
            imageUrls={[{ url: message.content }]}
            enableSwipeDown
            onSwipeDown={() => setModalVisible(false)}
            onCancel={() => setModalVisible(false)}
            backgroundColor="rgba(0,0,0,0.5)"
            saveToLocalByLongPress={false}
            renderIndicator={() => <></>}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    marginHorizontal: 10,
    maxWidth: "75%",
    borderRadius: 15,
    overflow: "hidden",
  },
  thumbnail: {
    width: 200,
    height: 200,
  },
  modal: {
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  viewerWrapper: {
    width: "100%",
    height: "100%",
  },
});

export default Image;
