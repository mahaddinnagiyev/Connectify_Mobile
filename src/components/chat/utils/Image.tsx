import React, { useState } from "react";
import {
  StyleSheet,
  Image as RNImage,
  View,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import ImageViewer from "react-native-image-zoom-viewer";
import { MessagesDTO } from "@services/messenger/messenger.dto";

interface Props {
  message: MessagesDTO;
  bubbleStyle: any;
  onLongPress?: () => void;
}

const Image: React.FC<Props> = ({ message, bubbleStyle, onLongPress }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        hitSlop={10}
        onLongPress={onLongPress}
      >
        <View style={[styles.imageContainer, bubbleStyle]}>
          <RNImage
            source={{ uri: message.content }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>

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
