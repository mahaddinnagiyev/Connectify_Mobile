import { StyleSheet, Image as RNImage, View } from "react-native";
import React from "react";

interface Props {
  message: any;
  bubbleStyle: any;
}

const Image: React.FC<Props> = ({ message, bubbleStyle }) => {
  return (
    <View style={[styles.imageContainer, bubbleStyle]}>
      <RNImage
        source={{ uri: message.text }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
};

export default Image;

const styles = StyleSheet.create({
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
});
