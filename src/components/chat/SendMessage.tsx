import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { color } from "@/colors";
import { useDispatch, useSelector } from "react-redux";
import { setInputHeight } from "@redux/chat/chatSilce";
import { RootState } from "@redux/store";

const screenWidth = Dimensions.get("window").width;

const SendMessage = () => {
  const dispatch = useDispatch();
  const { inputHeight } = useSelector((state: RootState) => state.chat);

  return (
    <View style={styles.container}>
      {/* Attach File Button */}
      <View style={styles.leftButton}>
        <MaterialIcons name="attach-file" size={29} color="black" />
      </View>

      {/* Message Input */}
      <View
        style={[
          styles.messageInput,
          {
            height: Math.min(inputHeight, 100),
            borderWidth: inputHeight > 40 ? 1 : 0,
            borderColor: color.borderColor,
            borderRadius: 5,
          },
        ]}
      >
        <TextInput
          placeholder="Type a message"
          multiline
          scrollEnabled={false}
          onContentSizeChange={(e) => {
            dispatch(setInputHeight(e.nativeEvent.contentSize.height));
          }}
          style={styles.textInput}
        />
      </View>

      {/* Send Button */}
      <View style={styles.sendButton}>
        <Pressable>
          <MaterialIcons name="send" size={24} color="white" />
        </Pressable>
      </View>
    </View>
  );
};

export default SendMessage;

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    backgroundColor: color.inputBgColor,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: color.borderColor,
  },
  leftButton: {
    width: screenWidth * 0.12,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 4,
  },
  messageInput: {
    flex: 1,
    marginRight: 8,
    borderBottomColor: color.inputBorderColor,
    borderBottomWidth: 1,
    minHeight: 35,
  },
  textInput: {
    flex: 1,
    padding: 5,
    textAlignVertical: "top",
    fontSize: 16,
  },
  sendButton: {
    width: screenWidth * 0.12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: color.primaryColor,
    paddingVertical: 8,
    marginLeft: 4,
  },
});
